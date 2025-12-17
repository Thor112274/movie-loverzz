import os
import time
import requests
from pymongo import MongoClient

client = MongoClient(os.environ["DATABASE_URL"])
db = client.get_default_database()
short_col = db.shortener_tokens_col


def handler(request):
    token = request.args.get("token")
    if not token:
        return {"statusCode": 403, "body": "Missing token"}

    data = short_col.find_one({"token": token})
    if not data:
        return {"statusCode": 403, "body": "Invalid token"}

    if time.time() > data["expires_at"]:
        short_col.delete_one({"token": token})
        return {"statusCode": 403, "body": "Token expired"}

    if data.get("used"):
        return {"statusCode": 403, "body": "Token already used"}

    # mark used (one-time)
    short_col.update_one(
        {"token": token},
        {"$set": {"used": True}}
    )

    try:
        r = requests.get(data["url"], allow_redirects=True, timeout=10)
        final_url = r.url
    except Exception:
        return {"statusCode": 500, "body": "Redirect failed"}

    return {
        "statusCode": 302,
        "headers": {"Location": final_url}
    }
