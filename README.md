# SunoGov

SunoGov is a citizen-first public-service accessibility prototype built for the OpenAI hackathon.

> **“Tell us what happened. Not what form to fill.”**

SunoGov reimagines the citizen-facing experience of complex public-service workflows. It allows a citizen to explain their public-service issues naturally using text or voice. SunoGov intends to use AI to classify the problem, identify the correct category, collect details, and simulate an interaction with government services.

The initial target use case is **EPFO (Employees' Provident Fund Organisation) Grievance Assistance**.

---

## ⚠️ PROTOTYPE-ONLY DISCLAIMER & SYNTHETIC DATA POLICY

* **Non-Affiliation**: SunoGov is **NOT** an official government product, is **NOT** connected to EPFO, and is **NOT** affiliated with any live government service.
* **No Live Connections**: There is absolutely no connection to live EPFO systems or government APIs. All submissions are purely simulated.
* **Synthetic Data Only**: Do **NOT** input real citizen credentials, Aadhaar, PAN, passwords, OTPs, or financial details. The application utilizes synthetic, mocked data for all workflows.
* **No Real Submissions**: Grievance filings and status tracking are fully mocked and run in a simulated backend environment.

---

## Technology Stack

### Frontend
* **React** with **TypeScript**
* **Vite** (Build Tool)
* **Tailwind CSS** (Styling)
* **React Router v6** (Routing)
* **Lucide React** (Icons)

### Backend
* **Python 3.13**
* **FastAPI** (Web Framework)
* **Pydantic v2** (Data Validation & Serialization)
* **Uvicorn** (ASGI Web Server)

---

## Project Structure

```text
sunogov/
│
├── frontend/             # React/TypeScript/Vite Frontend Application
│   ├── src/
│   │   ├── components/   # Reusable UI parts (buttons, inputs, layouts)
│   │   ├── pages/        # Placeholder views representing routing structure
│   │   ├── services/     # Centralized API client service
│   │   ├── types/        # TypeScript interfaces & enums representing API contracts
│   │   └── data/         # Synthetic frontend data scenarios
│   └── package.json
│
├── backend/              # FastAPI Backend Application
│   ├── app/
│   │   ├── routes/       # Health, analyze, grievances, and resources endpoints
│   │   ├── core/         # Configuration loading using pydantic-settings
│   │   ├── schemas/      # Input/Output data schemas
│   │   └── data/         # Backend mock scenarios
│   └── requirements.txt
│
└── docs/                 # System Architecture & Development Guidelines
```

---

## Development Phases

* **Phase 0 (Current)**: Project Foundation & Architecture. Clean monorepo structure, type safety, environment configuration, routing skeleton, central API service, backend endpoints with health checks, and responsive design systems.
* **Phase 1 (Planned)**: Controlled Local Mock Journey. Citizen conversational interface powered by local mock responses.
* **Phase 2 (Planned)**: AI & Storage Integration. OpenAI APIs, Speech-to-Text, and MongoDB persistence.
* **Phase 3 (Planned)**: Mock Government service & Testing. Interactive simulated EPFO service.

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
   The backend API will run at `http://127.0.0.1:8000`. You can check the health check status at `http://127.0.0.1:8000/api/health`.

### 2. Setting up Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the environment file and configure if necessary:
   ```bash
   cp .env.example .env
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The frontend application will run at `http://localhost:5173`.