# Release `soc2startd` (server group)

This track ships `soc2startd`, `@probo/console`, `@probo/trust`, and
`@probo/ui` together as the Docker image and accompanying binary archive.
They share the same version.

After confirming commits below, follow the
[common steps](./README.md#3-common-steps-every-track).

## Track facts

- **Tag pattern**: `soc2startd/v*`
- **Version source**: `cmd/soc2startd/VERSION` (single `X.Y.Z` line)
- **Version bump**: Edit `cmd/soc2startd/VERSION` directly
- **Changelog**: `cmd/soc2startd/CHANGELOG.md` (covers all four components)
- **Files to stage**: `cmd/soc2startd/VERSION`, `cmd/soc2startd/CHANGELOG.md`
- **Workflow**: `.github/workflows/release-soc2startd.yaml`
- **Path filter**: `cmd/soc2startd apps/console apps/trust packages/ui pkg`

## Detect commits

```shell
git log $(git describe --tags --abbrev=0 --match='soc2startd/v*')..HEAD --oneline \
  -- cmd/soc2startd apps/console apps/trust packages/ui pkg
```

If empty or non-user-facing only, do not release this track.

## Notes

The changelog covers changes across all four components (`soc2startd`,
`@probo/console`, `@probo/trust`, `@probo/ui`).

CI builds the frontends and Go binaries, builds and pushes the
multi-arch image to `artifact.probo.inc/probo/probo:v<version>` (and
`:latest`), runs Trivy + cosign + attestations, and publishes the GitHub
Release.
