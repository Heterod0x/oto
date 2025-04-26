from abc import ABC, abstractmethod
from typing import Any


class AbstractAgent(ABC):
    @abstractmethod
    def handle(self, *args, **kwargs) -> Any:
        pass
