from app.domain.conversation.domain_service.transcription.i_transcriber import ITranscriber


class MockTranscriber(ITranscriber):
    def transcribe(self, audio_data: bytes) -> str:
        with open("example-data/emma-watson.txt", "r") as f:
            messages = f.readlines()
            return "".join(messages)
