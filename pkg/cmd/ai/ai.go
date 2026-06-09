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

package ai

import (
	"encoding/json"
	"fmt"

	"github.com/spf13/cobra"
	"go.probo.inc/probo/ai/mcp"
	"go.probo.inc/probo/pkg/cmd/cmdutil"
)

func NewCmdAI(f *cmdutil.Factory) *cobra.Command {
	cmd := &cobra.Command{
		Use:   "ai <command>",
		Short: "AI integration tools",
	}

	cmd.AddCommand(newCmdMCP(f))

	return cmd
}

func newCmdMCP(f *cmdutil.Factory) *cobra.Command {
	cmd := &cobra.Command{
		Use:   "mcp <command>",
		Short: "MCP server connection tools",
	}

	cmd.AddCommand(newCmdMCPConnect(f))

	return cmd
}

func newCmdMCPConnect(f *cmdutil.Factory) *cobra.Command {
	var (
		name   string
		format string
	)

	cmd := &cobra.Command{
		Use:   "connect",
		Short: "Generate MCP connection configuration for AI clients",
		Long: `Generate configuration to connect AI clients (Claude Desktop, Claude Code,
Codex, OpenAI) to your Probo MCP server.

The command reads the active host and API key from your CLI configuration
and outputs the connection config in the requested format.`,
		RunE: func(cmd *cobra.Command, args []string) error {
			cfg, err := f.Config()
			if err != nil {
				return fmt.Errorf("cannot load config: %w", err)
			}

			host := cfg.ActiveHost
			if host == "" {
				return fmt.Errorf("no active host configured; run 'prb auth login' first")
			}

			hc, ok := cfg.Hosts[host]
			if !ok {
				return fmt.Errorf("no credentials for host %q; run 'prb auth login' first", host)
			}

			if hc.Token == "" {
				return fmt.Errorf("no API token for host %q; run 'prb auth login' first", host)
			}

			serverCfg := mcp.ServerConfig{
				Name:    name,
				BaseURL: "https://" + host,
				APIKey:  hc.Token,
			}

			var out []byte

			switch format {
			case "claude-desktop":
				out, err = mcp.GenerateClaudeDesktopJSON(serverCfg)
			case "claude-code":
				out, err = mcp.GenerateClaudeCodeJSON(serverCfg)
			case "generic":
				out, err = mcp.GenerateGenericJSON(serverCfg)
			case "url":
				var endpoint string
				endpoint, err = mcp.MCPEndpoint(serverCfg.BaseURL)
				if err == nil {
					_, _ = fmt.Fprintln(f.IOStreams.Out, endpoint)
					return nil
				}
			default:
				all := map[string]json.RawMessage{}

				desktopBytes, e := mcp.GenerateClaudeDesktopJSON(serverCfg)
				if e != nil {
					return e
				}

				all["claude-desktop"] = desktopBytes

				codeBytes, e := mcp.GenerateClaudeCodeJSON(serverCfg)
				if e != nil {
					return e
				}

				all["claude-code"] = codeBytes

				genericBytes, e := mcp.GenerateGenericJSON(serverCfg)
				if e != nil {
					return e
				}

				all["generic"] = genericBytes

				out, err = json.MarshalIndent(all, "", "  ")
			}

			if err != nil {
				return err
			}

			_, _ = fmt.Fprintln(f.IOStreams.Out, string(out))

			return nil
		},
	}

	cmd.Flags().StringVar(&name, "name", "", "Server name in the config (default: hostname)")
	cmd.Flags().StringVar(&format, "format", "all", "Output format: claude-desktop, claude-code, generic, url, all")

	return cmd
}
