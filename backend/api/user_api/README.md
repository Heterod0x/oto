# User API

This is the API for the user service.

## Realtime Task

1. Fetch User Profile
2. Store Conversation
3. Fetch Conversation Summary

## Background Task

To generate user profile, we need to store the following process.
1. Analyze Conversation (Transcription / Summarization / etc)
2. Update User Memory
3. Update User Profile

To generate conversation asset, we need to store the following process.
1. Voice Activity Detection
2. Sound Quality Evaluation



<img width="1253" alt="image" src="https://github.com/user-attachments/assets/fc076893-2e75-4584-89f0-bf1960f6a5bd" />


## Setup

create `.env` file from `.env.example` and set the environment variables(dummy is ok to start api).

## Running the API

```bash
docker compose build --no-cache
```

```bash
docker compose up -d
```

## Accessing the API

The API will be available at `http://localhost:8008`.

## OpenAPI Documentation

The API documentation is available at `http://localhost:8008/docs`.
