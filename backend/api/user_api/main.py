from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.presentation.routing.conversation_router import conversation_router
from app.presentation.routing.user_profile import user_profile_router

app = FastAPI()

app.include_router(conversation_router)
app.include_router(user_profile_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"status": "healthy"}
