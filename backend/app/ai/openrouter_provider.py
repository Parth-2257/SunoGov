import json
import logging
import httpx
from app.ai.base import AIProvider
from app.ai.schemas import AIAnalysisSchema
from app.ai.prompts import SYSTEM_PROMPT
from app.core.config import settings

logger = logging.getLogger("sunogov-api")


class OpenRouterInferenceError(Exception):
    """
    Controlled domain exception representing OpenRouter endpoint failures.
    """
    pass


class OpenRouterProvider(AIProvider):
    """
    Concrete AI provider interacting with OpenRouter API endpoints using GLM-5.3 Flash via OpenRouter.
    """

    async def analyze(self, text: str) -> AIAnalysisSchema:
        # Input safety checks
        if not text or not text.strip():
            raise ValueError("Input query text cannot be empty.")
        
        if len(text) > 500:
            raise ValueError("Input query text exceeds the maximum limit of 500 characters.")

        # Configuration keys check
        if not settings.OPENROUTER_API_KEY or settings.OPENROUTER_API_KEY == "YOUR_OPENROUTER_API_KEY":
            raise OpenRouterInferenceError("OpenRouter API key is missing or set to placeholder.")

        headers = {
            "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://github.com/Parth-2257/SunoGov",
            "X-Title": "SunoGov Hackathon Prototype"
        }

        # Structure payload requesting JSON output format where supported
        payload = {
            "model": settings.OPENROUTER_MODEL,
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": text}
            ],
            "response_format": {"type": "json_object"},
            "temperature": 0.0
        }

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{settings.OPENROUTER_BASE_URL.rstrip('/')}/chat/completions",
                    headers=headers,
                    json=payload,
                    timeout=15.0
                )
                response.raise_for_status()
                response_json = response.json()
        except httpx.HTTPStatusError as err:
            logger.error("Event: OpenRouter HTTP Error | Status: %d | Details: %s", err.response.status_code, err.response.text)
            raise OpenRouterInferenceError(f"OpenRouter HTTP error {err.response.status_code}") from err
        except Exception as err:
            logger.error("Event: OpenRouter Connection Exception | Details: %s", str(err))
            raise OpenRouterInferenceError("Failed to reach OpenRouter endpoint.") from err

        # Parse output JSON content
        try:
            content = response_json["choices"][0]["message"]["content"]
            parsed_data = json.loads(content)
        except (KeyError, IndexError, json.JSONDecodeError) as err:
            logger.error("Event: OpenRouter Parse Exception | Content: %s", str(err))
            raise OpenRouterInferenceError("Failed to parse returned content as JSON.") from err

        # Validate against the strict schemas
        try:
            validated = AIAnalysisSchema.model_validate(parsed_data)
            return validated
        except Exception as err:
            logger.error("Event: OpenRouter Output Validation Exception | Error: %s", str(err))
            raise OpenRouterInferenceError("Model output failed schema validation constraint checks.") from err
