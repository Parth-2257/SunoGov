from abc import ABC, abstractmethod


class TranslationProvider(ABC):
    """
    Interface for language translation services (e.g. Bhashini, AI4Bharat).
    """

    @abstractmethod
    async def translate(self, text: str, source_lang: str, target_lang: str) -> str:
        """
        Translates text from source language code to target language code.
        """
        pass


class SpeechToTextProvider(ABC):
    """
    Interface for Speech-to-Text audio transcription services.
    """

    @abstractmethod
    async def transcribe(self, audio_content: bytes, language: str) -> str:
        """
        Transcribes binary audio content in the specified language to text.
        """
        pass


class TextToSpeechProvider(ABC):
    """
    Interface for Text-to-Speech audio synthesis services.
    """

    @abstractmethod
    async def synthesize(self, text: str, language: str) -> bytes:
        """
        Synthesizes text in the specified language to binary audio content.
        """
        pass
