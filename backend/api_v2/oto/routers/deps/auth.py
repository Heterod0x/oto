from fastapi import Header, HTTPException, Security, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Path, Depends
from oto.infra.database import create_db_session
from oto.domain.conversation import Conversation
from oto.domain.clip import Clip
from oto.infra.auth import get_auth_service

bearer_scheme = HTTPBearer(auto_error=False)


async def require_user_id(
    creds: HTTPAuthorizationCredentials = Security(bearer_scheme),
    user_id: str = Header(..., alias="Oto-User-Id"),
) -> str:
    auth_service = get_auth_service()
    if creds is None or not auth_service.verify_token(creds.credentials, user_id):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing credentials",
        )
    return user_id


async def require_conversation(
    conversation_id: str = Path(..., alias="conversation_id"),
    user_id: str = Depends(require_user_id),
) -> Conversation:
    with create_db_session() as session:
        conversation = session.get(Conversation, conversation_id)
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        if conversation.user_id != user_id:
            raise HTTPException(status_code=403, detail="Forbidden")
        return conversation


async def require_clip(
    clip_id: str = Path(..., alias="clip_id"),
    user_id: str = Depends(require_user_id),
) -> Clip:
    with create_db_session() as session:
        clip = session.get(Clip, clip_id)
        if not clip:
            raise HTTPException(status_code=404, detail="Clip not found")
        if clip.user_id != user_id:
            raise HTTPException(status_code=403, detail="Forbidden")
        return clip


def verify_token(token: str, user_id: str) -> bool:
    return token == f"secret:{user_id}"
