# QR Code

Generates a QR code URL for any text or URL.

```
GET /generate/qr
```

## Parameters

| Parameter | Required | Default | Description                                   |
| --------- | -------- | ------- | --------------------------------------------- |
| `data`    | Yes      | —       | The text or URL to encode in the QR code      |
| `size`    | No       | `200`   | Size of the QR code image in pixels (10–1000) |
| `format`  | No       | `png`   | Image format: `png`, `svg`, or `eps`          |

## Example

```bash
curl "https://api.uwuapps.org/generate/qr?data=https://uwuapps.com&size=300&format=png"
```

### Response

```json
{
  "success": true,
  "data": "https://uwuapps.com",
  "url": "https://api.qrserver.com/v1/create-qr-code/?size=300x300&format=png&data=https%3A%2F%2Fuwuapps.com",
  "size": 300,
  "format": "png"
}
```

## Response fields

| Field    | Description                               |
| -------- | ----------------------------------------- |
| `data`   | The encoded content                       |
| `url`    | Direct URL to the generated QR code image |
| `size`   | Image size in pixels                      |
| `format` | Image format used                         |

## Notes

* The returned `url` links directly to the QR code image — you can use it in an `<img>` tag or download it directly.
* For `svg` and `eps`, the same URL pattern applies.
* To scan a QR code image, see [Scan QR Code](../scan/qr.md).
