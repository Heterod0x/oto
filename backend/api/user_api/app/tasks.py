from celery import Celery

# Create Celery instance
app = Celery("tasks", broker="redis://redis:6379/0", backend="redis://redis:6379/0")

# Optional configuration
app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="Asia/Tokyo",
    enable_utc=True,
)


@app.task
def wait(seconds):
    """Task that simulates a long-running process"""
    import time

    time.sleep(seconds)
    with open("wait.txt", "w") as f:
        f.write(f"Task completed after {seconds} seconds")
