from rag.chroma_retriever import retrieve

results = retrieve(
    "Which device consumes the most power?"
)

for i, chunk in enumerate(results):
    print("\n")
    print("=" * 50)
    print(f"Chunk {i+1}")
    print("=" * 50)
    print(chunk)