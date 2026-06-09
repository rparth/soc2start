// Copyright (c) 2026 Probo Inc <hello@getprobo.com>.
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
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"go.gearno.de/kit/httpclient"
	"go.gearno.de/kit/log"
)

type ResendSender struct {
	apiKey string
	client *http.Client
	logger *log.Logger
}

func NewResendSender(apiKey string, logger *log.Logger) *ResendSender {
	return &ResendSender{
		apiKey: apiKey,
		client: httpclient.DefaultPooledClient(
			httpclient.WithLogger(logger),
			httpclient.WithSSRFProtection(),
		),
		logger: logger,
	}
}

type (
	resendRequest struct {
		From        string              `json:"from"`
		To          []string            `json:"to"`
		Subject     string              `json:"subject"`
		HTML        string              `json:"html,omitempty"`
		Text        string              `json:"text,omitempty"`
		ReplyTo     string              `json:"reply_to,omitempty"`
		Headers     map[string]string   `json:"headers,omitempty"`
		Attachments []resendAttachment  `json:"attachments,omitempty"`
	}

	resendAttachment struct {
		Filename    string `json:"filename"`
		ContentType string `json:"content_type,omitempty"`
		Content     string `json:"content"`
	}

	resendErrorResponse struct {
		StatusCode int    `json:"statusCode"`
		Name       string `json:"name"`
		Message    string `json:"message"`
	}
)

func (s *ResendSender) Send(ctx context.Context, msg *Message) error {
	from := msg.FromEmail
	if msg.FromName != "" {
		from = msg.FromName + " <" + msg.FromEmail + ">"
	}

	req := resendRequest{
		From:    from,
		To:      []string{msg.To},
		Subject: msg.Subject,
		Text:    msg.TextBody,
	}

	if msg.HTMLBody != "" {
		req.HTML = msg.HTMLBody
	}

	if msg.ReplyTo != "" {
		req.ReplyTo = msg.ReplyTo
	}

	if len(msg.Headers) > 0 {
		req.Headers = msg.Headers
	}

	for _, att := range msg.Attachments {
		req.Attachments = append(
			req.Attachments,
			resendAttachment{
				Filename:    att.Filename,
				ContentType: att.ContentType,
				Content:     base64.StdEncoding.EncodeToString(att.Content),
			},
		)
	}

	return s.sendViaAPI(ctx, &req)
}

func (s *ResendSender) sendViaAPI(ctx context.Context, payload *resendRequest) error {
	body, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("cannot marshal Resend request: %w", err)
	}

	httpReq, err := http.NewRequestWithContext(
		ctx,
		http.MethodPost,
		"https://api.resend.com/emails",
		bytes.NewReader(body),
	)
	if err != nil {
		return fmt.Errorf("cannot create Resend request: %w", err)
	}

	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("Authorization", "Bearer "+s.apiKey)

	resp, err := s.client.Do(httpReq)
	if err != nil {
		return fmt.Errorf("cannot send Resend request: %w", err)
	}

	defer func() { _ = resp.Body.Close() }()

	if resp.StatusCode >= 400 {
		respBody, _ := io.ReadAll(resp.Body)

		var errResp resendErrorResponse
		if json.Unmarshal(respBody, &errResp) == nil && errResp.Message != "" {
			return fmt.Errorf("Resend API error %d: %s", resp.StatusCode, errResp.Message)
		}

		return fmt.Errorf("Resend API error %d: %s", resp.StatusCode, string(respBody))
	}

	return nil
}
