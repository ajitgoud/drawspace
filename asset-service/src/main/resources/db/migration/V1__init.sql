CREATE TABLE assets
(
    id            UUID PRIMARY KEY,
    owner_id      UUID          NOT NULL,
    s3_key        VARCHAR(1024) NOT NULL,
    url           VARCHAR(2048),
    thumbnail_url VARCHAR(2048),
    status        VARCHAR(32)   NOT NULL DEFAULT 'UPLOADED',
    created_at    TIMESTAMPTZ   NOT NULL,
    CONSTRAINT chk_assets_status CHECK (status IN ('UPLOADED', 'PROCESSING', 'READY', 'FAILED'))
);

CREATE INDEX idx_assets_owner_id ON assets (owner_id);