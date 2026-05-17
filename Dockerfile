# AI: Stage 1: Build Next.js static files
FROM node:22-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# AI: Stage 2: FastAPI runtime - serves frontend static files and API
FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim
WORKDIR /app

COPY backend/pyproject.toml backend/uv.lock ./
RUN uv sync --no-dev --frozen

COPY backend/app ./app
COPY --from=frontend-builder /app/frontend/out ./static

RUN mkdir -p /data
ENV DB_PATH=/data/prelegal.db

EXPOSE 8000
CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
