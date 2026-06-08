# Release `soc2startd-bootstrap`

After confirming commits below, follow the
[common steps](./README.md#3-common-steps-every-track).

## Track facts

- **Tag pattern**: `soc2startd-bootstrap/v*`
- **Version source**: `cmd/soc2startd-bootstrap/VERSION` (single `X.Y.Z` line)
- **Version bump**: Edit `cmd/soc2startd-bootstrap/VERSION` directly
- **Changelog**: `cmd/soc2startd-bootstrap/CHANGELOG.md`
- **Files to stage**: `cmd/soc2startd-bootstrap/VERSION`,
  `cmd/soc2startd-bootstrap/CHANGELOG.md`
- **Workflow**: `.github/workflows/release-soc2startd-bootstrap.yaml`
- **Path filter**: `cmd/soc2startd-bootstrap`

## Detect commits

```shell
git log $(git describe --tags --abbrev=0 --match='soc2startd-bootstrap/v*')..HEAD --oneline \
  -- cmd/soc2startd-bootstrap
```

If empty or non-user-facing only, do not release this track.

## Notes

CI builds binaries for 9 OS/arch targets and publishes a GitHub Release.
The same binary, built from the tagged ref, is also bundled into the
probod Docker image when `probod/v*` runs.
