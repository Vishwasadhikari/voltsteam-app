import boto3

client = boto3.client(
    "bedrock-runtime",
    region_name="eu-north-1"
)

response = client.converse(
    modelId="amazon.nova-lite-v1:0",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "text": "What is solar energy?"
                }
            ]
        }
    ]
)

print(response)