from bedrock_agentcore import BedrockAgentCoreApp

from app.agent.voltstream_agent import run_agent

app = BedrockAgentCoreApp()


@app.entrypoint
async def invoke(payload):

    message = payload.get("prompt", "")
    history = payload.get("history", [])

    result = run_agent(
        message=message,
        history=history
    )

    return result


if __name__ == "__main__":
    app.run()