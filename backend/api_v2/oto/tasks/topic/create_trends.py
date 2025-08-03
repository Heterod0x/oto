from prefect import flow
from prefect.task_runners import ConcurrentTaskRunner
from oto.infra.database import create_db_session
from oto.services.create_cluster import get_create_cluster_service
from oto.domain.trend import Trend, MicroTrend
from sqlmodel import delete


@flow(name="create_trends", task_runner=ConcurrentTaskRunner())
def create_trends_flow() -> None:
    create_cluster_service = get_create_cluster_service()
    result = create_cluster_service.create_trends()

    trends = [Trend.from_trend_data(trend) for trend in result.trends]
    micro_trends = [
        MicroTrend.from_micro_trend_data(micro_trend)
        for micro_trend in result.micro_trends
    ]

    with create_db_session() as session:
        session.exec(delete(Trend))
        session.exec(delete(MicroTrend))
        session.add_all(trends)
        session.add_all(micro_trends)
        session.commit()
