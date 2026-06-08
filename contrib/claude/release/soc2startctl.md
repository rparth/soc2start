# Release `soc2startctl`

After confirming commits below, follow the
[common steps](./README.md#3-common-steps-every-track).

## Track facts

- **Tag pattern**: `soc2startctl/v*`
- **Version source**: `cmd/soc2startctl/VERSION` (single `X.Y.Z` line)
- **Version bump**: Edit `cmd/soc2startctl/VERSION` directly
- **Changelog**: `cmd/soc2startctl/CHANGELOG.md`
- **Files to stage**: `cmd/soc2startctl/VERSION`, `cmd/soc2startctl/CHANGELOG.md`
- **Path filter**: `cmd/soc2startctl pkg/proboctl`

## Detect commits

```shell
git log $(git describe --tags --abbrev=0 --match='soc2startctl/v*')..HEAD --oneline \
  -- cmd/soc2startctl pkg/proboctl
```

If empty or non-user-facing only, do not release this track.
