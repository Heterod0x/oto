from abc import ABC, abstractmethod

from app.domain.object.embedding import Embedding


class IEmbedder(ABC):
    @abstractmethod
    def embed(self, text: str) -> Embedding:
        pass
