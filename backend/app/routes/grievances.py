from fastapi import APIRouter, HTTPException, status
from app.schemas.schemas import GrievanceCreate, GrievanceResponse

router = APIRouter()


@router.post("", response_model=GrievanceResponse, status_code=status.HTTP_501_NOT_IMPLEMENTED)
async def create_grievance(payload: GrievanceCreate):
    """
    Architectural placeholder to submit/register a new simulated grievance.
    Planned for Phase 1/2.
    """
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Grievance creation is a Phase 0 placeholder and is not implemented yet."
    )


@router.get("/{grievance_id}", response_model=GrievanceResponse, status_code=status.HTTP_501_NOT_IMPLEMENTED)
async def get_grievance(grievance_id: str):
    """
    Architectural placeholder to retrieve a simulated grievance status.
    Planned for Phase 1/2.
    """
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail=f"Grievance retrieval for ID '{grievance_id}' is a Phase 0 placeholder and is not implemented yet."
    )


@router.post("/{grievance_id}/remind", status_code=status.HTTP_501_NOT_IMPLEMENTED)
async def send_grievance_reminder(grievance_id: str):
    """
    Architectural placeholder to send a simulated reminder to the department.
    Planned for Phase 1/2.
    """
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail=f"Grievance reminder for ID '{grievance_id}' is a Phase 0 placeholder and is not implemented yet."
    )
