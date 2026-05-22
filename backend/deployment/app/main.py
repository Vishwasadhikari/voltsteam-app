from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum

from app.routes import router

app = FastAPI(
    title="VoltStream API",
    version="1.0.0",
    root_path="/default",
    openapi_url="/openapi.json",
    docs_url="/docs",
    swagger_ui_parameters={
        "url": "/default/openapi.json"
    }
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.get("/")
async def root():
    return {
        "message": "VoltStream Backend Running Successfully"
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy"
    }

handler = Mangum(app)