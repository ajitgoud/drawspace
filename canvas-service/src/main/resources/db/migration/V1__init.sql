CREATE TABLE canvases
(
    id          UUID PRIMARY KEY,
    owner_id    UUID         NOT NULL,
    title       VARCHAR(255) NOT NULL,
    canvas_json JSONB        NOT NULL,
    is_public   BOOLEAN      NOT NULL DEFAULT FALSE,
    public_slug VARCHAR(255),
    version     BIGINT       NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ  NOT NULL,
    updated_at  TIMESTAMPTZ  NOT NULL,
    CONSTRAINT uq_canvases_public_slug UNIQUE (public_slug)
);

CREATE INDEX idx_canvases_owner_id ON canvases (owner_id);