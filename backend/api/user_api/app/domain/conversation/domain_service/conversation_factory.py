from app.domain.conversation.object.conversation import Conversation, ConversationMetadata
from app.agent.conversation_agent import ConversationOverviewExtractor


class ConversationFactory:
    def __init__(self):
        self._conversation_overview_extractor = ConversationOverviewExtractor()

    def create(self, transcript: str) -> Conversation:
        conversation_metadata = ConversationMetadata()
        overview = self._conversation_overview_extractor.handle(transcript)

        return Conversation(
            title=overview.title,
            metadata=conversation_metadata,
            overview=overview.one_line_summary,
            full_transcript=transcript,
        )
