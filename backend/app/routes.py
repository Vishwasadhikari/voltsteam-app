from datetime import datetime, timezone
from random import random
from typing import Literal

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel


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


class DeviceResponse(BaseModel):
    id: int
    name: str
    room: str
    watts: int
    on: bool


class DeviceUpdate(BaseModel):
    on: bool


class BillingSummary(BaseModel):
    current_balance: int
    projected_bill: int
    budget_limit: int
    days_remaining: int
    rate_per_kwh: float


devices = [
    DeviceResponse(id=1, name="Air Conditioner", room="Living Room", watts=1500, on=True),
    DeviceResponse(id=2, name="Water Heater", room="Bathroom", watts=2000, on=False),
    DeviceResponse(id=3, name="EV Charger", room="Garage", watts=7200, on=True),
    DeviceResponse(id=4, name="Refrigerator", room="Kitchen", watts=150, on=True),
    DeviceResponse(id=5, name="Washing Machine", room="Utility", watts=900, on=False),
    DeviceResponse(id=6, name="Dishwasher", room="Kitchen", watts=1200, on=False),
]


def live_power() -> LivePowerStatus:
    return LivePowerStatus(
        grid_draw_kw=round(2.4 + random() * 0.6, 2),
        solar_gen_kw=round(1.8 + random() * 0.9, 2),
        net_usage_kw=round(0.3 + random() * 0.5, 2),
        timestamp=datetime.now(timezone.utc).isoformat(),
    )


def history_points(period: Literal["daily", "weekly", "monthly"]) -> list[EnergyDataPoint]:
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
def health() -> dict[str, str]:
    return {"status": "ok"}


@router.get("/api/v1/dashboard/live", response_model=LivePowerStatus)
def get_live_power() -> LivePowerStatus:
    return live_power()


@router.get("/api/v1/analytics/history", response_model=list[EnergyDataPoint])
def get_history(period: Literal["daily", "weekly", "monthly"] = "daily") -> list[EnergyDataPoint]:
    return history_points(period)


@router.get("/api/v1/devices", response_model=list[DeviceResponse])
def get_devices() -> list[DeviceResponse]:
    return devices


@router.patch("/api/v1/devices/{device_id}", response_model=DeviceResponse)
def update_device(device_id: int, update: DeviceUpdate) -> DeviceResponse:
    for index, device in enumerate(devices):
        if device.id == device_id:
            devices[index] = device.model_copy(update={"on": update.on})
            return devices[index]

    raise HTTPException(status_code=404, detail="Device not found")


@router.get("/api/v1/billing/summary", response_model=BillingSummary)
def get_billing_summary() -> BillingSummary:
    return BillingSummary(
        current_balance=2840,
        projected_bill=3120,
        budget_limit=3000,
        days_remaining=17,
        rate_per_kwh=8.5,
    )
