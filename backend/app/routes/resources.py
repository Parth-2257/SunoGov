from typing import List
from fastapi import APIRouter, HTTPException, status
from app.schemas.schemas import ResourceItem

router = APIRouter()


@router.get("", response_model=List[ResourceItem], status_code=status.HTTP_501_NOT_IMPLEMENTED)
async def get_resources(category: str | None = None):
    """
    Architectural placeholder to list FAQs/information resources.
    Planned for Phase 1.
    """
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Resources retrieval is a Phase 0 placeholder and is not implemented yet."
    )
