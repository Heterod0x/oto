from celery import Celery
from openai import OpenAI
from loguru import logger

from app.usecase.background.analyze_conversation import AnalyzeConversation
from app.usecase.background.evaluate_audio import EvaluateAudio
from app.infrastructure.repository.supabase_conversation_audio_repository import SupabaseConversationAudioRepository
from app.infrastructure.handler.supabase_handler import supabase_client
from app.infrastructure.domain_service.openai_transcriber import OpenAITranscriber
from app.infrastructure.handler.openai_handler import OpenAIHandler
from app.domain.conversation.domain_service.conversation_factory import ConversationFactory
from app.infrastructure.repository.supabase_conversation_repository import SupabaseConversationRepository
from app.domain.conversation.domain_service.transcription.mock_transcriber import MockTranscriber

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
mock_transcriber = MockTranscriber()
analyze_conversation_usecase = AnalyzeConversation(
    conversation_audio_repository=SupabaseConversationAudioRepository(supabase_client),
    # transcriber=OpenAITranscriber(openai_handler=OpenAIHandler(openai_client)),
    transcriber=mock_transcriber,
    conversation_factory=ConversationFactory(),
    conversation_repository=SupabaseConversationRepository(supabase_client),
)


def get_evaluate_audio_usecase():
    from app.domain.conversation.domain_service.voice_activity.mock_voice_activity_ratio import (
        MockVoiceActivityDetector,
    )
    from app.domain.conversation.domain_service.sound_quality.mock_sound_quality_evaluator import (
        MockSoundQualityEvaluator,
    )

    return EvaluateAudio(
        conversation_audio_repository=SupabaseConversationAudioRepository(supabase_client),
        voice_activity_detector=MockVoiceActivityDetector(),
        sound_quality_evaluator=MockSoundQualityEvaluator(),
    )


def get_refine_user_profile_usecase():
    from app.usecase.background.refine_user_profile import RefineUserProfile
    from app.domain.user_profile.domain_service.context_extractor import ContextExtractor
    from app.domain.user_profile.domain_service.profile_factory import ProfileFactory
    from app.infrastructure.repository.sqlite_user_context_repository import SqliteUserContextRepository
    from app.infrastructure.repository.supabase_user_profile_repository import SupabaseUserProfileRepository

    user_context_repository = SqliteUserContextRepository()
    user_profile_repository = SupabaseUserProfileRepository(supabase_client)

    return RefineUserProfile(
        context_extractor=ContextExtractor(),
        user_context_repository=user_context_repository,
        profile_factory=ProfileFactory(user_context_repository),
        user_profile_repository=user_profile_repository,
    )


evaluate_audio_usecase = get_evaluate_audio_usecase()
refine_user_profile_usecase = get_refine_user_profile_usecase()


@app.task
def refine_user_profile(user_id: str, transcript: str):
    """Task that simulates a long-running process"""

    refine_user_profile_usecase.handle(user_id=user_id, transcript=transcript)
    logger.info(f"User profile {user_id} refined")


@app.task
def analyze_conversation(user_id: str, conversation_id: str):
    """Task that simulates a long-running process"""

    transcript = analyze_conversation_usecase.handle(conversation_id=conversation_id)
    logger.info(f"Conversation {conversation_id} analyzed")

    refine_user_profile.delay(user_id=user_id, transcript=transcript)


@app.task
def evaluate_audio(conversation_id: str):
    """Task that simulates a long-running process"""

    evaluate_audio_usecase.handle(conversation_id=conversation_id)
    logger.info(f"Audio {conversation_id} evaluated")
