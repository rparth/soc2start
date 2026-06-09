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

// Package openclaw provides the OpenClaw AI skill for the Probo platform.
//
// OpenClaw is a compliance-aware AI skill that connects to the Probo MCP
// server and provides domain-specific capabilities for SOC 2, GDPR, and
// other compliance frameworks. It can be used by AI agents (Claude, Codex,
// OpenAI) to interact with the Probo platform programmatically.
package openclaw

const SkillName = "openclaw"

type (
	Skill struct {
		Name        string
		Description string
		MCPEndpoint string
		APIKey      string
	}

	SkillConfig struct {
		MCPEndpoint string
		APIKey      string
	}
)

func NewSkill(cfg SkillConfig) *Skill {
	return &Skill{
		Name:        SkillName,
		Description: "Probo compliance platform skill — manage controls, evidence, risks, audits, and frameworks via the MCP API",
		MCPEndpoint: cfg.MCPEndpoint,
		APIKey:      cfg.APIKey,
	}
}
