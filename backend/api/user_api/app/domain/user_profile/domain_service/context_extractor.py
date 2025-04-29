from app.agent.extractor import ExtractorAgent
from app.domain.user_profile.object.user_context import UserContext


class ContextExtractor:
    def __init__(self):
        self.extractor = ExtractorAgent(target="ユーザプロフィール", schema=UserContext)

    # TODO: 冗長なので、他モジュールとの結合検討
    def handle(self, text: str) -> list[UserContext]:
        extracted_contents = self.extractor.handle(text)
        return [UserContext(content=content.content, tag=content.tag) for content in extracted_contents.contents]
