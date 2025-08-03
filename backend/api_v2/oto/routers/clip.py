from fastapi import APIRouter, Depends, HTTPException, Query, Response
from sqlmodel import select, Session
from typing import Optional
from oto.infra.database import get_db_session
from oto.infra.storage import get_storage
from oto.domain.clip import Clip
from oto.routers.deps.auth import require_user_id, require_clip

router = APIRouter(prefix="/clip")


@router.get("/{clip_id}/audio")
async def get_clip_audio_url(
    clip: Clip = Depends(require_clip),
):
    """Get the audio URL for a specific clip"""
    storage = get_storage()
    try:
        signed_url = storage.generate_signed_url(clip.file_path)
        return Response(content=signed_url, media_type="text/plain")
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to generate audio URL: {str(e)}"
        )


@router.get("/{clip_id}/comment-audio")
async def get_clip_comment_audio_url(
    clip: Clip = Depends(require_clip),
):
    """Get the audio URL for a specific clip"""
    storage = get_storage()
    try:
        signed_url = storage.generate_signed_url(clip.comment_file_path)
        return Response(content=signed_url, media_type="text/plain")
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to generate audio URL: {str(e)}"
        )


@router.get("/list")
async def list_clips(
    user_id: str = Depends(require_user_id),
    session: Session = Depends(get_db_session),
    conversation_id: Optional[str] = Query(
        default=None, description="Filter clips by conversation ID"
    ),
    limit: int = Query(
        default=30, le=100, description="Maximum number of clips to return"
    ),
):
    """List clips, optionally filtered by conversation_id"""
    query = select(Clip).where(Clip.user_id == user_id)

    if conversation_id:
        query = query.where(Clip.conversation_id == conversation_id)

    clips = session.exec(query.order_by(Clip.created_at.desc()).limit(limit)).all()

    return {
        "clips": [
            {
                "id": clip.id,
                "conversation_id": clip.conversation_id,
                "created_at": clip.created_at,
                "updated_at": clip.updated_at,
                "file_name": clip.file_name,
                "mime_type": clip.mime_type,
                "title": clip.title,
                "description": clip.description,
                "comment": clip.comment,
                "captions": clip.get_clip_data().captions,
            }
            for clip in clips
        ],
        "total": len(clips),
        "conversation_id": conversation_id,
    }


@router.get("/{clip_id}")
async def get_clip(
    clip: Clip = Depends(require_clip),
):
    """Get a specific clip by ID"""
    return {
        "id": clip.id,
        "user_id": clip.user_id,
        "conversation_id": clip.conversation_id,
        "created_at": clip.created_at,
        "updated_at": clip.updated_at,
        "file_name": clip.file_name,
        "mime_type": clip.mime_type,
        "title": clip.title,
        "description": clip.description,
        "comment": clip.comment,
        "captions": clip.get_clip_data().captions,
    }
