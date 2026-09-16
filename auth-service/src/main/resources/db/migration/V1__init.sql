CREATE TABLE users
(
    id            UUID PRIMARY KEY,
    email         VARCHA(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at    TIMESTAMPTZ  NOT NULL,
    CONSTRAINT uq_users_email UNIQUE (email)
);