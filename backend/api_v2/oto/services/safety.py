from oto.infra.database import create_db_session
from oto.domain.conversation import Conversation
from sqlmodel import select, func
from oto.environment import get_settings


def check_conversation_limit_exceeded():
    with create_db_session() as session:
        total_conversations = session.exec(select(func.count(Conversation.id))).first()
        if total_conversations > get_settings().maximum_conversations_limit:
            raise ValueError("Conversation limit exceeded")
