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

package mcp

import (
	"encoding/json"
	"fmt"
	"net/url"
)

type (
	ServerConfig struct {
		Name    string
		BaseURL string
		APIKey  string
	}

	ClaudeDesktopConfig struct {
		MCPServers map[string]claudeServerEntry `json:"mcpServers"`
	}

	claudeServerEntry struct {
		URL     string            `json:"url"`
		Headers map[string]string `json:"headers,omitempty"`
	}

	ClaudeCodeConfig struct {
		MCPServers map[string]claudeCodeServerEntry `json:"mcpServers"`
	}

	claudeCodeServerEntry struct {
		URL     string            `json:"url"`
		Headers map[string]string `json:"headers,omitempty"`
	}
)

func MCPEndpoint(baseURL string) (string, error) {
	u, err := url.Parse(baseURL)
	if err != nil {
		return "", fmt.Errorf("cannot parse base URL: %w", err)
	}

	u.Path = "/mcp/v1"

	return u.String(), nil
}

func GenerateClaudeDesktopJSON(cfg ServerConfig) ([]byte, error) {
	endpoint, err := MCPEndpoint(cfg.BaseURL)
	if err != nil {
		return nil, err
	}

	name := cfg.Name
	if name == "" {
		name = "soc2start"
	}

	config := ClaudeDesktopConfig{
		MCPServers: map[string]claudeServerEntry{
			name: {
				URL: endpoint,
				Headers: map[string]string{
					"Authorization": "Bearer " + cfg.APIKey,
				},
			},
		},
	}

	return json.MarshalIndent(config, "", "  ")
}

func GenerateClaudeCodeJSON(cfg ServerConfig) ([]byte, error) {
	endpoint, err := MCPEndpoint(cfg.BaseURL)
	if err != nil {
		return nil, err
	}

	name := cfg.Name
	if name == "" {
		name = "soc2start"
	}

	config := ClaudeCodeConfig{
		MCPServers: map[string]claudeCodeServerEntry{
			name: {
				URL: endpoint,
				Headers: map[string]string{
					"Authorization": "Bearer " + cfg.APIKey,
				},
			},
		},
	}

	return json.MarshalIndent(config, "", "  ")
}

func GenerateGenericJSON(cfg ServerConfig) ([]byte, error) {
	endpoint, err := MCPEndpoint(cfg.BaseURL)
	if err != nil {
		return nil, err
	}

	generic := map[string]any{
		"url": endpoint,
		"headers": map[string]string{
			"Authorization": "Bearer " + cfg.APIKey,
		},
	}

	return json.MarshalIndent(generic, "", "  ")
}
