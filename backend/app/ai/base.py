from abc import ABC, abstractmethod
from app.ai.schemas import AIAnalysisSchema


class AIProvider(ABC):
    """
    Abstract Base Class representing an AI Provider (e.g. Mock, OpenAI, Gemini, Local).
    Enforces unified analysis method contracts.
    """

    @abstractmethod
    async def analyze(self, text: str) -> AIAnalysisSchema:
        """
        Processes natural language user query and extracts intent and classification variables.
        """
        pass
