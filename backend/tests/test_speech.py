import pytest
from app.speech.bhashini import BhashiniProvider


@pytest.mark.anyio
async def test_bhashini_provider_mock_stt_tts():
    """
    Test Bhashini speech-to-text, text-to-speech, and translation interfaces.
    """
    provider = BhashiniProvider()

    # 1. Verify translation abstraction
    trans_res = await provider.translate("Mera transfer stuck hai.", "en", "hi")
    assert "[Mock translation en->hi]: Mera transfer stuck hai." in trans_res

    # 2. Verify Speech-to-Text transcription abstraction
    stt_res = await provider.transcribe(b"dummy_bytes", "hi-IN")
    assert "[Mock Bhashini transcript]" in stt_res

    # 3. Verify Text-to-Speech synthesis abstraction
    tts_res = await provider.synthesize("test text", "mr-IN")
    assert tts_res == b"MOCK_AUDIO_DATA_BYTES"
