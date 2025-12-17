import requests
from urllib.parse import urlencode

from Thunder.utils.token_store import resolve_token, delete_token


def handler(request):
    token = request.args.get("token")
    if not token:
        return {
            "statusCode": 403,
            "body": "Missing token"
        }

    short_url = resolve_token(token)
    if not short_url:
        return {
            "statusCode": 403,
            "body": "Token expired or invalid"
        }

    # One-time token (optional)
    delete_token(token)

    # Follow redirects safely
    try:
        r = requests.get(short_url, allow_redirects=True, timeout=10)
        final_url = r.url
    except Exception:
        return {
            "statusCode": 500,
            "body": "Redirect failed"
        }

    return {
        "statusCode": 302,
        "headers": {
            "Location": final_url
        }
    }
