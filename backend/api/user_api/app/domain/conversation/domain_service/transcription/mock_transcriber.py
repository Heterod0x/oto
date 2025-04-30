from app.domain.conversation.domain_service.transcription.i_transcriber import ITranscriber


class MockTranscriber(ITranscriber):
    def transcribe(self, audio_data: bytes) -> str:
        with open("data/consome-example.txt", "r") as f:
            messages = f.readlines()
            return messages[0]
