from datetime import datetime, timezone
from random import random
from typing import Literal

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.agent.voltstream_agent import run_agent
from app.device_store import DeviceResponse
from services.s3_device_service import load_devices

router = APIRouter()


class LivePowerStatus(BaseModel):
    grid_draw_kw: float
    solar_gen_kw: float
    net_usage_kw: float
    timestamp: str


class EnergyDataPoint(BaseModel):
    label: str
    grid: float
    solar: float





class DeviceUpdate(BaseModel):
    on: bool


class BillingSummary(BaseModel):
    current_balance: int
    projected_bill: int
    budget_limit: int
    days_remaining: int
    rate_per_kwh: float
   
from typing import Optional

class AgentRequest(BaseModel):
    message: str
    history: Optional[list] = []





def live_power():
    return LivePowerStatus(
        grid_draw_kw=round(2.4 + random() * 0.6, 2),
        solar_gen_kw=round(1.8 + random() * 0.9, 2),
        net_usage_kw=round(0.3 + random() * 0.5, 2),
        timestamp=datetime.now(timezone.utc).isoformat(),
    )


def history_points(period):
    if period == "daily":
        labels = [f"{hour}:00" for hour in range(24)]
    elif period == "weekly":
        labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    else:
        labels = [f"D{day}" for day in range(1, 31)]

    return [
        EnergyDataPoint(
            label=label,
            grid=round(2 + random() * 2, 1),
            solar=round(1.2 + random() * 1.8, 1),
        )
        for label in labels
    ]


@router.get("/api/v1/health")
def health():
    return {"status": "ok"}


@router.get("/api/v1/dashboard/live", response_model=LivePowerStatus)
def get_live_power():
    return live_power()


@router.get("/api/v1/analytics/history", response_model=list[EnergyDataPoint])
def get_history(period: Literal["daily", "weekly", "monthly"] = "daily"):
    return history_points(period)


@router.get("/api/v1/devices")
def get_devices():

    return load_devices()


@router.patch("/api/v1/devices/{device_id}", response_model=DeviceResponse)
def update_device(device_id: int, update: DeviceUpdate):
    for index, device in enumerate(devices):
        if device.id == device_id:
            devices[index] = device.copy(update={"on": update.on})
            return devices[index]

    raise HTTPException(status_code=404, detail="Device not found")


@router.get("/api/v1/billing/summary", response_model=BillingSummary)
def get_billing_summary():
    return BillingSummary(
        current_balance=2840,
        projected_bill=3120,
        budget_limit=3000,
        days_remaining=17,
        rate_per_kwh=8.5,
    )



@router.post("/api/v1/agent")
async def agent_chat(request: AgentRequest):

    result = invoke_agentcore(
        request.message,
        request.history
    )

    return result
   