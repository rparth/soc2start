# Release `soc2start-cli` (CLI)

After confirming commits below, follow the
[common steps](./README.md#3-common-steps-every-track).

## Track facts

- **Tag pattern**: `soc2start-cli/v*`
- **Version source**: `cmd/soc2start/VERSION` (single `X.Y.Z` line)
- **Version bump**: Edit `cmd/soc2start/VERSION` directly
- **Changelog**: `cmd/soc2start/CHANGELOG.md`
- **Files to stage**: `cmd/soc2start/VERSION`, `cmd/soc2start/CHANGELOG.md`
- **Workflow**: `.github/workflows/release-soc2start-cli.yaml`
- **Path filter**: `cmd/soc2start pkg/cli pkg/cmd`

## Detect commits

```shell
git log $(git describe --tags --abbrev=0 --match='soc2start-cli/v*')..HEAD --oneline \
  -- cmd/soc2start pkg/cli pkg/cmd
```

If empty or non-user-facing only, do not release this track.

## Notes

CI builds binaries for 9 OS/arch targets, publishes a GitHub Release,
and updates the Homebrew formula at `getprobo/homebrew-tap`.
