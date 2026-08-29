from fastapi import APIRouter, status
from app.schemas.schemas import AnalysisRequest, AnalysisResponse
from app.ai.analyzer import AIAnalyzer

router = APIRouter()
analyzer = AIAnalyzer()


@router.post("/analyze", response_model=AnalysisResponse, status_code=status.HTTP_200_OK)
async def analyze_request(payload: AnalysisRequest):
    """
    Analyzes natural language text from a citizen to determine intent, request type,
    language, summary, and missing details. If context_type is 'BOOLEAN', executes
    a yes/no semantic classification helper.
    """
    if payload.context_type == "BOOLEAN":
        result = await analyzer.classify_boolean(payload.text)
    else:
        result = await analyzer.analyze_query(payload.text)
    
    return AnalysisResponse(
        success=True,
        analysis=result
    )
