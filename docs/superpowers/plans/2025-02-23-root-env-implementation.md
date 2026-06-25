# Root Environment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Centralize port and environment configuration into a single root `.env` file that passes values to Docker and the Next.js frontend.

**Architecture:** Use Docker Compose environment interpolation to read from a root `.env` file, map host ports dynamically, and pass `NEXT_PUBLIC_PB_URL` and `INTERNAL_PB_URL` to the Next.js container.

**Tech Stack:** Docker Compose, dotenv.

## Global Constraints

- Target directory: Repository root (for `.env`, `.env.example`, `docker-compose.yml`)
- `FRONTEND_PORT`: `2200`
- `PB_PORT`: `8090`
- `NEXT_PUBLIC_PB_URL`: `http://127.0.0.1:8090`
- `INTERNAL_PB_URL`: `http://pocketbase:8090`
- Delete `frontend/.env.local` and untrack it from Git.

---

### Task 1: Create Global Environment Files

**Files:**
- Create: `.env` (Untracked)
- Create: `.env.example`
- Delete: `frontend/.env.local`

**Interfaces:**
- Produces: Configuration values available to Docker Compose.

- [ ] **Step 1: Create .env.example**
Create `.env.example` in the root directory:

```env
# ==========================================
# KONFIGURASI DOCKER PORTS (HOST)
# ==========================================
# Port yang akan digunakan untuk mengakses Frontend di browser Anda
FRONTEND_PORT=2200

# Port yang akan digunakan untuk mengakses PocketBase Backend di browser Anda
PB_PORT=8090

# ==========================================
# KONFIGURASI APLIKASI (NEXT.JS & POCKETBASE)
# ==========================================
# URL publik PocketBase (Digunakan oleh Browser / Client Components Next.js)
NEXT_PUBLIC_PB_URL=http://127.0.0.1:8090

# URL internal PocketBase (Digunakan oleh Docker untuk Server-Side Fetching)
INTERNAL_PB_URL=http://pocketbase:8090
```

- [ ] **Step 2: Copy to .env**
```bash
cp .env.example .env
```

- [ ] **Step 3: Ignore .env**
Ensure `.env` is ignored by updating `.gitignore` (if `.env*` isn't already ignored). Let's append to `.gitignore`:

```bash
echo ".env" >> .gitignore
```

- [ ] **Step 4: Remove old env file**
```bash
git rm frontend/.env.local
```

- [ ] **Step 5: Commit**
```bash
git add .env.example .gitignore
git commit -m "chore: setup root environment variables and template"
```

---

### Task 2: Update Docker Compose Configuration

**Files:**
- Modify: `docker-compose.yml`

**Interfaces:**
- Consumes: Environment variables from `.env`.
- Produces: Dynamic port mapping and environment pass-through.

- [ ] **Step 1: Edit docker-compose.yml**
Modify `docker-compose.yml` to use string interpolation for ports and environment variables:

```yaml
services:
  pocketbase:
    build: 
      context: ./pocketbase
    ports:
      - "${PB_PORT:-8090}:8090"
    volumes:
      - ./pb_data:/pb/pb_data
      - ./pb_migrations:/pb/pb_migrations

  frontend:
    build:
      context: ./frontend
    ports:
      - "${FRONTEND_PORT:-2200}:3000"
    volumes:
      - ./frontend:/app
      - /app/node_modules
      - /app/.next
    environment:
      - NEXT_PUBLIC_PB_URL=${NEXT_PUBLIC_PB_URL:-http://127.0.0.1:8090}
      - INTERNAL_PB_URL=${INTERNAL_PB_URL:-http://pocketbase:8090}
    depends_on:
      - pocketbase
```

- [ ] **Step 2: Commit**
```bash
git add docker-compose.yml
git commit -m "fix: make docker-compose ports and urls dynamic based on root env"
```
