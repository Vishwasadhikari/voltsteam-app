__import__("pysqlite3")
import sys

sys.modules["sqlite3"] = sys.modules.pop("pysqlite3")
print("pysqlite3 loaded..")

import os
import shutil
import chromadb
import boto3
import json

BEDROCK_REGION = "eu-north-1"
EMBEDDING_MODEL = "amazon.titan-embed-text-v2:0"

bedrock = boto3.client(
    "bedrock-runtime",
    region_name=BEDROCK_REGION
)

# -------------------------------
# Copy ChromaDB to Lambda writable storage
# -------------------------------
SOURCE_DB = "/var/task/chroma_db"
TARGET_DB = "/tmp/chroma_db"

if not os.path.exists(TARGET_DB):
    shutil.copytree(SOURCE_DB, TARGET_DB)

client = chromadb.PersistentClient(
    path=TARGET_DB
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