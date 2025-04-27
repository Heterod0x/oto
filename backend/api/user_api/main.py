from fastapi import FastAPI

from app.presentation.router import profile_router
from app.presentation.routing.conversation_router import conversation_router

app = FastAPI()


app.include_router(profile_router)
app.include_router(conversation_router)


@app.get("/")
def read_root():
    return {"status": "healthy"}
