# SunoGov

SunoGov is a citizen-first public-service accessibility prototype built for the OpenAI hackathon.

> **“Tell us what happened. Not what form to fill.”**

SunoGov simplifies and streamlines the citizen-facing experience of complex public-service workflows. It allows citizens to explain their public-service issues naturally in text or voice (English, Hindi, or Marathi). SunoGov uses AI to classify the query type, determine category intents, extract required fields, and guide citizens through structured mock grievance submissions or official information guidelines.

The target use case is **EPFO (Employees' Provident Fund Organisation) Grievance Assistance**.

---

## ⚠️ PROTOTYPE-ONLY DISCLAIMER & SYNTHETIC DATA POLICY

* **Non-Affiliation**: SunoGov is **NOT** an official government product, is **NOT** connected to EPFO, and is **NOT** affiliated with any live government service.
* **No Live Connections**: There is absolutely no connection to live EPFO systems or government APIs. All submissions are purely simulated.
* **Synthetic Data Only**: Do **NOT** input real citizen credentials, Aadhaar, PAN, passwords, OTPs, or financial details. The application utilizes synthetic, mocked data for all workflows.
* **No Real Submissions**: Grievance filings and status tracking are fully mocked and run in a simulated backend environment.

---

## Key Features

1. **Intelligent Query Analysis**: Powered by OpenRouter (`z-ai/glm-5.3-flash` model), parsing text inputs and categorizing requests into `GRIEVANCE`, `INFORMATION`, or `STATUS` queries.
2. **Indian Language Voice Input**: Powered by browser Web Speech API, allowing voice inputs in English, Hindi, and Marathi.
3. **Informational Guidance Center**: Automatically routes informational queries (`INFORMATION`) to relevant procedural resources (collapsible guides covering withdrawals, transfers, and pension rules) with search and tag filters.
4. **PII Safety & Operations**: Zero hardcoding of API keys. PII filters prevent storing or logging raw descriptions, Aadhaar, or UAN numbers.
5. **Interactive Timeline Simulation**: Allows citizens to trigger status updates on mock grievances and submit reminders.

---

## Technology Stack

### Frontend
* **React 19** with **TypeScript**
* **Vite** (Build Tool)
* **Tailwind CSS** (Styling)
* **React Router v7** (Routing)
* **Lucide React** (Icons)

### Backend
* **Python 3.13**
* **FastAPI** (Web Framework)
* **Pydantic v2** (Data Validation & Serialization)
* **Uvicorn** (ASGI Web Server)

---

## Running the Project

Ensure you have **Node.js (v20+)** and **Python (v3.10+)** installed on your machine.

### 1. Setting up Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy the environment file and configure if necessary:
   ```bash
   cp .env.example .env
   ```
5. Start the backend development server:
   ```bash
   uvicorn app.main:app --reload
   ```
   The backend API will run at `http://localhost:8000`. You can check the health status at `http://localhost:8000/api/health`.

### 2. Setting up Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the environment file:
   ```bash
   cp .env.example .env
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The frontend application will run at `http://localhost:5173`.

---

## Deployment & Production Configurations
For full instructions on deploying the frontend to **Vercel** and the backend to **Render**, please review the [Deployment Guide](docs/deployment.md).