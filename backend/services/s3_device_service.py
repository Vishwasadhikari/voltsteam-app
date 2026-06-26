import boto3
import json

BUCKET = "voltstream-device-state"
KEY = "devices.json"

s3 = boto3.client(
    "s3",
    region_name="eu-north-1"
)

def load_devices():

    response = s3.get_object(
        Bucket=BUCKET,
        Key=KEY
    )

    return json.loads(
        response["Body"].read()
    )


def save_devices(devices):

    s3.put_object(
        Bucket=BUCKET,
        Key=KEY,
        Body=json.dumps(
            devices,
            indent=2
        ),
        ContentType="application/json"
    )