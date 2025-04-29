FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim

ENV UV_LINK_MODE=copy

WORKDIR /api
ENV PATH="/api/.venv/bin:$PATH"

COPY pyproject.toml uv.lock ./
RUN uv sync --frozen
