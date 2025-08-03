from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from oto.infra.database import get_db_session
from oto.domain.user import User, UpdateUser
from oto.routers.deps.auth import require_user_id

router = APIRouter(prefix="/user")


@router.post("/create")
async def create_user(
    user_id: str = Depends(require_user_id),
    session: Session = Depends(get_db_session),
):
    session.add(User(id=user_id))
    session.commit()

    return {"id": user_id}


@router.get("/get")
async def get_user(
    user_id: str = Depends(require_user_id),
    session: Session = Depends(get_db_session),
):
    user = session.get(User, user_id)

    return user


@router.post("/update")
async def update_user(
    body: UpdateUser,
    user_id: str = Depends(require_user_id),
    session: Session = Depends(get_db_session),
):
    user = session.get(User, user_id)
    if not user:
        user = User(id=user_id)

    # use body to update user
    for key, value in body.model_dump(exclude_unset=True).items():
        if key == "id":
            continue
        setattr(user, key, value)

    session.add(user)
    session.commit()

    return {"id": user_id}
