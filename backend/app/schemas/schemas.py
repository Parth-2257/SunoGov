from enum import Enum
from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field


# ==========================================
# Common Enums & Types
# ==========================================

class RequestType(str, Enum):
    GRIEVANCE = "GRIEVANCE"
    INFORMATION = "INFORMATION"
    STATUS = "STATUS"
    UNKNOWN = "UNKNOWN"


class GrievanceStatus(str, Enum):
    SUBMITTED = "SUBMITTED"
    ACKNOWLEDGED = "ACKNOWLEDGED"
    UNDER_REVIEW = "UNDER_REVIEW"
    REGIONAL_REVIEW = "REGIONAL_REVIEW"
    RESOLVED = "RESOLVED"


# ==========================================
# Schema Definitions
# ==========================================

class MissingField(BaseModel):
    field_name: str = Field(..., description="The key of the missing field")
    field_type: str = Field(..., description="The type of value expected (e.g. string, date)")
    description: str = Field(..., description="User-friendly description of what this field is")


class Intent(BaseModel):
    name: str = Field(..., description="Categorized user intent, e.g., 'WITHDRAWAL_DELAY'")
    confidence: float = Field(..., description="Confidence score from 0.0 to 1.0")
    description: str = Field(..., description="Summary of the detected intent")


class AIAnalysis(BaseModel):
    request_type: RequestType = Field(..., description="Classified type of request")
    intent: Intent = Field(..., description="Detected user intent")
    extracted_fields: Dict[str, Optional[Any]] = Field(
        default_factory=dict, 
        description="Key-value pairs of extracted information (e.g. UAN, Member ID)"
    )
    missing_fields: List[MissingField] = Field(
        default_factory=list, 
        description="Fields that are missing but required for final submission"
    )
    summary: str = Field(..., description="AI-generated summary of the citizen's query")
    confidence: float = Field(..., description="Overall classification confidence")


# ==========================================
# API Request / Response Contracts
# ==========================================

class AnalysisRequest(BaseModel):
    text: str = Field(..., min_length=5, description="The natural language query from the citizen")


class AnalysisResponse(BaseModel):
    success: bool = True
    analysis: AIAnalysis


class GrievanceCreate(BaseModel):
    request_type: RequestType
    intent: str
    summary: str
    category: str
    description: str
    uan: str = Field(..., min_length=2, max_length=30, description="Synthetic UAN identifier")


class GrievanceResponse(BaseModel):
    id: str
    request_type: RequestType
    intent: str
    summary: str
    category: str
    description: str
    uan: str
    status: GrievanceStatus
    created_at: str
    updated_at: str
    is_demo: bool = True
    last_reminded_at: Optional[str] = None


class ResourceItem(BaseModel):
    id: str
    title: str
    description: str
    link: Optional[str] = None
    category: str
