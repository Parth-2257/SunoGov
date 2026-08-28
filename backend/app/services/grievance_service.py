import random
import logging
from datetime import datetime, timezone
from typing import Dict, Any, Optional
from app.repositories.grievance_repository import GrievanceRepository
from app.repositories.memory_grievance_repository import memory_grievance_repo

# Standard API logger setup
logger = logging.getLogger("sunogov-api")
logging.basicConfig(level=logging.INFO)


class GrievanceNotFoundError(Exception):
    """
    Domain-level exception raised when a grievance record cannot be found.
    """
    def __init__(self, grievance_id: str):
        self.grievance_id = grievance_id
        super().__init__(f"Grievance with ID {grievance_id} not found.")


class GrievanceService:
    """
    Service coordinating grievance business processes, state transitions, and persistent storage.
    Enforces privacy-preserving operational logging.
    """

    def __init__(self, repository: GrievanceRepository = memory_grievance_repo):
        self.repository = repository

    async def create_grievance(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        # Generate random unique reference ID: SG-2026-XXXXX
        ref_id = f"SG-2026-{random.randint(10000, 99999)}"
        now_str = datetime.now(timezone.utc).isoformat()
        
        # Build clean model structure, forcing is_demo = True
        grievance = {
            "id": ref_id,
            "request_type": payload["request_type"],
            "intent": payload["intent"],
            "summary": payload["summary"],
            "category": payload["category"],
            "description": payload["description"],
            "uan": payload["uan"],
            "status": "SUBMITTED",
            "created_at": now_str,
            "updated_at": now_str,
            "is_demo": True,
            "last_reminded_at": None
        }
        
        # Save to repository
        saved_grievance = await self.repository.create(grievance)
        
        # Safe operational logging - NO UAN, NO descriptions logged!
        logger.info(
            "Event: Grievance Created | ID: %s | RequestType: %s | Status: SUBMITTED",
            ref_id, payload["request_type"]
        )
        
        return saved_grievance

    async def get_grievance(self, grievance_id: str) -> Dict[str, Any]:
        grievance = await self.repository.get_by_id(grievance_id)
        if not grievance:
            logger.warning("Event: Grievance Get Failed | ID: %s | Reason: Not Found", grievance_id)
            raise GrievanceNotFoundError(grievance_id)
            
        logger.info("Event: Grievance Get Successful | ID: %s | Status: %s", grievance_id, grievance["status"])
        return grievance

    async def simulate_status_transition(self, grievance_id: str) -> Dict[str, Any]:
        grievance = await self.repository.get_by_id(grievance_id)
        if not grievance:
            logger.warning("Event: Grievance Simulation Failed | ID: %s | Reason: Not Found", grievance_id)
            raise GrievanceNotFoundError(grievance_id)
            
        current_status = grievance["status"]
        status_flow = ["SUBMITTED", "ACKNOWLEDGED", "UNDER_REVIEW", "REGIONAL_REVIEW", "RESOLVED"]
        
        if current_status in status_flow:
            idx = status_flow.index(current_status)
            if idx < len(status_flow) - 1:
                next_status = status_flow[idx + 1]
                grievance["status"] = next_status
                grievance["updated_at"] = datetime.now(timezone.utc).isoformat()
                await self.repository.update(grievance)
                logger.info(
                    "Event: Grievance Status Advanced | ID: %s | From: %s | To: %s",
                    grievance_id, current_status, next_status
                )
            else:
                logger.info("Event: Status Advance Skipped (Already Resolved) | ID: %s", grievance_id)
        else:
            grievance["status"] = "SUBMITTED"
            grievance["updated_at"] = datetime.now(timezone.utc).isoformat()
            await self.repository.update(grievance)
            logger.warning("Event: Grievance Status Reset to SUBMITTED | ID: %s", grievance_id)
            
        return grievance

    async def record_reminder(self, grievance_id: str) -> Dict[str, Any]:
        grievance = await self.repository.get_by_id(grievance_id)
        if not grievance:
            logger.warning("Event: Grievance Reminder Failed | ID: %s | Reason: Not Found", grievance_id)
            raise GrievanceNotFoundError(grievance_id)
            
        now_str = datetime.now(timezone.utc).isoformat()
        grievance["last_reminded_at"] = now_str
        grievance["updated_at"] = now_str
        
        await self.repository.update(grievance)
        logger.info("Event: Grievance Reminder Recorded | ID: %s | Timestamp: %s", grievance_id, now_str)
        
        return grievance
