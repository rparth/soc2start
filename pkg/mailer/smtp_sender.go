// Copyright (c) 2025-2026 Probo Inc <hello@getprobo.com>.
//
// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.
//
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
// REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
// AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
// INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
// LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
// OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
// PERFORMANCE OF THIS SOFTWARE.

package mailer

import (
	"bytes"
	"context"
	"crypto/tls"
	"fmt"
	"net"
	"net/smtp"
	"os"

	"github.com/jhillyerd/enmime"
)

type SMTPSender struct {
	cfg         SMTPConfig
	senderEmail string
}

func NewSMTPSender(cfg SMTPConfig, senderEmail string) *SMTPSender {
	return &SMTPSender{
		cfg:         cfg,
		senderEmail: senderEmail,
	}
}

func (s *SMTPSender) Send(ctx context.Context, msg *Message) error {
	mail := enmime.Builder().
		Subject(msg.Subject).
		From("", msg.From).
		To("", msg.To).
		Text([]byte(msg.TextBody))

	if msg.ReplyTo != "" {
		mail = mail.ReplyTo("", msg.ReplyTo)
	}

	if msg.HTMLBody != "" {
		mail = mail.HTML([]byte(msg.HTMLBody))
	}

	for key, val := range msg.Headers {
		mail = mail.Header(key, val)
	}

	for _, att := range msg.Attachments {
		mail = mail.AddAttachment(att.Content, att.ContentType, att.Filename)
	}

	envelope, err := mail.Build()
	if err != nil {
		return fmt.Errorf("cannot build email: %w", err)
	}

	var buf bytes.Buffer
	if err := envelope.Encode(&buf); err != nil {
		return fmt.Errorf("cannot encode email: %w", err)
	}

	return s.sendRaw(ctx, []string{msg.To}, buf.Bytes())
}

func (s *SMTPSender) sendRaw(ctx context.Context, to []string, msg []byte) error {
	host, _, err := net.SplitHostPort(s.cfg.Addr)
	if err != nil {
		return fmt.Errorf("invalid address: %w", err)
	}

	var d net.Dialer

	conn, err := d.DialContext(ctx, "tcp", s.cfg.Addr)
	if err != nil {
		return fmt.Errorf("connection error: %w", err)
	}

	defer func() { _ = conn.Close() }()

	if deadline, ok := ctx.Deadline(); ok {
		if err := conn.SetDeadline(deadline); err != nil {
			return fmt.Errorf("cannot set connection deadline: %w", err)
		}
	}

	c, err := smtp.NewClient(conn, host)
	if err != nil {
		return fmt.Errorf("SMTP client creation error: %w", err)
	}

	defer func() { _ = c.Quit() }()

	helloName := s.cfg.HelloName
	if helloName == "" {
		if helloName, err = os.Hostname(); err != nil {
			helloName = "localhost"
		}
	}

	if err := c.Hello(helloName); err != nil {
		return fmt.Errorf("SMTP EHLO error: %w", err)
	}

	if s.cfg.TLSRequired {
		if err := c.StartTLS(&tls.Config{ServerName: host}); err != nil {
			return fmt.Errorf("TLS negotiation error: %w", err)
		}
	}

	if s.cfg.User != "" && s.cfg.Password != "" {
		auth := smtp.PlainAuth("", s.cfg.User, s.cfg.Password, host)
		if err = c.Auth(auth); err != nil {
			return fmt.Errorf("SMTP authentication error: %w", err)
		}
	}

	if err = c.Mail(s.senderEmail); err != nil {
		return fmt.Errorf("MAIL FROM error: %w", err)
	}

	for _, addr := range to {
		if err = c.Rcpt(addr); err != nil {
			return fmt.Errorf("RCPT TO error: %w", err)
		}
	}

	wr, err := c.Data()
	if err != nil {
		return fmt.Errorf("DATA command error: %w", err)
	}

	_, err = wr.Write(msg)
	if err != nil {
		return fmt.Errorf("message write error: %w", err)
	}

	if err = wr.Close(); err != nil {
		return fmt.Errorf("message close error: %w", err)
	}

	return nil
}
