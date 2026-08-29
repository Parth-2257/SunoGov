from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field


# ==========================================
# Enums for Taxonomy Standard
# ==========================================

class AIRequestType(str, Enum):
    GRIEVANCE = "GRIEVANCE"
    INFORMATION = "INFORMATION"
    STATUS = "STATUS"
    UNKNOWN = "UNKNOWN"


class AIIntent(str, Enum):
    PF_TRANSFER = "PF_TRANSFER"
    PF_CLAIM = "PF_CLAIM"
    PENSION = "PENSION"
    ACCOUNT_DETAILS = "ACCOUNT_DETAILS"
    EMPLOYER_CONTRIBUTION = "EMPLOYER_CONTRIBUTION"
    GRIEVANCE_STATUS = "GRIEVANCE_STATUS"
    OTHER = "OTHER"
    UNKNOWN = "UNKNOWN"


# ==========================================
# Schema Definitions
# ==========================================

class AIMissingField(BaseModel):
    field: str = Field(..., description="The parameter label identified as missing, e.g. uan")
    reason: str = Field(..., description="Contextual user-facing rationale why this parameter is required")
    required: bool = Field(default=True, description="Whether this field is mandatory for final submission")
    question: Optional[str] = Field(default=None, description="Clear, citizen-friendly question asking for this field")


class AIAnalysisSchema(BaseModel):
    request_type: AIRequestType = Field(..., description="Categorized request type")
    intent: AIIntent = Field(..., description="Intent normalized from the allowed taxonomy list")
    language: str = Field(..., description="Detected language, e.g. english, hindi, hinglish, marathi")
    summary: str = Field(..., description="Brief structured summary of the query")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence rating between 0.0 and 1.0")
    missing_fields: List[AIMissingField] = Field(default_factory=list, description="Missing properties required to submit grievance")
