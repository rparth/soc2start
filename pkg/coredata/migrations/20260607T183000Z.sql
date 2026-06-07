-- Monitoring reports for Prowler and Pentesting CSV uploads

CREATE TYPE monitoring_report_type AS ENUM ('PROWLER', 'PENTEST');

CREATE TABLE monitoring_reports (
    id         TEXT PRIMARY KEY,
    tenant_id  TEXT NOT NULL,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    report_type monitoring_report_type NOT NULL,
    name       TEXT NOT NULL,
    file_id    TEXT REFERENCES files(id) ON DELETE SET NULL,
    uploader_id TEXT,
    row_count  INTEGER NOT NULL DEFAULT 0,
    summary    JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX idx_monitoring_reports_org ON monitoring_reports (organization_id);
CREATE INDEX idx_monitoring_reports_type ON monitoring_reports (report_type);
