import logging
from app.speech.base import TranslationProvider, SpeechToTextProvider, TextToSpeechProvider
from app.core.config import settings

logger = logging.getLogger("sunogov-api")


class BhashiniProvider(TranslationProvider, SpeechToTextProvider, TextToSpeechProvider):
    """
    Mock implementation of Bhashini API services for STT, TTS, and Translation.
    Does not require active credentials or perform actual network calls yet.
    """

    def __init__(self):
        self.api_key = settings.BHASHINI_API_KEY
        self.user_id = settings.BHASHINI_USER_ID
        self.app_id = settings.BHASHINI_APP_ID
        self.base_url = settings.BHASHINI_BASE_URL

        if not self.api_key or self.api_key == "YOUR_BHASHINI_API_KEY":
            logger.info("Event: Bhashini Init | Message: Running in mock voice mode (no credentials).")

    async def translate(self, text: str, source_lang: str, target_lang: str) -> str:
        logger.info("Event: Bhashini Translate | Source: %s | Target: %s", source_lang, target_lang)
        return f"[Mock translation {source_lang}->{target_lang}]: {text}"

    async def transcribe(self, audio_content: bytes, language: str) -> str:
        logger.info("Event: Bhashini Transcribe | Size: %d bytes | Lang: %s", len(audio_content), language)
        return "[Mock Bhashini transcript]"

    async def synthesize(self, text: str, language: str) -> bytes:
        logger.info("Event: Bhashini Synthesize | Text Length: %d | Lang: %s", len(text), language)
        return b"MOCK_AUDIO_DATA_BYTES"
