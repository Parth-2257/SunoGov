from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_check():
    """
    1. Test health check endpoint returns 200 OK with correct status payload.
    """
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {
        "status": "ok",
        "service": "sunogov-api"
    }


def test_create_grievance():
    """
    2. Test that creating a grievance works.
    6. Test that initial status is SUBMITTED.
    """
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
    assert data["request_type"] == "GRIEVANCE"
    assert data["status"] == "SUBMITTED"
    assert data["is_demo"] is True
    assert data["uan"] == "DEMO-9912"


def test_create_returns_unique_id():
    """
    3. Test that consecutive creations return unique IDs.
    """
    payload = {
        "request_type": "GRIEVANCE",
        "intent": "PF_TRANSFER_DELAY",
        "summary": "PF transfer pending for approximately 3 months.",
        "category": "DEMO_PF_TRANSFER_CATEGORY",
        "description": "Mera PF transfer 3 mahine se pending hai.",
        "uan": "DEMO-9912"
      }
    resp1 = client.post("/api/grievances", json=payload)
    resp2 = client.post("/api/grievances", json=payload)
    
    assert resp1.status_code == 201
    assert resp2.status_code == 201
    assert resp1.json()["id"] != resp2.json()["id"]


def test_created_grievance_is_retrievable():
    """
    4. Test that a created grievance is retrievable via GET /api/grievances/{id}.
    """
    payload = {
        "request_type": "GRIEVANCE",
        "intent": "PF_TRANSFER_DELAY",
        "summary": "PF transfer pending for approximately 3 months.",
        "category": "DEMO_PF_TRANSFER_CATEGORY",
        "description": "Mera PF transfer 3 mahine se pending hai.",
        "uan": "DEMO-123456"
      }
    create_response = client.post("/api/grievances", json=payload)
    ref_id = create_response.json()["id"]
    
    get_response = client.get(f"/api/grievances/{ref_id}")
    assert get_response.status_code == 200
    assert get_response.json()["uan"] == "DEMO-123456"
    assert get_response.json()["id"] == ref_id


def test_unknown_grievance_returns_404():
    """
    5. Test that checking a nonexistent grievance reference ID returns HTTP 404.
    """
    response = client.get("/api/grievances/SG-2026-00000")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_status_simulation_advances_correctly():
    """
    7. Test status simulation steps: SUBMITTED -> ACKNOWLEDGED -> UNDER_REVIEW -> REGIONAL_REVIEW -> RESOLVED.
    """
    payload = {
        "request_type": "GRIEVANCE",
        "intent": "PF_TRANSFER_DELAY",
        "summary": "PF transfer pending for approximately 3 months.",
        "category": "DEMO_PF_TRANSFER_CATEGORY",
        "description": "Mera PF transfer 3 mahine se pending hai.",
        "uan": "DEMO-9912"
      }
    create_response = client.post("/api/grievances", json=payload)
    ref_id = create_response.json()["id"]
    
    # 1. SUBMITTED -> ACKNOWLEDGED
    resp = client.post(f"/api/grievances/{ref_id}/simulate-status")
    assert resp.status_code == 200
    assert resp.json()["status"] == "ACKNOWLEDGED"
    
    # 2. ACKNOWLEDGED -> UNDER_REVIEW
    resp = client.post(f"/api/grievances/{ref_id}/simulate-status")
    assert resp.json()["status"] == "UNDER_REVIEW"
    
    # 3. UNDER_REVIEW -> REGIONAL_REVIEW
    resp = client.post(f"/api/grievances/{ref_id}/simulate-status")
    assert resp.json()["status"] == "REGIONAL_REVIEW"
    
    # 4. REGIONAL_REVIEW -> RESOLVED
    resp = client.post(f"/api/grievances/{ref_id}/simulate-status")
    assert resp.json()["status"] == "RESOLVED"


def test_status_cannot_advance_past_resolved():
    """
    8. Test that status simulation does not advance past RESOLVED.
    """
    payload = {
        "request_type": "GRIEVANCE",
        "intent": "PF_TRANSFER_DELAY",
        "summary": "PF transfer pending for approximately 3 months.",
        "category": "DEMO_PF_TRANSFER_CATEGORY",
        "description": "Mera PF transfer 3 mahine se pending hai.",
        "uan": "DEMO-9912"
      }
    create_response = client.post("/api/grievances", json=payload)
    ref_id = create_response.json()["id"]
    
    # Advance to RESOLVED
    for _ in range(4):
        client.post(f"/api/grievances/{ref_id}/simulate-status")
        
    get_res = client.get(f"/api/grievances/{ref_id}")
    assert get_res.json()["status"] == "RESOLVED"
    
    # Call simulate-status again
    post_res = client.post(f"/api/grievances/{ref_id}/simulate-status")
    assert post_res.status_code == 200
    assert post_res.json()["status"] == "RESOLVED"


def test_reminder_endpoint_works():
    """
    9. Test reminder records last_reminded_at timestamp.
    """
    payload = {
        "request_type": "GRIEVANCE",
        "intent": "PF_TRANSFER_DELAY",
        "summary": "PF transfer pending for approximately 3 months.",
        "category": "DEMO_PF_TRANSFER_CATEGORY",
        "description": "Mera PF transfer 3 mahine se pending hai.",
        "uan": "DEMO-9912"
      }
    create_response = client.post("/api/grievances", json=payload)
    ref_id = create_response.json()["id"]
    
    # Check that initial last_reminded_at is null
    assert create_response.json()["last_reminded_at"] is None
    
    remind_res = client.post(f"/api/grievances/{ref_id}/remind")
    assert remind_res.status_code == 200
    assert remind_res.json() == {
        "success": True,
        "message": "Demo reminder recorded.",
        "grievance_id": ref_id
    }
    
    # Fetch again to check last_reminded_at is populated
    get_res = client.get(f"/api/grievances/{ref_id}")
    assert get_res.json()["last_reminded_at"] is not None


def test_invalid_payload_rejected():
    """
    10. Test that invalid payload formats fail Pydantic validation and return 422 Unprocessable Entity.
    """
    payload = {
        "request_type": "GRIEVANCE",
        # Missing intent, summary, category, description, and uan
    }
    response = client.post("/api/grievances", json=payload)
    assert response.status_code == 422
