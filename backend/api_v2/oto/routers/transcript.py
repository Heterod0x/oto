from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from oto.infra.database import get_db_session
from oto.domain.conversation import Conversation
from oto.routers.deps.auth import require_conversation
from oto.domain.transcript import Captions, Transcript, TranscriptResponse


router = APIRouter(prefix="/transcript")


@router.get("/{conversation_id}")
async def get_transcript(
    conversation: Conversation = Depends(require_conversation),
    session: Session = Depends(get_db_session),
):
    transcript = session.get(Transcript, conversation.id)
    if not transcript:
        raise HTTPException(status_code=404, detail="Transcript not found")

    captions = Captions.model_validate_json(transcript.captions_dump)

    return TranscriptResponse(
        id=transcript.id,
        created_at=transcript.created_at,
        updated_at=transcript.updated_at,
        captions=captions,
    )
