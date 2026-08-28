import os
import json
import asyncio
import pytest
from fastapi.testclient import TestClient
from app.core.config import settings

# Force mock provider for offline tests
settings.AI_PROVIDER = "mock"

from app.main import app
from app.ai.analyzer import AIAnalyzer
from app.ai.mock_provider import MockAIProvider
from app.ai.schemas import AIAnalysisSchema
from app.routes.analyze import analyzer

client = TestClient(app)


@pytest.fixture(autouse=True)
def set_mock_provider():
    """
    Autouse fixture resetting the analyzer provider to MockAIProvider before every test case.
    """
    analyzer.provider = MockAIProvider()


# ==========================================
# Phase 0 & Phase 2 Endpoint Tests
# ==========================================

def test_health_check():
    """
    Test health check endpoint returns 200 OK with correct status payload.
    """
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {
        "status": "ok",
        "service": "sunogov-api"
    }


def test_create_grievance():
    payload = {
        "request_type": "GRIEVANCE",
        "intent": "PF_TRANSFER_DELAY",
        "summary": "PF transfer pending for approximately 3 months.",
        "category": "DEMO_PF_TRANSFER_CATEGORY",
        "description": "Mera PF transfer 3 mahine se pending hai.",
        "uan": "DEMO-9912"
    }
    response = client.post("/api/grievances", json=payload)
    assert response.status_code == 201
    
    data = response.json()
    assert "id" in data
    assert data["id"].startswith("SG-2026-")
    assert data["status"] == "SUBMITTED"


def test_unknown_grievance_returns_404():
    response = client.get("/api/grievances/SG-2026-00000")
    assert response.status_code == 404


# ==========================================
# Phase 3A AI Infrastructure Tests
# ==========================================

def test_analyze_endpoint_works():
    """
    1. Test that POST /api/analyze works.
    """
    response = client.post("/api/analyze", json={"text": "Mera PF transfer 3 mahine se pending hai."})
    assert response.status_code == 200
    
    data = response.json()
    assert data["success"] is True
    assert "analysis" in data
    
    analysis = data["analysis"]
    assert "request_type" in analysis
    assert "intent" in analysis
    assert "language" in analysis
    assert "summary" in analysis
    assert "confidence" in analysis
    assert "missing_fields" in analysis


def test_pf_transfer_query_determinations():
    """
    2. PF transfer input returns GRIEVANCE.
    3. PF transfer input returns PF_TRANSFER.
    """
    response = client.post("/api/analyze", json={"text": "Mera PF transfer 3 mahine se pending hai."})
    analysis = response.json()["analysis"]
    
    assert analysis["request_type"] == "GRIEVANCE"
    assert analysis["intent"] == "PF_TRANSFER"
    assert len(analysis["missing_fields"]) > 0
    assert analysis["missing_fields"][0]["field"] == "uan"


def test_informational_withdrawal_query():
    """
    4. Informational PF withdrawal question returns INFORMATION.
    """
    response = client.post("/api/analyze", json={"text": "Medical emergency ke liye PF kaise withdraw kar sakta hoon?"})
    analysis = response.json()["analysis"]
    
    assert analysis["request_type"] == "INFORMATION"
    assert analysis["intent"] == "PF_CLAIM"
    assert len(analysis["missing_fields"]) == 0  # No grievance generated


def test_status_checking_query():
    """
    5. Status question returns STATUS.
    """
    response = client.post("/api/analyze", json={"text": "Meri grievance ka status check karna hai."})
    analysis = response.json()["analysis"]
    
    assert analysis["request_type"] == "STATUS"
    assert analysis["intent"] == "GRIEVANCE_STATUS"


def test_unknown_fallback_query():
    """
    6. Unknown input returns UNKNOWN.
    """
    response = client.post("/api/analyze", json={"text": "EPFO portal error code 12345"})
    analysis = response.json()["analysis"]
    
    assert analysis["request_type"] == "UNKNOWN"
    assert analysis["intent"] == "UNKNOWN"
    assert analysis["confidence"] == 0.30
    assert len(analysis["missing_fields"]) == 0


def test_confidence_bounds_verification():
    """
    7. Confidence is always a numeric value between 0 and 1.
    """
    response = client.post("/api/analyze", json={"text": "Mera PF transfer 3 mahine se pending hai."})
    analysis = response.json()["analysis"]
    assert isinstance(analysis["confidence"], float)
    assert 0.0 <= analysis["confidence"] <= 1.0


def test_invalid_payload_rejected_at_routes():
    """
    8. Invalid requests cannot bypass Pydantic validations.
    """
    # Empty string text or missing text field
    response = client.post("/api/analyze", json={})
    assert response.status_code == 422


# Setup custom low-confidence mock for threshold testing
class LowConfidenceMockProvider(MockAIProvider):
    async def analyze(self, text: str) -> AIAnalysisSchema:
        res = await super().analyze(text)
        res.confidence = 0.40  # Below default 0.50 threshold
        return res


def test_confidence_threshold_fallback():
    """
    9. Provider low-confidence results trigger fallback schema.
    """
    async def run():
        analyzer = AIAnalyzer(provider=LowConfidenceMockProvider())
        return await analyzer.analyze_query("Mera PF transfer 3 mahine se pending hai.")
        
    result = asyncio.run(run())
    assert result.request_type == "UNKNOWN"
    assert result.intent == "UNKNOWN"
    assert result.confidence <= 0.30


def test_no_external_network_requests():
    """
    10. Ensure no external APIs are called during analysis (runs instantly locally).
    """
    import time
    start_time = time.time()
    
    response = client.post("/api/analyze", json={"text": "Mera PF transfer 3 mahine se pending hai."})
    end_time = time.time()
    
    assert response.status_code == 200
    # Local check must resolve under 20ms, proving no third-party HTTP latency
    assert (end_time - start_time) < 0.02


# ==========================================
# 30-Case AI Regression Executable Suite
# ==========================================

def test_30_case_ai_regression():
    """
    Executes the 30-case synthetic query suite, verifying the expected request_type
    and intent mappings for each dialect.
    """
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    json_path = os.path.join(base_dir, "app", "data", "ai_test_cases.json")
    
    with open(json_path, "r", encoding="utf-8") as f:
        cases = json.load(f)
        
    assert len(cases) == 30
    
    for case in cases:
        response = client.post("/api/analyze", json={"text": case["input"]})
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] is True
        
        analysis = data["analysis"]
        assert analysis["request_type"] == case["expected_request_type"], f"Failed case {case['id']}: expected request_type {case['expected_request_type']}, got {analysis['request_type']}"
        assert analysis["intent"] == case["expected_intent"], f"Failed case {case['id']}: expected intent {case['expected_intent']}, got {analysis['intent']}"
        assert 0.0 <= analysis["confidence"] <= 1.0
