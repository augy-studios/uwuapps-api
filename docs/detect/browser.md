# Browser Detection

Detects the browser and operating system from the request's `User-Agent` header.

```
GET /api/detect/browser
```

## Parameters

No query parameters required. The detection is based on the `User-Agent` HTTP header sent automatically by browsers and HTTP clients.

## Example

```bash
curl "https://api.uwuapps.com/api/detect/browser" \
  -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
```

### Response

```json
{
  "success": true,
  "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...",
  "browser": {
    "name": "Chrome",
    "version": "120.0.0.0"
  },
  "os": {
    "name": "macOS",
    "version": "10.15.7"
  },
  "isMobile": false
}
```

## Response fields

| Field | Description |
|---|---|
| `userAgent` | The raw User-Agent string received |
| `browser.name` | Detected browser name |
| `browser.version` | Browser version string |
| `os.name` | Operating system name |
| `os.version` | OS version string |
| `isMobile` | `true` if the device appears to be mobile |

## Notes

- Detection is based on pattern matching of the User-Agent string.
- Unknown browsers or OS will return `null` for name/version.
- To test with a specific user agent, pass it explicitly with the `-H` flag in curl.
