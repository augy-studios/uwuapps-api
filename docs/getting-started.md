# Getting Started

## Base URL

```
https://api.uwuapps.com
```

All API endpoints are prefixed with `/api/`. For example:

```
https://api.uwuapps.com/api/calc/age
```

## Making requests

All endpoints accept **HTTP GET** requests with parameters passed as query strings. The only exception is [QR code scanning](scan/qr.md), which accepts a `POST` with a file upload.

```bash
curl "https://api.uwuapps.com/api/calc/age?date=2000-01-15"
```

## Response format

Every response is JSON with a `success` field.

### Success

```json
{
  "success": true,
  "birthDate": "2000-01-15",
  "referenceDate": "2025-01-15",
  "years": 25,
  "months": 0,
  "days": 0
}
```

### Error

```json
{
  "success": false,
  "error": "Query parameter \"date\" is required (e.g. 2000-01-15)."
}
```

### Not found

```json
{
  "success": false,
  "message": "No results found."
}
```

## HTTP status codes

| Code | Meaning |
|---|---|
| `200` | Success |
| `400` | Bad request — missing or invalid parameters |
| `404` | No results found |
| `405` | Method not allowed |
| `422` | Validation failed |
| `500` | Server misconfiguration |
| `502` | Upstream API error |

## CORS

All endpoints are publicly accessible and return the following CORS headers:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

No authentication is required for standard endpoints. Some endpoints (CAPTCHA, images, movies) depend on server-side API keys that are pre-configured.

## Date formats

Where dates are required, use **ISO 8601** format: `YYYY-MM-DD` (e.g. `2000-01-15`).

For date-time values: `YYYY-MM-DDTHH:mm:ss` (e.g. `2025-01-15T14:30:00`).
