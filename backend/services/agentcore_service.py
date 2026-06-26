import boto3
import json

client = boto3.client(
    "bedrock-agentcore",
    region_name="eu-north-1"
)

AGENT_ARN = (
    "arn:aws:bedrock-agentcore:eu-north-1:"
    "819211779431:runtime/voltstreamagent-LjVRTXEkZc"
)


def invoke_agentcore(message, history=None):

    payload = {
        "prompt": message,
        "history": history or []
    }

    response = client.invoke_agent_runtime(
        agentRuntimeArn=AGENT_ARN,
        payload=json.dumps(payload)
    )

    body = response["response"].read()
    decoded = body.decode("utf-8")

    try:
        result = json.loads(decoded)
        answer = result.get(
            "response",
            decoded
        )
    except Exception:
        answer = decoded

    return {
        "response": answer,
        "session_id": response.get(
            "runtimeSessionId"
        ),
        "request_id": response[
            "ResponseMetadata"
        ]["RequestId"]
    }