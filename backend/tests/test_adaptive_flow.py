from app.core.config import settings

# Force mock provider for offline tests
settings.AI_PROVIDER = "mock"

from fastapi.testclient import TestClient
from app.main import app
from app.routes.analyze import analyzer
from app.ai.analyzer import AIAnalyzer
from app.ai.mock_provider import MockAIProvider
from app.ai.schemas import AIAnalysisSchema, AIMissingField, AIRequestType, AIIntent
import pytest

client = TestClient(app)


@pytest.fixture(autouse=True)
def set_mock_provider():
    """
    Autouse fixture resetting the analyzer provider to MockAIProvider before every test case.
    """
    analyzer.provider = MockAIProvider()


def test_information_flow_no_uan():
    """
    INFORMATION requests must not contain UAN or other missing fields.
    """
    response = client.post("/api/analyze", json={"text": "Medical emergency ke liye PF kaise withdraw kar sakta hoon?"})
    assert response.status_code == 200
    data = response.json()
    assert data["analysis"]["request_type"] == "INFORMATION"
    assert len(data["analysis"]["missing_fields"]) == 0


def test_status_flow_requests_reference_id_no_uan():
    """
    STATUS requests must ask for grievance_reference_number and NOT ask for UAN.
    """
    response = client.post("/api/analyze", json={"text": "Meri grievance ka status check karna hai."})
    assert response.status_code == 200
    data = response.json()
    analysis = data["analysis"]
    assert analysis["request_type"] == "STATUS"
    
    fields = [item["field"] for item in analysis["missing_fields"]]
    assert "grievance_reference_number" in fields
    assert "uan" not in fields


def test_pf_transfer_requests_uan_and_optional_reference():
    """
    PF_TRANSFER request maps to GRIEVANCE and asks for UAN (required) and transfer_reference_number (optional).
    """
    response = client.post("/api/analyze", json={"text": "Mera PF transfer 3 mahine se pending hai."})
    assert response.status_code == 200
    data = response.json()
    analysis = data["analysis"]
    assert analysis["request_type"] == "GRIEVANCE"
    
    fields = analysis["missing_fields"]
    assert len(fields) >= 1
    
    uan_field = next(f for f in fields if f["field"] == "uan")
    assert uan_field["required"] is True
    assert uan_field["question"] is not None
    
    # Optional field check
    transfer_ref = next((f for f in fields if f["field"] == "transfer_reference_number"), None)
    if transfer_ref:
        assert transfer_ref["required"] is False


class DummyUnsupportedProvider:
    async def analyze(self, text: str) -> AIAnalysisSchema:
        return AIAnalysisSchema(
            request_type=AIRequestType.GRIEVANCE,
            intent=AIIntent.PF_TRANSFER,
            language="english",
            summary="Test query",
            confidence=0.99,
            missing_fields=[
                AIMissingField(field="uan", reason="Required", required=True, question="What is your UAN?"),
                AIMissingField(field="credit_card_number", reason="Unsafe field", required=False, question="Enter card number"),
                AIMissingField(field="transfer_reference_number", reason="Whitelisted", required=False, question="Do you have reference?")
            ]
        )


@pytest.mark.anyio
async def test_unsupported_ai_fields_rejected():
    """
    Fields not in the whitelist (e.g. credit_card_number) must be filtered out by the analyzer.
    """
    analyzer = AIAnalyzer(provider=DummyUnsupportedProvider())
    result = await analyzer.analyze_query("Dummy user text")
    
    fields = [item.field for item in result.missing_fields]
    assert "uan" in fields
    assert "transfer_reference_number" in fields
    assert "credit_card_number" not in fields
