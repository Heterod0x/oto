from fastapi import APIRouter, Depends, HTTPException
from oto.routers.deps.auth import require_conversation
from oto.domain.analysis import ConversationAnalysis
from oto.domain.conversation import Conversation
from oto.infra.database import get_db_session
from sqlmodel import Session

router = APIRouter(prefix="/analysis")


@router.get("/{conversation_id}")
async def get_analysis(
    conversation: Conversation = Depends(require_conversation),
    session: Session = Depends(get_db_session),
):
    analysis = session.get(ConversationAnalysis, conversation.id)
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")

    analysis_data = analysis.to_conversation_data()

    return analysis_data
