from agno.memory.v2.db.sqlite import SqliteMemoryDb
from agno.memory.v2.memory import Memory
from agno.memory.v2.schema import UserMemory

from app.domain.user_profile.object.user_context import UserContext, UserContextTag
from app.domain.user_profile.repository.i_user_context_repository import IUserContextRepository


class SqliteUserContextRepository(IUserContextRepository):
    def __init__(self):
        memory_db = SqliteMemoryDb(table_name="user_context", db_file="tmp/memory.db")
        self._memory = Memory(db=memory_db)

    def get_all(self, user_id: str) -> list[UserContext]:
        user_memories = self._memory.get_user_memories(user_id)
        # TODO: 実装
        return [
            UserContext(content=user_memory.memory, tag=UserContextTag(user_memory.topics[0]))
            for user_memory in user_memories
        ]

    def store(self, user_id: str, user_context: UserContext) -> None:
        user_memory = UserMemory(
            memory=user_context.content,
            # TODO: 実装
            topics=[user_context.tag.value],
            # input=user_context.input,
            # last_updated=user_context.last_updated,
            # memory_id=user_context.memory_id,
        )
        self._memory.add_user_memory(memory=user_memory, user_id=user_id)
