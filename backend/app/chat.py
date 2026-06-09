from fastapi import APIRouter
from pydantic import BaseModel
import boto3

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    history: list = []

client = boto3.client(
    "bedrock-runtime",
    region_name="eu-north-1"
)

@router.post("/api/v1/chat")
async def chat(request: ChatRequest):

    messages = request.history.copy()

    messages.append(
        {
            "role": "user",
            "content": [
                {
                    "text": request.message
                }
            ]
        }
    )

    response = client.converse(
        modelId="amazon.nova-lite-v1:0",
        messages=messages
    )

    answer = response["output"]["message"]["content"][0]["text"]

    assistant_message = {
        "role": "assistant",
        "content": [
            {
                "text": answer
            }
        ]
    }

    messages.append(assistant_message)

    return {
        "response": answer,
        "history": messages
    }