# SunoGov Deployment Guide

This guide details instructions for deploying the SunoGov prototype:
1. **Backend** → Render (Python Web Service)
2. **Frontend** → Vercel (React Single Page Application)

---

## 1. Backend Deployment (Render)

Deploy the FastAPI backend application as a Render **Web Service**:

### Step-by-Step Instructions
1. Log in to your Render Dashboard and click **New > Web Service**.
2. Connect your Git repository.
3. Configure the following service settings:
   - **Name**: `sunogov-api`
   - **Language**: `Python 3`
   - **Branch**: `main`
   - **Root Directory**: `backend` (if you are deploying from a monorepo setup)
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add the following **Environment Variables** in the Service Dashboard:
   - `AI_PROVIDER`: `openrouter` (to use the real model, or `mock` for testing)
   - `OPENROUTER_API_KEY`: `YOUR_REAL_OPENROUTER_KEY`
   - `OPENROUTER_MODEL`: `z-ai/glm-5.3-flash`
   - `OPENROUTER_BASE_URL`: `https://openrouter.ai/api/v1`
   - `AI_CONFIDENCE_THRESHOLD`: `0.50`
   - `BACKEND_CORS_ORIGINS`: `https://your-frontend.vercel.app` (replace with your Vercel URL once generated)
   - `BHASHINI_API_KEY`, `BHASHINI_USER_ID`, `BHASHINI_APP_ID`: (placeholders only)
5. Click **Deploy Web Service**.

> [!WARNING]
> **Data Persistence Notice:**
> The current grievance database is in-memory. Because Render restarts its web service processes periodically (at least once per day or on new builds), all simulated grievance data and reminders will reset. This is expected behavior for this hackathon prototype.

---

## 2. Frontend Deployment (Vercel)

Deploy the React/TypeScript/Vite frontend application to **Vercel**:

### Step-by-Step Instructions
1. Log in to Vercel and click **Add New > Project**.
2. Select your Git repository.
3. Configure the following project parameters:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add the following **Environment Variable**:
   - `VITE_API_URL`: `https://sunogov-api.onrender.com/api` (replace with the active URL of your Render Web Service)
5. Click **Deploy**.

### SPA Routing Support
The frontend contains a `vercel.json` file under `frontend/vercel.json` that Vercel automatically processes. This routes all browser pathways back to `index.html` to prevent 404 errors during direct navigation or browser refresh actions.
