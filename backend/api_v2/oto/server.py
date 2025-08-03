from fastapi import FastAPI
from oto.infra.database import create_db_and_tables
from oto.routers.conversation import router as conversation_router
from oto.routers.point import router as point_router
from oto.routers.user import router as user_router
from oto.routers.health import router as health_router
from oto.routers.transcript import router as transcript_router
from oto.routers.analysis import router as analysis_router
from oto.routers.trend import router as trend_router
from oto.routers.clip import router as clip_router
from fastapi.middleware.cors import CORSMiddleware

create_db_and_tables()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(conversation_router)
app.include_router(point_router)
app.include_router(user_router)
app.include_router(health_router)
app.include_router(transcript_router)
app.include_router(analysis_router)
app.include_router(trend_router)
app.include_router(clip_router)
