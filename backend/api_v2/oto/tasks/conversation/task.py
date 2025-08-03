from prefect import flow, get_run_logger
from prefect.task_runners import ConcurrentTaskRunner
from .analysis import (
    generate_empty_analysis,
    generate_summary,
    generate_highlights,
    generate_insights,
    generate_breakdown,
    complete_analysis,
    mark_as_failed,
    edit_profile,
)
from oto.tasks.content.create_clip_task import create_clip_task
from .transcribe import transcribe_conversation
from .point import give_points_to_user
from .extract import extract_topic
from oto.services.safety import check_conversation_limit_exceeded


@flow(
    name="process_conversation",
    task_runner=ConcurrentTaskRunner(),
    timeout_seconds=60 * 20,  # 20 minutes
)
def process_conversation_flow(conversation_id: str):
    log = get_run_logger()
    try:
        log.info("▶️ Processing conversation %s", conversation_id)

        check_conversation_limit_exceeded()

        # start create clip
        clip_task = create_clip_task.submit(conversation_id)

        # 1. Transcribe conversation
        transcribe_conversation.submit(conversation_id).result()

        log.info("📝 Transcription complete — starting analysis")

        generate_empty_analysis.submit(conversation_id).result()

        log.info("🔍 Analysis complete — starting summary")

        # 2. Generate analysis
        futures = [
            generate_summary.submit(conversation_id),
            generate_highlights.submit(conversation_id),
            generate_insights.submit(conversation_id),
        ]

        # 3. Wait for all analysis tasks to complete
        for f in futures:
            f.result()

        # 4. Generate analysis (2)
        futures = [
            generate_breakdown.submit(conversation_id),
            edit_profile.submit(conversation_id),
        ]

        # 5. Wait for all analysis tasks to complete
        for f in futures:
            f.result()

        # 6. Give points to user
        give_points_to_user.submit(conversation_id).result()

        # 7. Complete analysis
        complete_analysis.submit(conversation_id).result()
        log.info("✅ Analysis complete")

        try:
            extract_topic.submit(conversation_id).result()
        except Exception as e:
            log.exception("❌ Error extracting topic but it's not critical", exc_info=e)

        try:
            clip_task.result()
        except Exception as e:
            log.exception("❌ Error creating clip but it's not critical", exc_info=e)
    except Exception:
        log.exception("❌ Error processing conversation")
        mark_as_failed.submit(conversation_id)
        raise
