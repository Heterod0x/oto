import asyncio
from datetime import datetime
from fastapi import APIRouter, UploadFile, Depends, HTTPException, Query, Body, Path
from sqlmodel import select, Session
from oto.infra.storage import get_storage
from oto.infra.database import get_db_session
from oto.domain.conversation import Conversation
from oto.routers.deps.auth import require_user_id, require_conversation
from prefect.deployments import run_deployment
from oto.services.safety import check_conversation_limit_exceeded
from oto.infra.job import get_prefect_job_manager
from prefect.exceptions import ObjectNotFound

router = APIRouter(prefix="/conversation")


@router.post("/create")
async def create_conversation(
    file: UploadFile,
    user_id: str = Depends(require_user_id),
    session: Session = Depends(get_db_session),
):
    if not file.content_type.startswith("audio/"):
        raise HTTPException(status_code=400, detail="File is not an audio file")

    # 300MB
    if file.size > 300 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File is too large (max 300MB)")

    try:
        check_conversation_limit_exceeded()
    except Exception as _:
        raise HTTPException(status_code=503, detail="Our server reached its limit")

    storage = get_storage()
    filepath = storage.upload_file(file, f"uploads/{user_id}")

    conversation = Conversation(
        user_id=user_id,
        file_name=file.filename,
        file_path=filepath,
        mime_type=file.content_type,
    )
    session.add(conversation)
    session.flush()
    session.refresh(conversation)
    session.commit()

    flow_run = await run_deployment(
        name="process_conversation/process_conversation",
        parameters={"conversation_id": conversation.id},
        timeout=0,
    )

    prefect = get_prefect_job_manager()
    prefect.put_job(
        job_type="process_conversation",
        flow_run_id=str(flow_run.id),
        conversation_id=conversation.id,
        user_id=user_id,
    )

    return {
        "id": conversation.id,
        "status": conversation.status.value,
        "flow_run_id": flow_run.id,
    }


@router.get("/list")
async def list_conversations(
    user_id: str = Depends(require_user_id),
    session: Session = Depends(get_db_session),
    start: datetime = Query(default=None),
    end: datetime = Query(default=None),
):
    query = select(Conversation).where(Conversation.user_id == user_id)
    if start:
        query = query.where(Conversation.created_at >= start)
    if end:
        query = query.where(Conversation.created_at <= end)
    conversations = session.exec(
        query.order_by(Conversation.created_at.desc()).limit(30)
    ).all()
    return conversations


@router.get("/{conversation_id}")
async def get_conversation(
    conversation: Conversation = Depends(require_conversation),
):
    return conversation


@router.patch("/{conversation_id}")
async def patch_metadata(
    conversation: Conversation = Depends(require_conversation),
    session: Session = Depends(get_db_session),
    place: str = Body(default=None),
    location: str = Body(default=None),
):
    if place:
        conversation.place = place
    if location:
        conversation.location = location
    session.add(conversation)
    session.commit()
    session.refresh(conversation)
    return conversation


@router.get("/{conversation_id}/job")
async def get_conversation_job_status(
    conversation: Conversation = Depends(require_conversation),
):
    prefect = get_prefect_job_manager()
    job = prefect.get_job("process_conversation", conversation.id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    try:
        return await prefect.get_job_status(job)
    except ObjectNotFound:
        raise HTTPException(status_code=404, detail="Job not found")
