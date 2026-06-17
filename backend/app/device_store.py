from pydantic import BaseModel


class DeviceResponse(BaseModel):
    id: int
    name: str
    room: str
    watts: int
    on: bool


devices = [
    DeviceResponse(
        id=1,
        name="Air Conditioner",
        room="Living Room",
        watts=1500,
        on=True
    ),
    DeviceResponse(
        id=2,
        name="Water Heater",
        room="Bathroom",
        watts=2000,
        on=False
    ),
    DeviceResponse(
        id=3,
        name="EV Charger",
        room="Garage",
        watts=7200,
        on=True
    ),
    DeviceResponse(
        id=4,
        name="Refrigerator",
        room="Kitchen",
        watts=150,
        on=True
    ),
    DeviceResponse(
        id=5,
        name="Washing Machine",
        room="Utility",
        watts=900,
        on=False
    ),
    DeviceResponse(
        id=6,
        name="Dishwasher",
        room="Kitchen",
        watts=1200,
        on=False
    ),
]