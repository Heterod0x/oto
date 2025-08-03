from oto.infra.vertexai import VertexAI, get_vertexai
from vertexai.generative_models import Part, GenerationConfig, SafetySetting
from functools import lru_cache
from oto.environment import get_settings
from oto.domain.clip import ClipDatas, ClipCaptions


@lru_cache
def get_clip_generator_service() -> "ClipGeneratorService":
    settings = get_settings()
    return ClipGeneratorService(get_vertexai(), settings.google_cloud_bucket_name)


class ClipGeneratorService:
    def __init__(self, vertexai: VertexAI, bucket_name: str):
        self.vertexai = vertexai
        self.bucket_name = bucket_name
        self.generation_config = GenerationConfig(
            max_output_tokens=65535,
            temperature=1,
            audio_timestamp=True,
        )
        self.safety_settings = [
            SafetySetting(
                category=SafetySetting.HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold=SafetySetting.HarmBlockThreshold.OFF,
            ),
            SafetySetting(
                category=SafetySetting.HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold=SafetySetting.HarmBlockThreshold.OFF,
            ),
            SafetySetting(
                category=SafetySetting.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                threshold=SafetySetting.HarmBlockThreshold.OFF,
            ),
            SafetySetting(
                category=SafetySetting.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold=SafetySetting.HarmBlockThreshold.OFF,
            ),
            SafetySetting(
                category=SafetySetting.HarmCategory.HARM_CATEGORY_CIVIC_INTEGRITY,
                threshold=SafetySetting.HarmBlockThreshold.OFF,
            ),
        ]

    def pretty(self, audio_buffer: bytes, mime_type: str) -> ClipCaptions:
        messages = [
            self._prompt_pretty(),
            Part.from_data(audio_buffer, mime_type),
        ]

        response = self.vertexai.model_large.generate_content(
            messages,
            generation_config=GenerationConfig(
                max_output_tokens=65535,
                temperature=1,
                audio_timestamp=True,
                response_mime_type="application/json",
                response_schema={
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "timecode_start": {"type": "string"},
                            "timecode_end": {"type": "string"},
                            "speaker": {"type": "string"},
                            "caption": {"type": "string"},
                        },
                        "required": [
                            "timecode_start",
                            "timecode_end",
                            "speaker",
                            "caption",
                        ],
                    },
                },
            ),
            safety_settings=self.safety_settings,
        )

        self.vertexai.notify_response(response, self.vertexai.model_large)

        return ClipCaptions.model_validate_json(response.text)

    def _prompt_pretty(self) -> str:
        return """この録音データは会話から切り抜いて繋げたものなのですが、これをできる限りクリーンな状態にしたいです。つまり、フィラー、ノイズ、その他の不要なものを削除して、音声のみを残したいです。
これらを勘案して、タイムスタンプと文字起こしを作成してください。ミリセカンドも活用し、クリーンで聞きやすい完全な状態を目指してください。

タイムスタンプは `MM:SS.SSS` の形式で、ミリセカンドまで指定してください。
"""

    def generate(self, audio_file_path: str, mime_type: str) -> ClipDatas:
        messages = [
            self._prompt(),
            Part.from_uri(
                uri=f"gs://{self.bucket_name}/{audio_file_path}", mime_type=mime_type
            ),
        ]

        response = self.vertexai.model_large.generate_content(
            messages,
            generation_config=self.generation_config,
            safety_settings=self.safety_settings,
        )

        self.vertexai.notify_response(response, self.vertexai.model_large)

        messages.append(self._prompt_2())

        print("Stage 2/3: refining...")
        response = self.vertexai.model_large.generate_content(
            messages,
            generation_config=self.generation_config,
            safety_settings=self.safety_settings,
        )

        self.vertexai.notify_response(response, self.vertexai.model_large)

        messages = [
            self._prompt_3(),
            response.text,
        ]

        print("Stage 3/3: structuring...")
        response = self.vertexai.model_large.generate_content(
            messages,
            generation_config=GenerationConfig(
                max_output_tokens=65535,
                response_mime_type="application/json",
                response_schema={
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "title": {"type": "string"},
                            "description": {"type": "string"},
                            "comment": {"type": "string"},
                            "captions": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "timecode_start": {"type": "string"},
                                        "timecode_end": {"type": "string"},
                                        "speaker": {"type": "string"},
                                        "caption": {"type": "string"},
                                    },
                                    "required": [
                                        "timecode_start",
                                        "timecode_end",
                                        "speaker",
                                        "caption",
                                    ],
                                },
                            },
                        },
                        "required": ["title", "description", "comment", "captions"],
                    },
                },
            ),
            safety_settings=self.safety_settings,
        )

        self.vertexai.notify_response(response, self.vertexai.model_large)

        return ClipDatas.model_validate_json(response.text)

    def _prompt(self) -> str:
        return """これは会話の録音データです。この録音から切り抜きのトランスクリプトとタイムスタンプを作成してください。

切り抜く場所についてですが、どんなにイタズラな切り抜き、あまりに取り上げ方が湾曲している、こういったあらゆるテクニックを許容して、むしろ用いて、特別な切り抜きを作り上げてください。つまり恣意的な切り抜きによって、この会話している人物がとてつもなく素晴らしい人間であり、仮にコンテンツとして拡散したら、とてつもなく人気になってしまうであろう切り取りモーメントを作り上げることがあなたの目的です。

切り抜きを聞いた時に、数秒で驚き、興味を惹かれ、話を聞き、納得で終わる。そのような壮大な美しく楽しめる切り抜きである必要があります。魅力を最大限に引き出し、モーメントを作成しましょう。
起承転結、ハリウッド構成、あらゆるテクニックを駆使して切り抜いてください。

さて、そのようなモーメントを3つ挙げてください。それぞれ、30秒以内であることが好ましいでしょう。不要な部分は抜いて、タイムスタンプのレンジ一覧とその文字起こしで示すことができます。

そしてその切り抜きの前に、煽り者がいうべきセリフも付け加えてください。"彼は...と, ...といったのです。これを聞いてください" などといった煽りを短的に1文で。"""

    def _prompt_2(self) -> str:
        return """精査してください。少し文脈から外れすぎているものを抜いたり、調整したり。
切り抜きのタイムスタンプの順序を入れ替えたりして、もっとドラマティックな表現にしてください。典型的には結論を最初に持ってくるなど。順序なんて気にするな。ただし文脈は正しく、邪魔なものは入れない。

煽り文句は、短く1文で。"""

    def _prompt_3(self) -> str:
        return """
これは音声データに対するタイムスタンプと文字起こしなどの情報です。この情報を正しく構造化してください。
titleはタイトルであり、descriptionは説明文。commentは煽り文句などの説明スクリプトであり、読み上げに使用するため、ナチュラルな文章のみが入ります。

内容を変更することはなく、構造化だけを行ってください。

title, description, commentの言語は文字起こしの言語に合うようにしてください。(異なっていれば、title, description, commentを翻訳する必要があります。文字起こしは変更してはいけません)
"""
