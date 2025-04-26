from app.domain.domain_service.i_embedder import IEmbedder
from app.domain.object.embedding import Embedding
from app.infrastructure.handler.jina_handler import jina_embed_client


class JinaEmbedder(IEmbedder):
    def __init__(self):
        self.jina_embed_client = jina_embed_client

    def embed(self, text: str) -> Embedding:
        return Embedding(values=self.jina_embed_client.embed_content_text(text, dimensions=256))
