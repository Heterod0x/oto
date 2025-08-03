#!/usr/bin/env python3
"""
Script to seed the database with sample trends and microtrends for testing
"""

from oto.infra.database import create_db_session
from oto.domain.trend import Trend, MicroTrend, TrendData, MicroTrendData
from sqlmodel import delete


def seed_trends():
    """Add sample trends and microtrends to the database"""

    # Sample trends data
    sample_trends = [
        TrendData(
            title="AI Ethics & Governance",
            description="Navigating the complex moral and regulatory landscape of artificial intelligence.",
            volume=95.0,
            overall_positive_sentiment=0.7,
            overall_negative_sentiment=0.2,
            cluster_id=1,
        ),
        TrendData(
            title="Sustainable Technology",
            description="Adopting eco-friendly practices for a healthier planet and future.",
            volume=88.0,
            overall_positive_sentiment=0.8,
            overall_negative_sentiment=0.1,
            cluster_id=2,
        ),
        TrendData(
            title="Remote Work Evolution",
            description="The transformation of workplace dynamics in the post-pandemic era.",
            volume=75.0,
            overall_positive_sentiment=0.6,
            overall_negative_sentiment=0.3,
            cluster_id=3,
        ),
        TrendData(
            title="Digital Health Innovation",
            description="Revolutionary approaches to healthcare through technology integration.",
            volume=82.0,
            overall_positive_sentiment=0.75,
            overall_negative_sentiment=0.15,
            cluster_id=4,
        ),
    ]

    # Sample microtrends data
    sample_microtrends = [
        MicroTrendData(
            title="Hyperlocal Social Networks",
            description="Community-focused social platforms for neighborhood connections.",
            volume=45.0,
            overall_positive_sentiment=0.8,
            overall_negative_sentiment=0.1,
        ),
        MicroTrendData(
            title="AI-Generated Art Tools",
            description="Creative platforms powered by artificial intelligence for artists.",
            volume=52.0,
            overall_positive_sentiment=0.5,
            overall_negative_sentiment=0.4,
        ),
        MicroTrendData(
            title="Gamified Fitness Challenges",
            description="Interactive workout experiences with game-like elements.",
            volume=38.0,
            overall_positive_sentiment=0.85,
            overall_negative_sentiment=0.05,
        ),
        MicroTrendData(
            title="Voice Commerce Integration",
            description="Shopping experiences through voice-activated assistants.",
            volume=41.0,
            overall_positive_sentiment=0.6,
            overall_negative_sentiment=0.25,
        ),
        MicroTrendData(
            title="Micro-Learning Platforms",
            description="Bite-sized educational content for busy professionals.",
            volume=47.0,
            overall_positive_sentiment=0.75,
            overall_negative_sentiment=0.15,
        ),
    ]

    # Convert to domain objects
    trends = [Trend.from_trend_data(trend_data) for trend_data in sample_trends]
    microtrends = [
        MicroTrend.from_micro_trend_data(microtrend_data)
        for microtrend_data in sample_microtrends
    ]

    # Add to database
    with create_db_session() as session:
        # Clear existing data
        session.exec(delete(Trend))
        session.exec(delete(MicroTrend))

        # Add new sample data
        session.add_all(trends)
        session.add_all(microtrends)
        session.commit()

        print(
            f"Successfully seeded {len(trends)} trends and {len(microtrends)} microtrends"
        )


if __name__ == "__main__":
    seed_trends()
