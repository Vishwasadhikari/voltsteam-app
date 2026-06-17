import re
from strands import Agent
from strands.models import BedrockModel

from app.agent.tools import (
    get_device_status_by_name,
    toggle_device_by_name
)

model = BedrockModel(
    model_id="amazon.nova-lite-v1:0",
    region_name="eu-north-1"
)

agent = Agent(
    model=model,
    tools=[
        get_device_status_by_name,
        toggle_device_by_name
    ],
    system_prompt="""
You are VoltStream Device Agent.

You manage smart home devices.

Available devices:
- Air Conditioner
- Water Heater
- EV Charger
- Refrigerator
- Washing Machine
- Dishwasher

Always use the appropriate tool.

IMPORTANT:
When a tool returns a result, respond ONLY with the final result.
Do not explain your reasoning.
Do not mention tools.
Do not say "I will inform the user".
Do not add extra sentences.

Examples:

User: Turn on water heater
Response: Water Heater has been turned ON.

User: Turn off dishwasher
Response: Dishwasher has been turned OFF.

User: What is the status of EV Charger?
Response: EV Charger is currently ON.
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