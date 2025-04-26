from abc import ABC, abstractmethod
from typing import Any, Optional


class UseCase(ABC):
    @abstractmethod
    def handle(self, *args, **kwargs) -> Optional[Any]:
        pass
