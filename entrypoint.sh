#!/bin/bash
set -e

# Configuration file path
CONFIG_FILE="${CONFIG_FILE:-/etc/soc2startd/config.yml}"

# If bootstrap env vars are set, always (re)generate the config from them.
# This ensures that updated env vars take effect even when a stale config
# file exists on a persistent volume.  When no env vars are present, fall
# back to an existing config file (e.g., mounted from a ConfigMap).
if [ -n "$PROBOD_ENCRYPTION_KEY" ]; then
  echo "Generating configuration file from environment variables at: $CONFIG_FILE"
  soc2startd-bootstrap -output "$CONFIG_FILE"
elif [ -f "$CONFIG_FILE" ]; then
  echo "Using existing configuration file at: $CONFIG_FILE"
else
  echo "Error: no bootstrap env vars set and no config file found at $CONFIG_FILE" >&2
  exit 1
fi

# Execute soc2startd with the generated config
exec soc2startd -cfg-file "$CONFIG_FILE" "$@"
