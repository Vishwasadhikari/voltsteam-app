from strands import tool
from app.device_store import devices


@tool
def get_device_status(device_id: int):

    for device in devices:

        if device.id == device_id:

            return {
                "device_id": device.id,
                "device_name": device.name,
                "state": "ON" if device.on else "OFF"
            }

    return {
        "error": "Device not found"
    }


@tool
def toggle_device(
    device_id: int,
    state: str
):

    for device in devices:

        if device.id == device_id:

            device.on = state.upper() == "ON"

            return {
                "device_id": device.id,
                "device_name": device.name,
                "state": "ON" if device.on else "OFF"
            }

    return {
        "error": "Device not found"
    }


@tool
def get_device_status_by_name(device_name: str):

    for device in devices:

        if device.name.lower() == device_name.lower():

            return {
                "device_id": device.id,
                "device_name": device.name,
                "state": "ON" if device.on else "OFF"
            }

    return {
        "error": f"{device_name} not found"
    }


@tool
def toggle_device_by_name(
    device_name: str,
    state: str
):

    for device in devices:

        if device.name.lower() == device_name.lower():

            device.on = state.upper() == "ON"

            return {
                "device_id": device.id,
                "device_name": device.name,
                "state": "ON" if device.on else "OFF"
            }

    return {
        "error": f"{device_name} not found"
    }