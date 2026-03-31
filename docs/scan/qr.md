# QR Code Scanner

Scans a QR code from an uploaded image and returns the decoded content.

```
POST /api/scan/qr
```

## Request

This endpoint accepts a `multipart/form-data` POST request with an image file.

| Field | Required | Description |
|---|---|---|
| `file` | Yes | Image file containing the QR code (JPEG, PNG, GIF, etc.) |

## Example

```bash
curl -X POST "https://api.uwuapps.com/api/scan/qr" \
  -F "file=@qrcode.png"
```

### Response (success)

```json
{
  "success": true,
  "data": "https://uwuapps.com"
}
```

### Response (no QR code found)

```json
{
  "success": false,
  "error": "No QR code found in the image."
}
```

## Notes

- The image is processed by [QR Server](https://api.qrserver.com) — it is forwarded externally.
- Supported formats include JPEG, PNG, GIF, BMP, and TIFF.
- Returns `502` if the QR Server API is unreachable.
- This is the only `POST` endpoint in the API. All other endpoints use `GET`.

## Generating QR codes

To generate a QR code image, see [QR Code Generator](../generate/qr-code.md).
