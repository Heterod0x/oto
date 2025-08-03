from oto.tasks.conversation.extract import (
    extract_topic_flow,
    extract_topics_from_all_conversations_flow,
)
from oto.tasks.conversation.task import process_conversation_flow
from oto.tasks.topic.create_trends import create_trends_flow

from prefect import serve

if __name__ == "__main__":
    proc_deploy = process_conversation_flow.to_deployment(name="process_conversation")
    tre_deploy = create_trends_flow.to_deployment(name="create_trends")
    ex_deploy = extract_topic_flow.to_deployment(name="extract_topic")
    ex_all_deploy = extract_topics_from_all_conversations_flow.to_deployment(
        name="extract_topics_from_all_conversations"
    )

    serve(
        proc_deploy,
        tre_deploy,
        ex_deploy,
        ex_all_deploy,
        limit=1,
    )
