import os
import json
import pytest
from app.core.config import settings

# Force openrouter provider for integration tests
settings.AI_PROVIDER = "openrouter"

from fastapi.testclient import TestClient
from app.main import app
from app.routes.analyze import analyzer
from app.ai.openrouter_provider import OpenRouterProvider

client = TestClient(app)


@pytest.fixture(autouse=True)
def set_openrouter_provider():
    """
    Autouse fixture resetting the analyzer provider to OpenRouterProvider before every test case.
    """
    analyzer.provider = OpenRouterProvider()

# Condition to determine if OpenRouter provider is actively configured
OPENROUTER_CONFIGURED = (
    settings.OPENROUTER_API_KEY is not None 
    and settings.OPENROUTER_API_KEY != ""
    and settings.OPENROUTER_API_KEY != "YOUR_OPENROUTER_API_KEY"
)

# Skip all tests in this module if OpenRouter is offline/not configured
pytestmark = pytest.mark.skipif(
    not OPENROUTER_CONFIGURED,
    reason="Integration tests skipped. Set AI_PROVIDER=openrouter and provide OPENROUTER_API_KEY."
)


def test_openrouter_basic_analysis():
    """
    Test direct POST /api/analyze call targeting OpenRouter.
    """
    response = client.post("/api/analyze", json={"text": "Mera PF transfer 3 mahine se pending hai."})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    
    analysis = data["analysis"]
    assert "request_type" in analysis
    assert "intent" in analysis
    assert "confidence" in analysis
    assert isinstance(analysis["confidence"], float)


def test_30_case_real_model_evaluation():
    """
    Evaluates the complete 30-case synthetic dataset against the real OpenRouter
    GLM-5.3 Flash model, compiling a comparative accuracy report.
    """
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    json_path = os.path.join(base_dir, "app", "data", "ai_test_cases.json")
    
    with open(json_path, "r", encoding="utf-8") as f:
        cases = json.load(f)
        
    print("\n--- REAL MODEL EVALUATION — GLM-5.3 Flash via OpenRouter ---")
    passed_cases = 0
    total_cases = len(cases)
    
    for case in cases:
        response = client.post("/api/analyze", json={"text": case["input"]})
        assert response.status_code == 200
        
        data = response.json()
        analysis = data["analysis"]
        
        req_type_match = (analysis["request_type"] == case["expected_request_type"])
        intent_match = (analysis["intent"] == case["expected_intent"])
        
        if req_type_match and intent_match:
            passed_cases += 1
            status = "PASS"
        else:
            status = "MISMATCH"
            
        print(
            f"Case #{case['id']} ({case['description']}): {status} | "
            f"Expected: ({case['expected_request_type']}, {case['expected_intent']}) | "
            f"Actual: ({analysis['request_type']}, {analysis['intent']}) | "
            f"Confidence: {analysis['confidence']:.2f}"
        )
        
    print(f"Accuracy: {passed_cases}/{total_cases} passed ({(passed_cases/total_cases)*100:.1f}%)")
    print("---------------------------------------------")
