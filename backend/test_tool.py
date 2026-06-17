from app.agent.tools import (
    get_device_status,
    toggle_device
)

print("\nBefore:")
print(get_device_status(6))

print("\nTurning OFF:")
print(toggle_device(6, "OFF"))

print("\nAfter:")
print(get_device_status(6))