from abc import ABC, abstractmethod
from typing import Optional, Dict, Any


class GrievanceRepository(ABC):
    """
    Abstract Interface for Grievance persistent storage.
    Enables future substitution of InMemory storage with a MongoDB repository.
    """

    @abstractmethod
    async def create(self, grievance: Dict[str, Any]) -> Dict[str, Any]:
        """
        Persist a new grievance record.
        """
        pass

    @abstractmethod
    async def get_by_id(self, grievance_id: str) -> Optional[Dict[str, Any]]:
        """
        Retrieve a grievance record by its reference ID.
        """
        pass

    @abstractmethod
    async def update(self, grievance: Dict[str, Any]) -> Dict[str, Any]:
        """
        Update an existing grievance record.
        """
        pass
