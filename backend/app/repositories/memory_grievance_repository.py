from typing import Optional, Dict, Any
from app.repositories.grievance_repository import GrievanceRepository


class InMemoryGrievanceRepository(GrievanceRepository):
    """
    In-memory storage implementation for Grievances.
    Holds records in a dictionary active during server lifetime.
    """

    def __init__(self):
        self._db: Dict[str, Dict[str, Any]] = {}

    async def create(self, grievance: Dict[str, Any]) -> Dict[str, Any]:
        grievance_id = grievance["id"]
        # Save a copy of the dict to prevent side-effect references
        self._db[grievance_id] = dict(grievance)
        return self._db[grievance_id]

    async def get_by_id(self, grievance_id: str) -> Optional[Dict[str, Any]]:
        record = self._db.get(grievance_id)
        if record:
            return dict(record)
        return None

    async def update(self, grievance: Dict[str, Any]) -> Dict[str, Any]:
        grievance_id = grievance["id"]
        self._db[grievance_id] = dict(grievance)
        return self._db[grievance_id]


# Shared Singleton Instance
memory_grievance_repo = InMemoryGrievanceRepository()
