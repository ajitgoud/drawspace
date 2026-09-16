#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE DATABASE drawspace_auth;
    CREATE DATABASE drawspace_canvas;
    CREATE DATABASE drawspace_asset;
EOSQL