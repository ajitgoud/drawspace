# Drawspace

A full-stack canvas editor — Next.js frontend, Java/Spring Boot microservices backend. Built as a hands-on project to practice microservices architecture, Spring Security, and modern React, end to end.

## What it does

Register/log in, create canvases, draw on them (shapes, freehand brushes, text) with undo/redo and property editing, save to a real backend, export to PNG/JPEG/JSON, and share a canvas via a public read-only link.

## Tech stack

**Backend:** Java 21, Spring Boot 4.1.1, Spring Cloud Gateway, Spring Data JPA / Hibernate, PostgreSQL, Redis, Kafka, MinIO (S3-compatible storage), JWT auth, Flyway, Docker.

**Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, Fabric.js, Radix UI.

## Architecture

Client (Next.js)

         │

         ▼

API Gateway (:8080) — JWT validation, rate limiting

├── auth-service (:8081)

├── canvas-service (:8082)

└── asset-service (:8083)


Each service has its own database — no shared schema.

## Project structure
drawspace/ 

auth-service/ # registration, login, JWT issuance

canvas-service/ # canvas CRUD, ownership, sharing

asset-service/ # file upload, storage, thumbnail processing

api-gateway/ # single entry point

frontend/ # Next.js app

docker-compose.yml


## Running locally

```bash
# 1. Copy env template and fill in real values
cp .env.example .env

# 2. Backend + infra
docker compose up --build

# 3. Frontend
cd frontend
npm install
npm run dev
```

Frontend expects the gateway at `http://localhost:8080` (`frontend/.env.local`).

## Status

This project is a work in progress, built incrementally. Core flow (auth, canvas CRUD, drawing tools, save/export, sharing) works end to end. Still in progress: image upload UI, observability, Kubernetes/CI-CD.

## License

MIT