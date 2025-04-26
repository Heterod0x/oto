from fastapi import FastAPI

from app.presentation.router import conversation_router, profile_router

app = FastAPI()


app.include_router(profile_router)
app.include_router(conversation_router)


@app.get("/")
def read_root():
    return {"status": "healthy"}
