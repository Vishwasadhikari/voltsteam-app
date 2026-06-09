from fastapi import APIRouter
from pydantic import BaseModel
import boto3

from rag.chroma_retriever import retrieve

router = APIRouter()

class QARequest(BaseModel):
    question: str

client = boto3.client(
    "bedrock-runtime",
    region_name="eu-north-1"
)

@router.post("/api/v1/qa")
async def qa(request: QARequest):

    chunks = retrieve(
        request.question,
        top_k=3
    )

    context = "\n\n".join(chunks)

    prompt = f"""
Answer only using the context below.

Context:
{context}

Question:
{request.question}

If the answer is not present in the context,
say:
I could not find that information in the knowledge base.
"""

    response = client.converse(
        modelId="amazon.nova-lite-v1:0",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "text": prompt
                    }
                ]
            }
        ]
    )

    answer = response["output"]["message"]["content"][0]["text"]

    return {
        "response": answer
    }