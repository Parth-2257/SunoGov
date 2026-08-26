from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
async def get_health():
    """
    Health check endpoint to verify backend service status.
    """
    return {
        "status": "ok",
        "service": "sunogov-api"
    }
