import re
from strands import Agent
from strands.models import BedrockModel

from app.agent.tools import (
    get_device_status_by_name,
    toggle_device_by_name,
    get_all_devices,
    get_peak_consumers,
    analyze_energy_usage,
    suggest_energy_savings
)

model = BedrockModel(
    model_id="amazon.nova-lite-v1:0",
    region_name="eu-north-1"
)

agent = Agent(
    model=model,
    tools=[
        get_device_status_by_name,
        toggle_device_by_name,
        get_all_devices,
        get_peak_consumers,
        analyze_energy_usage,
        suggest_energy_savings
    ],
    system_prompt="""
You are VoltStream Smart Energy Agent.

Capabilities:
- Control smart devices.
- Check device status.
- Analyze energy usage.
- Identify high-consumption devices.
- Provide energy-saving recommendations.

Available devices:
- Air Conditioner
- Water Heater
- EV Charger
- Refrigerator
- Washing Machine
- Dishwasher

Rules:
- Use tools whenever relevant information is required.
- Never guess device states or energy data.
- Do not explain reasoning or mention tools.
- Return only the final answer.
- Device actions/status: keep responses under 20 words.
- Energy advice: keep responses under 70 words and make them actionable.


"""
)



def run_agent(message: str):
    response = agent(message)

    clean_response = re.sub(
        r"<[^>]+>",
        "",
        str(response)
    ).strip()

    return {
        "response": clean_response
    }