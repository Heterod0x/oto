from prefect import task, flow
from oto.infra.database import create_db_session
from oto.domain.conversation import Conversation, ProcessingStatus
from oto.domain.transcript import Transcript
from oto.domain.transcript import Captions
from oto.services.conversation.summary import get_conversation_summary_service
from oto.services.conversation.highlight import get_conversation_highlight_service
from oto.services.conversation.insight import get_conversation_insight_service
from oto.services.conversation.breakdown import get_conversation_breakdown_service
from oto.domain.analysis import ConversationAnalysis
from oto.services.edit_profile import get_edit_profile_service
from oto.domain.user import User


class Helper:
    def __init__(self, conversation_id: str, require_transcript: bool = True):
        self.conversation_id = conversation_id
        with create_db_session() as session:
            self.conversation = session.get(Conversation, conversation_id)
            if not self.conversation:
                raise ValueError(f"Conversation {conversation_id} not found")
            if require_transcript:
                self.transcript = session.get(Transcript, conversation_id)
                if not self.transcript:
                    raise ValueError(f"Transcript {conversation_id} not found")
                self.captions = Captions.model_validate_json(
                    self.transcript.captions_dump
                )
            self.analysis = session.get(ConversationAnalysis, conversation_id)
            if not self.analysis:
                self.analysis = ConversationAnalysis(
                    id=conversation_id, user_id=self.conversation.user_id
                )

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        pass

    def set_inner_status(self, inner_status: str) -> None:
        with create_db_session() as session:
            self.conversation.status = ProcessingStatus.PROCESSING
            self.conversation.inner_status = inner_status
            session.add(self.conversation)
            session.commit()

    def update_analysis(self) -> None:
        with create_db_session() as session:
            session.add(self.analysis)
            session.commit()

    def complete_analysis(self) -> None:
        with create_db_session() as session:
            self.conversation.status = ProcessingStatus.COMPLETED
            self.conversation.inner_status = "Analysis completed"
            session.add(self.conversation)
            session.commit()

    def mark_as_failed(self) -> None:
        with create_db_session() as session:
            self.conversation.status = ProcessingStatus.FAILED
            self.conversation.inner_status = "Analysis failed"
            session.add(self.conversation)
            session.commit()


@task(task_run_name="generate_empty_analysis")
def generate_empty_analysis(conversation_id: str) -> None:
    with Helper(conversation_id) as helper:
        helper.analysis = ConversationAnalysis(
            id=conversation_id, user_id=helper.conversation.user_id
        )
        helper.update_analysis()


@task(task_run_name="generate_summary")
def generate_summary(conversation_id: str) -> None:
    with Helper(conversation_id) as helper:
        summary_service = get_conversation_summary_service()
        summary = summary_service.get_summary(helper.captions)
        helper.analysis.summary_dump = summary.model_dump_json()
        helper.update_analysis()


@task(task_run_name="generate_highlights")
def generate_highlights(conversation_id: str) -> None:
    with Helper(conversation_id) as helper:
        highlights_service = get_conversation_highlight_service()
        highlights = highlights_service.get_highlights(helper.captions)
        helper.analysis.highlights_dump = highlights.model_dump_json()
        helper.update_analysis()


@task(task_run_name="generate_insights")
def generate_insights(conversation_id: str) -> None:
    with Helper(conversation_id) as helper:
        insights_service = get_conversation_insight_service()
        insights = insights_service.get_insights(helper.captions)
        helper.analysis.insights_dump = insights.model_dump_json()
        helper.update_analysis()


@task(task_run_name="generate_breakdown")
def generate_breakdown(conversation_id: str) -> None:
    with Helper(conversation_id) as helper:
        breakdown_service = get_conversation_breakdown_service()
        breakdown = breakdown_service.get_breakdown(helper.captions)
        helper.analysis.breakdown_dump = breakdown.model_dump_json()
        helper.update_analysis()


@task(task_run_name="complete_analysis")
def complete_analysis(conversation_id: str) -> None:
    with Helper(conversation_id) as helper:
        helper.complete_analysis()


@task(task_run_name="edit_profile")
def edit_profile(conversation_id: str) -> None:
    with Helper(conversation_id) as helper:
        with create_db_session() as session:
            user = session.get(User, helper.conversation.user_id)
            if not user:
                user = User(id=helper.conversation.user_id)
        edit_profile_service = get_edit_profile_service()
        update_user = edit_profile_service.edit_profile(
            helper.captions, user.to_update_user()
        )
        with create_db_session() as session:
            user.name = update_user.name
            user.age = update_user.age
            user.nationality = update_user.nationality
            user.first_language = update_user.first_language
            user.second_languages = update_user.second_languages
            user.interests = update_user.interests
            user.preferred_topics = update_user.preferred_topics
            session.add(user)
            session.commit()


@task(task_run_name="mark_as_failed")
def mark_as_failed(conversation_id: str) -> None:
    with Helper(conversation_id, require_transcript=False) as helper:
        helper.mark_as_failed()
