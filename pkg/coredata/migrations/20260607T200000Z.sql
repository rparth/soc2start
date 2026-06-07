-- Device posture tracking: devices and posture check results

CREATE TYPE device_status AS ENUM ('ONLINE', 'OFFLINE', 'REVOKED');
CREATE TYPE posture_check_status AS ENUM ('PASS', 'FAIL', 'UNKNOWN', 'NOT_APPLICABLE');

CREATE TABLE devices (
    id              TEXT PRIMARY KEY,
    tenant_id       TEXT NOT NULL,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    profile_id      TEXT,
    hardware_uuid   TEXT NOT NULL,
    serial_number   TEXT,
    hostname        TEXT NOT NULL DEFAULT '',
    platform        TEXT NOT NULL DEFAULT '',
    os_version      TEXT NOT NULL DEFAULT '',
    agent_version   TEXT NOT NULL DEFAULT '',
    api_key_hash    TEXT NOT NULL,
    status          device_status NOT NULL DEFAULT 'ONLINE',
    last_heartbeat_at TIMESTAMP WITH TIME ZONE,
    enrolled_at     TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE UNIQUE INDEX idx_devices_org_hwuuid ON devices (organization_id, hardware_uuid);
CREATE INDEX idx_devices_org ON devices (organization_id);
CREATE INDEX idx_devices_profile ON devices (profile_id) WHERE profile_id IS NOT NULL;

CREATE TABLE device_posture_checks (
    id          TEXT PRIMARY KEY,
    tenant_id   TEXT NOT NULL,
    device_id   TEXT NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
    check_key   TEXT NOT NULL,
    status      posture_check_status NOT NULL,
    evidence    JSONB NOT NULL DEFAULT '{}',
    observed_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE UNIQUE INDEX idx_device_posture_checks_device_key ON device_posture_checks (device_id, check_key);
CREATE INDEX idx_device_posture_checks_device ON device_posture_checks (device_id);
