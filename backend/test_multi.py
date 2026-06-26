from app.agent.voltstream_agent import run_agent

result = run_agent(
    "turn on ev charger and turn off dishwasher and analyze which consumes more energy and how to reduceenergy consumption."
)

print(result)