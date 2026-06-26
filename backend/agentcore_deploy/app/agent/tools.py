from strands import tool
from services.s3_device_service import (
    load_devices,
    save_devices
)


@tool
def get_device_status_by_name(device_name: str):

    devices = load_devices()

    for device in devices:

        if device["name"].lower() == device_name.lower():

            return {
                "device_id": device["id"],
                "device_name": device["name"],
                "state": "ON" if device["on"] else "OFF"
            }

    return {
        "error": f"{device_name} not found"
    }


@tool
def toggle_device_by_name(
    device_name: str,
    state: str
):
    print("=" * 50)
    print(f"TOOL CALLED -> {device_name} -> {state}")
    print("=" * 50)
    print(
        f"TOOL CALLED -> {device_name} -> {state}"
    )

    devices = load_devices()

    for device in devices:

        if device["name"].lower() == device_name.lower():

            device["on"] = (
                state.upper() == "ON"
            )

            save_devices(devices)

            print(
                f"SAVED -> {device['name']} -> {'ON' if device['on'] else 'OFF'}"
            )

            return {
                "device_id": device["id"],
                "device_name": device["name"],
                "state": "ON" if device["on"] else "OFF"
            }

    return {
        "error": f"{device_name} not found"
    }


@tool
def get_all_devices():

    devices = load_devices()

    print("GET_ALL_DEVICES")
    print(devices)

    return devices

    return load_devices()
@tool
def update_multiple_devices(
    updates: list[dict]
):

    print("=" * 50)
    print("MULTI DEVICE TOOL CALLED")
    print(updates)
    print("=" * 50)

    devices = load_devices()
    devices = load_devices()

    updated = []

    for update in updates:

        device_name = update["device_name"]
        state = update["state"]

        for device in devices:

            if device["name"].lower() == device_name.lower():

                device["on"] = (
                    state.upper() == "ON"
                )

                updated.append(
                    {
                        "device_id": device["id"],
                        "device_name": device["name"],
                        "state": "ON" if device["on"] else "OFF"
                    }
                )

                print(
                    f"SAVED -> {device['name']} -> {'ON' if device['on'] else 'OFF'}"
                )

                break

    save_devices(devices)

    return {
        "updated_count": len(updated),
        "devices": updated
    }

@tool
def get_peak_consumers():

    devices = load_devices()

    sorted_devices = sorted(
        devices,
        key=lambda d: d["watts"],
        reverse=True
    )

    return sorted_devices[:3]


@tool
def analyze_energy_usage():

    devices = load_devices()

    active_devices = [
        d for d in devices
        if d["on"]
    ]

    total_watts = sum(
        d["watts"]
        for d in active_devices
    )

    highest = None

    if active_devices:

        highest = max(
            active_devices,
            key=lambda d: d["watts"]
        )

    return {
        "active_devices": len(active_devices),
        "total_watts": total_watts,
        "highest_consumer":
            highest["name"]
            if highest
            else None,
        "highest_watts":
            highest["watts"]
            if highest
            else 0
    }


@tool
def suggest_energy_savings(device_name: str):

    tips = {
        "Air Conditioner":
            "Increase thermostat by 2°C and clean filters regularly.",

        "Water Heater":
            "Turn off when not needed and use a timer.",

        "EV Charger":
            "Charge during off-peak hours to reduce costs.",

        "Washing Machine":
            "Run full loads and use eco mode.",

        "Dishwasher":
            "Run only when fully loaded.",

        "Refrigerator":
            "Keep door closed and maintain proper temperature."
    }

    return tips.get(
        device_name,
        "Turn off the device when not in use."
    )