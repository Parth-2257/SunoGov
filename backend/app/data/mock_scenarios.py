"""
Mock Scenarios and Data for SunoGov

This module houses synthetic data representing common citizen queries,
mock AI analysis results, and simulated grievances to use as testing targets in later phases.
"""

from typing import List, Dict, Any

# Pre-defined citizen inputs and their corresponding mock AI classifications
# Useful for testing conversational UI states in Phase 1
MOCK_SCENARIOS: List[Dict[str, Any]] = [
    {
        "scenario_id": "withdrawal_delay",
        "raw_text": "I applied for my PF withdrawal 3 weeks ago (UAN 100987654321) but it is still showing under process.",
        "expected_analysis": {
            "request_type": "GRIEVANCE",
            "intent": {
                "name": "WITHDRAWAL_DELAY",
                "confidence": 0.95,
                "description": "Citizen has filed for PF withdrawal but settlement is delayed."
            },
            "extracted_fields": {
                "uan": "100987654321",
                "claim_id": None
            },
            "missing_fields": [
                {
                    "field_name": "claim_id",
                    "field_type": "string",
                    "description": "Please provide the Claim Form Reference Number, if available."
                }
            ],
            "summary": "PF withdrawal claim status pending settlement for over 21 days.",
            "confidence": 0.92
        }
    },
    {
        "scenario_id": "uan_activation_help",
        "raw_text": "How do I activate my UAN? I just joined my first company.",
        "expected_analysis": {
            "request_type": "INFORMATION",
            "intent": {
                "name": "UAN_ACTIVATION_INFO",
                "confidence": 0.98,
                "description": "Citizen is requesting instructions on how to activate their UAN."
            },
            "extracted_fields": {},
            "missing_fields": [],
            "summary": "Information request on the step-by-step procedure for UAN activation.",
            "confidence": 0.98
        }
    }
]

# Simulated grievances database placeholder for local tracking tests
MOCK_GRIEVANCES: Dict[str, Dict[str, Any]] = {
    "GRV-987654": {
        "id": "GRV-987654",
        "citizen_name": "Aarav Sharma",
        "contact_number": "+919876543210",
        "email": "aarav.sharma@example.com",
        "uan": "100123456789",
        "category": "Withdrawal",
        "description": "Form 31 withdrawal claim submitted on 2026-08-01 still showing as 'Under Process'.",
        "status": "IN_PROGRESS",
        "created_at": "2026-08-15T10:00:00Z",
        "updated_at": "2026-08-15T10:00:00Z",
        "reminders_sent": 0
    }
}
