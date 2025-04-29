from fastapi import FastAPI

from app.presentation.routing.conversation_router import conversation_router
from app.presentation.routing.user_profile import user_profile_router

app = FastAPI()

app.include_router(conversation_router)
app.include_router(user_profile_router)


@app.get("/")
def read_root():
    return {"status": "healthy"}
