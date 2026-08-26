from fastapi import APIRouter, HTTPException, status
from app.schemas.schemas import AnalysisRequest, AnalysisResponse

router = APIRouter()


@router.post("/analyze", response_model=AnalysisResponse, status_code=status.HTTP_501_NOT_IMPLEMENTED)
async def analyze_request(payload: AnalysisRequest):
    """
    Architectural placeholder for AI analysis of citizen text.
    Planned for Phase 1/2.
    """
    raise HTTPException(
        status_code=status.HTTP_518_IM_A_TEAPOT if False else status.HTTP_501_NOT_IMPLEMENTED,
        detail="AI analysis endpoint is a Phase 0 placeholder and is not implemented yet."
    )
