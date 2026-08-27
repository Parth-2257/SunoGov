from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_check():
    """
    Test the health check endpoint returns 200 OK with correct status payload.
    """
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {
        "status": "ok",
        "service": "sunogov-api"
    }


def test_placeholder_endpoints():
    """
    Test that other route groups correctly return 501 Not Implemented
    conformant to Phase 0 constraints.
    """
    # 1. Analyze Request API
    response = client.post("/api/analyze", json={"text": "Invalid text input"})
    assert response.status_code == 501
    assert "not implemented" in response.json()["detail"].lower()

    # 2. Create Grievance API
    response = client.post("/api/grievances", json={
        "citizen_name": "John Doe",
        "contact_number": "+919876543210",
        "uan": "100123456789",
        "category": "Withdrawal",
        "description": "Detailed description of a simulated grievance claim."
    })
    assert response.status_code == 501

    # 3. Get Grievance API
    response = client.get("/api/grievances/GRV-123456")
    assert response.status_code == 501

    # 4. Grievance Reminder API
    response = client.post("/api/grievances/GRV-123456/remind")
    assert response.status_code == 501

    # 5. Resources API
    response = client.get("/api/resources")
    assert response.status_code == 501
