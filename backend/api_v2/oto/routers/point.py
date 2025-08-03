from fastapi import APIRouter, Depends, Body, HTTPException
from sqlmodel import select, Session
from oto.infra.database import get_db_session
from oto.domain.point import Point, PointTransaction, ClaimRequest
from oto.routers.deps.auth import require_user_id
from oto.services.onchain import get_onchain_service

router = APIRouter(prefix="/point")


@router.get("/get")
async def get_point(
    user_id: str = Depends(require_user_id),
    session: Session = Depends(get_db_session),
):
    point = session.exec(select(Point).where(Point.user_id == user_id)).first()

    return point


@router.get("/transaction/list")
async def get_point_transaction(
    user_id: str = Depends(require_user_id),
    session: Session = Depends(get_db_session),
):
    point_transaction = session.exec(
        select(PointTransaction)
        .where(PointTransaction.user_id == user_id)
        .order_by(PointTransaction.created_at.desc())
    ).all()
    return point_transaction


@router.get("/claimable_amount")
async def get_claimable_amount(
    user_id: str = Depends(require_user_id),
    session: Session = Depends(get_db_session),
):
    point = session.exec(select(Point).where(Point.user_id == user_id)).first()
    if not point:
        return {"amount": 0, "display_amount": 0}
    return {"amount": point.points * (10**9), "display_amount": point.points}


@router.post("/claim")
async def claim(
    claim_request: ClaimRequest = Body(),
    user_id: str = Depends(require_user_id),
    session: Session = Depends(get_db_session),
):
    onchain_service = get_onchain_service()
    req = onchain_service.parse_claim_tx(claim_request.tx_base64)

    point = session.exec(select(Point).where(Point.user_id == user_id)).first()
    if point.points < req.amount / (10**9):  # decimals: 9
        raise HTTPException(status_code=400, detail="Insufficient points")

    point.points -= req.amount / (10**9)
    point_transaction = PointTransaction(
        user_id=user_id,
        amount=-req.amount / (10**9),
    )
    session.add(point)
    session.add(point_transaction)
    session.commit()

    tx = onchain_service.sign(req.tx)
    signature = await onchain_service.send_tx(tx)
    return {
        "signature": signature,
        "success": True,
    }
