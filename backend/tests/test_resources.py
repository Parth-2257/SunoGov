from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_get_resources_endpoint():
    """
    Test GET /api/resources returns the list of all static guides.
    """
    response = client.get("/api/resources")
    assert response.status_code == 200
    
    resources = response.json()
    assert len(resources) == 5
    
    # Assert specific category matches are present
    categories = [res["category"] for res in resources]
    assert "Withdrawal" in categories
    assert "Transfer" in categories
    assert "Pension" in categories
    assert "Claim Guidance" in categories
    assert "Documents" in categories
    
    # Verify rich fields exist
    for resource in resources:
        assert "id" in resource
        assert "title" in resource
        assert "description" in resource
        assert "what_it_means" in resource
        assert "what_you_need" in resource
        assert "what_to_do" in resource
        assert "when_to_file_grievance" in resource
        
        # Verify types
        assert isinstance(resource["what_you_need"], list)
        assert isinstance(resource["what_to_do"], list)


def test_get_resources_with_filter():
    """
    Test category filtering works.
    """
    response = client.get("/api/resources?category=Pension")
    assert response.status_code == 200
    resources = response.json()
    assert len(resources) == 1
    assert resources[0]["id"] == "guidance-pension"
