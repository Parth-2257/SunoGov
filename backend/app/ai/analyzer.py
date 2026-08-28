import logging
from app.ai.base import AIProvider
from app.ai.mock_provider import MockAIProvider
from app.ai.schemas import AIAnalysisSchema, AIRequestType, AIIntent
from app.core.config import settings

# Setup logging
logger = logging.getLogger("sunogov-api")


class AIAnalyzer:
    """
    AI Analyzer coordination engine. Validates outputs against strict schemas
    and triggers safe fallback states on low confidence or execution failures.
    """

    def __init__(self, provider: AIProvider = None):
        if provider:
            self.provider = provider
        else:
            if settings.AI_PROVIDER.lower() == "openrouter":
                from app.ai.openrouter_provider import OpenRouterProvider
                self.provider = OpenRouterProvider()
            else:
                self.provider = MockAIProvider()
        self.threshold = settings.AI_CONFIDENCE_THRESHOLD

    async def analyze_query(self, text: str) -> AIAnalysisSchema:
        try:
            # Delegate to concrete provider interface
            result = await self.provider.analyze(text)
            
            # Check confidence against configuration-driven threshold
            if result.confidence < self.threshold:
                logger.warning(
                    "Event: AI Analysis Below Threshold | Confidence: %.2f | Threshold: %.2f",
                    result.confidence, self.threshold
                )
                return self._fallback_schema(
                    reason="Low confidence classification result.",
                    detected_confidence=result.confidence
                )

            logger.info(
                "Event: AI Analysis Completed | RequestType: %s | Intent: %s | Confidence: %.2f",
                result.request_type, result.intent, result.confidence
            )
            return result

        except Exception as err:
            # Privacy safe error logging - NO user raw text logged
            logger.error("Event: AI Analyzer Exception | Error: %s", str(err))
            return self._fallback_schema(reason="Execution exception thrown during model processing.")

    def _fallback_schema(self, reason: str, detected_confidence: float = 0.0) -> AIAnalysisSchema:
        """
        Creates a safe schema indicating UNKNOWN values.
        """
        return AIAnalysisSchema(
            request_type=AIRequestType.UNKNOWN,
            intent=AIIntent.UNKNOWN,
            language="unknown",
            summary=f"Analysis fallback triggered: {reason}",
            confidence=min(detected_confidence, 0.30),
            missing_fields=[]
        )
