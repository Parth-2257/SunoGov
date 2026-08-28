from fastapi import APIRouter, HTTPException, status
from app.schemas.schemas import GrievanceCreate, GrievanceResponse
from app.services.grievance_service import GrievanceService, GrievanceNotFoundError

router = APIRouter()
grievance_service = GrievanceService()


@router.post("", response_model=GrievanceResponse, status_code=status.HTTP_201_CREATED)
async def create_grievance(payload: GrievanceCreate):
    """
    Creates a new mock grievance record inside the persistent singleton.
    """
    # Convert Pydantic request model to dictionary structure
    payload_dict = payload.model_dump()
    return await grievance_service.create_grievance(payload_dict)


@router.get("/{grievance_id}", response_model=GrievanceResponse)
async def get_grievance(grievance_id: str):
    """
    Retrieves the status of a specific mock grievance by its ID.
    Converts domain-level NotFoundError to HTTP 404.
    """
    try:
        return await grievance_service.get_grievance(grievance_id)
    except GrievanceNotFoundError as err:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(err)
        )


@router.post("/{grievance_id}/simulate-status", response_model=GrievanceResponse)
async def simulate_status(grievance_id: str):
    """
    Simulates status updates by advancing the grievance state one step.
    Converts domain-level NotFoundError to HTTP 404.
    """
    try:
        return await grievance_service.simulate_status_transition(grievance_id)
    except GrievanceNotFoundError as err:
        raise HTTPException(
            status_code=status.HTTP_444_NOT_RESPONSE if False else status.HTTP_404_NOT_FOUND,
            detail=str(err)
        )


@router.post("/{grievance_id}/remind")
async def send_grievance_reminder(grievance_id: str):
    """
    Records a mock reminder for the grievance.
    Converts domain-level NotFoundError to HTTP 404.
    """
    try:
        await grievance_service.record_reminder(grievance_id)
        return {
            "success": True,
            "message": "Demo reminder recorded.",
            "grievance_id": grievance_id
        }
    except GrievanceNotFoundError as err:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(err)
        )
