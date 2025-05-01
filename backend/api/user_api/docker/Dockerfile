FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim

ENV UV_LINK_MODE=copy
ENV UV_HTTP_TIMEOUT=120

WORKDIR /api
ENV PATH="/api/.venv/bin:$PATH"

COPY pyproject.toml uv.lock ./
RUN uv sync --frozen
