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


# @router.post("/api/v1/chat")
# async def chat(request: ChatRequest):

#     # Keep only recent conversation history
#     messages = request.history[-6:].copy()

#     messages.append(
#         {
#             "role": "user",
#             "content": [
#                 {
#                     "text": request.message
#                 }
#             ]
#         }
#     )

#     response = client.converse(
#         modelId="amazon.nova-lite-v1:0",

#         system=[
#             {
#                 "text": (
#                     "You are VoltStream AI Assistant. "
#                     "Provide concise, helpful responses. "
#                     "Keep answers under 100 words unless explicitly asked for details."
#                 )
#             }
#         ],

#         messages=messages,

#         inferenceConfig={
#             "maxTokens": 300,
#             "temperature": 0.7
#         }
#     )

#     answer = response["output"]["message"]["content"][0]["text"]

#     assistant_message = {
#         "role": "assistant",
#         "content": [
#             {
#                 "text": answer
#             }
#         ]
#     }

#     messages.append(assistant_message)

#     return {
#         "response": answer,
#         "history": messages
#     }

@router.post("/api/v1/chat")
async def chat(request: ChatRequest):

    try:

        messages = request.history[-6:].copy()

        messages.append({
            "role": "user",
            "content": [
                {
                    "text": request.message
                }
            ]
        })

        response = client.converse(
            modelId="amazon.nova-lite-v1:0",
            system=[
                {
                    "text": "You are VoltStream AI Assistant."
                }
            ],
            messages=messages,
            inferenceConfig={
                "maxTokens":300,
                "temperature":0.7
            }
        )

        answer = response["output"]["message"]["content"][0]["text"]

        return {
            "response": answer,
            "history": messages
        }

    except Exception as e:
        import traceback
        traceback.print_exc()

        return {
            "error": str(e)
        }