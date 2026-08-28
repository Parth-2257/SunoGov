from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routes import health, analyze, grievances, resources

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="SunoGov API - Phase 0 Foundation",
    version="0.1.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc"
)

# CORS Configuration
cors_origins = settings.get_cors_origins
if cors_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Register API Routers
app.include_router(health.router, prefix=settings.API_V1_STR, tags=["System Health"])
app.include_router(analyze.router, prefix=settings.API_V1_STR, tags=["AI Analysis"])
app.include_router(grievances.router, prefix=f"{settings.API_V1_STR}/grievances", tags=["Grievances"])
app.include_router(resources.router, prefix=f"{settings.API_V1_STR}/resources", tags=["Information Resources"])
