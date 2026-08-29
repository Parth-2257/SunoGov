# SunoGov - Backend API

This is the backend API service for **SunoGov**, powered by FastAPI, Pydantic, and Uvicorn.

---

## Technical Stack

* **Framework**: FastAPI
* **Validation**: Pydantic v2
* **Server**: Uvicorn
* **Python Version**: 3.10+ (Recommended: 3.13)

---

## Directory Layout

```text
backend/
├── app/
│   ├── core/         # Settings loading and basic configuration
│   ├── data/         # Mock scenarios and demo data models
│   ├── routes/       # Endpoint routers (health, analyze, grievances, resources)
│   ├── schemas/      # Input/Output validation schemas
│   └── main.py       # API configuration and service initialization
├── tests/            # System unit tests
├── .env.example      # Example environment configuration
├── requirements.txt  # Project Python dependencies
└── README.md         # Document you are reading
```

---

## Installation & Setup

1. **Activate Virtual Environment**:
   It is highly recommended to run inside a virtual environment.
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```

2. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure Environment**:
   Duplicate `.env.example` as `.env` and fill out your variables if needed:
   ```bash
   cp .env.example .env
   ```

4. **Run Server**:
   ```bash
   uvicorn app.main:app --reload
   ```
   The backend will start at [http://127.0.0.1:8000](http://127.0.0.1:8000).

---

## Active API Endpoints (Phase 0)

* **Health Check**:
  * `GET /api/health` -> Returns `{"status": "ok", "service": "sunogov-api"}` (Active and operational)

* **Planned Placeholders (HTTP 501 Not Implemented)**:
  * `POST /api/analyze` -> Analyzes user queries (Requires OpenAI in Phase 2)
  * `POST /api/grievances` -> Submits a grievance
  * `GET /api/grievances/{id}` -> Fetches grievance status
  * `POST /api/grievances/{id}/remind` -> Sends a reminder
  * `GET /api/resources` -> Fetches FAQs/Guides


### Running in Reload Mode
To automatically refresh python code during active edits, use `--reload` flag during local launches.