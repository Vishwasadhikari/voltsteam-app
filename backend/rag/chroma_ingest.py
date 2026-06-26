__import__("pysqlite3")
import sys

sys.modules["sqlite3"] = sys.modules.pop("pysqlite3")
from pypdf import PdfReader
import boto3
import json
import chromadb

PDF_PATH = "rag/docs/energy_merged.pdf"

BEDROCK_REGION = "eu-north-1"
EMBEDDING_MODEL = "amazon.titan-embed-text-v2:0"

bedrock = boto3.client(
    service_name="bedrock-runtime",
    region_name=BEDROCK_REGION
)

client = chromadb.PersistentClient(
    path="chroma_db"
)

collection = client.get_or_create_collection(
    name="voltstream"
)


def extract_text(pdf_path):
    text = ""

    reader = PdfReader(pdf_path)

    for page in reader.pages:
        page_text = page.extract_text()

        if page_text:
            text += page_text + "\n"

    return text


def chunk_text(text, chunk_size=1000):
    chunks = []

    for i in range(0, len(text), chunk_size):
        chunks.append(text[i:i + chunk_size])

    return chunks


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


print("Reading PDF...")

text = extract_text(PDF_PATH)

print("Creating chunks...")

chunks = chunk_text(text)

print(f"Total chunks: {len(chunks)}")

for idx, chunk in enumerate(chunks):

    print(f"Embedding chunk {idx+1}/{len(chunks)}")

    embedding = get_embedding(chunk)

    collection.add(
        ids=[str(idx)],
        embeddings=[embedding],
        documents=[chunk]
    )

print("ChromaDB created successfully!")