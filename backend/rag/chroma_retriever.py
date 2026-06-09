import chromadb
import boto3
import json

BEDROCK_REGION = "eu-north-1"
EMBEDDING_MODEL = "amazon.titan-embed-text-v2:0"

bedrock = boto3.client(
    "bedrock-runtime",
    region_name=BEDROCK_REGION
)

client = chromadb.PersistentClient(
    path="chroma_db"
)

collection = client.get_collection(
    name="voltstream"
)


def get_embedding(text):

    body = {
        "inputText": text
    }

    response = bedrock.invoke_model(
        modelId=EMBEDDING_MODEL,
        body=json.dumps(body)
    )

    result = json.loads(
        response["body"].read()
    )

    return result["embedding"]


def retrieve(query, top_k=3):

    query_embedding = get_embedding(query)

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k
    )

    return results["documents"][0]