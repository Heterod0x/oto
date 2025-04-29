from app.agent.conversation_agent import ConversationOverviewExtractor
from app.domain.conversation.object.conversation import Conversation, ConversationMetadata


class ConversationFactory:
    def __init__(self):
        self._conversation_overview_extractor = ConversationOverviewExtractor()

    def create(self, conversation_id: str, transcript: str) -> Conversation:
        conversation_metadata = ConversationMetadata()
        overview = self._conversation_overview_extractor.handle(transcript)

        return Conversation(
            conversation_id=conversation_id,
            title=overview.title,
            metadata=conversation_metadata,
            overview=overview.one_line_summary,
            full_transcript=transcript,
        )
