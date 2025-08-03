from fastapi import APIRouter

router = APIRouter(prefix="/health")


@router.get("")
async def health():
    return {"status": "ok"}
