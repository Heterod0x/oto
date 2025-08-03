from prefect import task
from sqlmodel import select
from oto.infra.database import create_db_session
from oto.domain.conversation import Conversation
from oto.domain.point import Point, PointTransaction


@task(task_run_name="give_points_to_user")
def give_points_to_user(conversation_id: str) -> None:
    with create_db_session() as session:
        conversation = session.get(Conversation, conversation_id)
        if not conversation:
            raise ValueError(f"Conversation {conversation_id} not found")

        acquired_points = conversation.points

        points = session.exec(
            select(Point).where(Point.user_id == conversation.user_id)
        ).first()
        if not points:
            points = Point(user_id=conversation.user_id, points=0)

        point_tx = PointTransaction(
            user_id=conversation.user_id,
            amount=acquired_points,
            conversation_id=conversation_id,
        )
        session.add(point_tx)
        points.points += acquired_points
        session.add(points)

        session.commit()
