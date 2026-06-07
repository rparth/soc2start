# Release `soc2start-agent`

After confirming commits below, follow the
[common steps](./README.md#3-common-steps-every-track).

## Track facts

- **Tag pattern**: `soc2start-agent/v*`
- **Version source**: `cmd/soc2start-agent/VERSION` (single `X.Y.Z` line)
- **Version bump**: Edit `cmd/soc2start-agent/VERSION` directly
- **Changelog**: `cmd/soc2start-agent/CHANGELOG.md`
- **Files to stage**: `cmd/soc2start-agent/VERSION`, `cmd/soc2start-agent/CHANGELOG.md`
- **Workflow**: `.github/workflows/release-soc2start-agent.yaml`
- **Path filter**: `cmd/soc2start-agent pkg/deviceagent`

## Detect commits

```shell
git log $(git describe --tags --abbrev=0 --match='soc2start-agent/v*')..HEAD --oneline \
  -- cmd/soc2start-agent pkg/deviceagent
```

If empty or non-user-facing only, do not release this track.

## Build

```shell
make bin/soc2start-agent
```

## Notes

CI builds binaries for 8 OS/arch targets (linux, darwin, and windows on
amd64 and arm64; freebsd on amd64 and arm64), publishes a GitHub
Release with signed checksums, SBOM, and build attestations. The agent
auto-update path downloads the matching archive plus `checksums.txt` and
verifies the cosign bundle before installing.

macOS `.pkg` installers are built locally with
`cmd/soc2start-agent/installer/macos/build.sh` (requires macOS and a
pre-built binary). They are not part of the GitHub Release workflow yet.
