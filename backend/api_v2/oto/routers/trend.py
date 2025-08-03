from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from oto.infra.database import get_db_session
from oto.domain.trend import Trend, MicroTrend
from oto.routers.deps.auth import require_user_id
from typing import List

router = APIRouter(prefix="/trend")


@router.get("/trends")
async def get_trends(
    session: Session = Depends(get_db_session),
) -> List[Trend]:
    """Get all trends"""
    statement = select(Trend).order_by(Trend.volume.desc())
    trends = session.exec(statement).all()
    return trends


@router.get("/microtrends")
async def get_microtrends(
    session: Session = Depends(get_db_session),
) -> List[MicroTrend]:
    """Get all microtrends"""
    statement = select(MicroTrend).order_by(MicroTrend.volume.desc())
    microtrends = session.exec(statement).all()
    return microtrends


@router.get("/trends/{trend_id}")
async def get_trend(
    trend_id: str,
    session: Session = Depends(get_db_session),
) -> Trend:
    """Get a specific trend by ID"""
    trend = session.get(Trend, trend_id)
    if not trend:
        raise HTTPException(status_code=404, detail="Trend not found")
    return trend


@router.get("/microtrends/{microtrend_id}")
async def get_microtrend(
    microtrend_id: str,
    session: Session = Depends(get_db_session),
) -> MicroTrend:
    """Get a specific microtrend by ID"""
    microtrend = session.get(MicroTrend, microtrend_id)
    if not microtrend:
        raise HTTPException(status_code=404, detail="MicroTrend not found")
    return microtrend
