from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum

from app.routes import router
from app.chat import router as chat_router
from app.qa import router as qa_router

app = FastAPI(
    title="VoltStream API",
    version="1.0.0"
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

# Existing VoltStream APIs
app.include_router(router)

# AI Chat Endpoint
app.include_router(chat_router)

# RAG QA Endpoint
app.include_router(qa_router)

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
handler = Mangum(app)