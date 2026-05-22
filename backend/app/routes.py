from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum

from app.routes import router

app = FastAPI(
    title="VoltStream API",
    version="1.0.0",

    # IMPORTANT for API Gateway stage
    root_path="/default",

    # Swagger/OpenAPI URLs
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(router)

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "VoltStream Backend Running Successfully"
    }

# Health endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "healthy"
    }

# Lambda handler
handler = Mangum(
    app,
    api_gateway_base_path="/default"
)