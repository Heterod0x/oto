from sqlmodel import SQLModel, create_engine, Session
from typing import Generator
from oto.environment import get_settings
from oto.domain.clip import Clip
from oto.domain.job import ConversationJob

DATABASE_URL = get_settings().database_url

engine = create_engine(
    DATABASE_URL,
    echo=True,
    connect_args={"check_same_thread": False}
    if DATABASE_URL.startswith("sqlite")
    else {},
)


def create_db_and_tables():
    """Create database tables"""
    SQLModel.metadata.create_all(engine)


def get_db_session() -> Generator[Session, None, None]:
    """Get database session"""
    with Session(engine) as session:
        yield session


def create_db_session() -> Session:
    """Create database session"""
    return Session(engine)
