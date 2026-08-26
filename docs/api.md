# SunoGov API Specification (Phase 0)

All endpoints are prefixed with `/api` and return content formatted in JSON.

---

## Endpoints

### 1. Health Status
Verify the FastAPI backend is running and reachable.

* **URL**: `/api/health`
* **Method**: `GET`
* **Response Status**: `200 OK`
* **Response Payload**:
  ```json
  {
    "status": "ok",
    "service": "sunogov-api"
  }
  ```

---

### 2. Natural Language Request Analysis
Submit user text to identify type, intent, extracted entities, and missing fields.

* **URL**: `/api/analyze`
* **Method**: `POST`
* **Request Payload**:
  ```json
  {
    "text": "My UAN is 100123456789. I filed Form 31 claim but still pending."
  }
  ```
* **Response Status**: `501 Not Implemented` (Phase 0 Placeholder)
* **Future Success Payload** (`200 OK`):
  ```json
  {
    "success": true,
    "analysis": {
      "request_type": "GRIEVANCE",
      "intent": {
        "name": "CLAIM_SETTLEMENT_DELAY",
        "confidence": 0.96,
        "description": "Citizen experiencing delay in settling PF withdrawal claims."
      },
      "extracted_fields": {
        "uan": "100123456789"
      },
      "missing_fields": [
        {
          "field_name": "claim_id",
          "field_type": "string",
          "description": "EPFO Claim Reference ID (if available)"
        }
      ],
      "summary": "Form 31 PF withdrawal claim pending status update for more than 20 days.",
      "confidence": 0.94
    }
  }
  ```

---

### 3. Grievances Creation
Register a new simulated grievance.

* **URL**: `/api/grievances`
* **Method**: `POST`
* **Request Payload**:
  ```json
  {
    "citizen_name": "Vikram Seth",
    "contact_number": "+919988776655",
    "email": "vikram.seth@example.com",
    "uan": "100123456789",
    "category": "Withdrawal",
    "description": "Form 31 claim submitted for medical emergency is stuck for 3 weeks."
  }
  ```
* **Response Status**: `501 Not Implemented` (Phase 0 Placeholder)
* **Future Success Payload** (`201 Created`):
  ```json
  {
    "id": "GRV-88271A",
    "citizen_name": "Vikram Seth",
    "contact_number": "+919988776655",
    "email": "vikram.seth@example.com",
    "uan": "100123456789",
    "category": "Withdrawal",
    "description": "Form 31 claim submitted for medical emergency is stuck for 3 weeks.",
    "status": "SUBMITTED",
    "created_at": "2026-08-28T12:00:00Z",
    "updated_at": "2026-08-28T12:00:00Z",
    "reminders_sent": 0
  }
  ```

---

### 4. Fetch Grievance
Retrieve status timeline for a specific simulated grievance.

* **URL**: `/api/grievances/{id}`
* **Method**: `GET`
* **Response Status**: `501 Not Implemented` (Phase 0 Placeholder)
* **Future Success Payload** (`200 OK`):
  ```json
  {
    "id": "GRV-88271A",
    "citizen_name": "Vikram Seth",
    "contact_number": "+919988776655",
    "email": "vikram.seth@example.com",
    "uan": "100123456789",
    "category": "Withdrawal",
    "description": "Form 31 claim submitted for medical emergency is stuck for 3 weeks.",
    "status": "IN_PROGRESS",
    "created_at": "2026-08-28T12:00:00Z",
    "updated_at": "2026-08-28T12:04:00Z",
    "reminders_sent": 0
  }
  ```

---

### 5. Send Grievance Reminder
Send a simulated reminder to the agency desk.

* **URL**: `/api/grievances/{id}/remind`
* **Method**: `POST`
* **Response Status**: `501 Not Implemented` (Phase 0 Placeholder)
* **Future Success Payload** (`200 OK`):
  ```json
  {
    "success": true
  }
  ```

---

### 6. Fetch Information Resources
Retrieve general FAQs and guidelines.

* **URL**: `/api/resources`
* **Method**: `GET`
* **Response Status**: `501 Not Implemented` (Phase 0 Placeholder)
* **Future Success Payload** (`200 OK`):
  ```json
  [
    {
      "id": "res-uan-activation",
      "title": "How to Activate your UAN",
      "description": "Learn the steps to activate your Universal Account Number online.",
      "category": "UAN Activation",
      "link": "https://www.epfindia.gov.in/"
    }
  ]
  ```
