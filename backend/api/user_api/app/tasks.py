from celery import Celery
from openai import OpenAI

from app.usecase.analyze_conversation import AnalyzeConversation
from app.infrastructure.repository.supabase_conversation_audio_repository import SupabaseConversationAudioRepository
from app.infrastructure.handler.supabase_handler import supabase_client
from app.infrastructure.domain_service.openai_transcriber import OpenAITranscriber
from app.infrastructure.handler.openai_handler import OpenAIHandler

# Create Celery instance
app = Celery("tasks", broker="redis://redis:6379/0", backend="redis://redis:6379/0")

# Optional configuration
app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="Asia/Tokyo",
    enable_utc=True,
)

openai_client = OpenAI()
analyze_conversation_usecase = AnalyzeConversation(
    conversation_audio_repository=SupabaseConversationAudioRepository(supabase_client),
    transcriber=OpenAITranscriber(openai_handler=OpenAIHandler(openai_client)),
)


@app.task
def wait(seconds):
    """Task that simulates a long-running process"""
    import time

    time.sleep(seconds)
    with open("wait.txt", "w") as f:
        f.write(f"Task completed after {seconds} seconds")


@app.task
def analyze_conversation(conversation_id: str):
    """Task that simulates a long-running process"""

    analyze_conversation_usecase.handle(conversation_id=conversation_id)
    print("Task completed after 10 seconds")
