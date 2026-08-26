# System Architecture & Flow Design

This document details the architectural layout, ingestion flows, and integration design for **SunoGov**.

---

## High-Level Information Flow

```text
       ┌───────────┐
       │  Citizen  │
       └─────┬─────┘
             │ (1) Speaks or types query in plain language
             ▼
       ┌───────────┐
       │  Frontend │ (React / TypeScript SPA)
       └─────┬─────┘
             │ (2) Transcribes/sends natural text payload
             ▼
       ┌───────────┐
       │  FastAPI  │ (Backend Gateway Routing)
       └─────┬─────┘
             │ (3) Evaluates request context
             ▼
     ┌───────────────┐
     │   AI Layer    │ [PLANNED / NOT IMPLEMENTED IN PHASE 0]
     └───────┬───────┘ (OpenAI classification & validation)
             │ (4) Checks for missing fields (e.g. UAN, Category)
             ▼
     ┌───────────────┐
     │  Validation   │ [PLANNED / NOT IMPLEMENTED IN PHASE 0]
     └───────┬───────┘ (Grievance schema validation & state)
             │ (5) Registers structured draft
             ▼
┌─────────────────────────┐
│ Mock Government Service │ [PLANNED / NOT IMPLEMENTED IN PHASE 0]
└────────────┬────────────┘ (Simulated EPFO resolver desk)
             │ (6) Triggers status updates & notifications
             ▼
       ┌───────────┐
       │  Citizen  │ (Reviews status tracker timeline)
       └───────────┘
```

---

## Component Boundaries

### 1. Citizen Interface (Frontend SPA)
* **Goal**: Provide a highly accessible, conversational viewport for citizens.
* **Technology**: React, Tailwind CSS, Lucide React.
* **Implementation Status**:
  * Phase 0: Basic layout shells, page routing, and design systems.
  * Phase 1: Local mock-driven conversational interaction.
  * Phase 2: Speech-to-Text dictation.

### 2. Backend Gateway Router (FastAPI)
* **Goal**: Serve endpoints, validate payloads, and coordinate services.
* **Technology**: FastAPI, Uvicorn, Pydantic.
* **Implementation Status**:
  * Phase 0: Server structure, `/api/health` validation, and placeholder endpoint returns (HTTP 501).

### 3. AI Cognitive Processor (OpenAI SDK wrapper)
* **Goal**: Intent classification, entity extraction (e.g. UAN, Member ID), and text summarization.
* **Technology**: OpenAI API (GPT-4o or GPT-4o-mini).
* **Implementation Status**:
  * **PLANNED / NOT IMPLEMENTED IN PHASE 0**. Setup as a placeholder API layer.

### 4. Database Persistence (MongoDB)
* **Goal**: Secure storage for grievance claims, status trails, and mock settings.
* **Technology**: MongoDB.
* **Implementation Status**:
  * **PLANNED / NOT IMPLEMENTED IN PHASE 0**.

### 5. Mock EPFO Service Engine
* **Goal**: Simulate the processing, reviewing, and resolution of grievances, complete with status notifications.
* **Implementation Status**:
  * **PLANNED / NOT IMPLEMENTED IN PHASE 0**.
