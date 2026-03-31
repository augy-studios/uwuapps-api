# Search Images

Searches for photos by keyword. Powered by [Pexels](https://www.pexels.com).

```
GET /api/search/image
```

## Parameters

| Parameter | Required | Default | Description |
|---|---|---|---|
| `q` | Yes | — | Search query |
| `page` | No | `1` | Page number for pagination |
| `perPage` | No | `10` | Number of results per page |

## Example

```bash
curl "https://api.uwuapps.com/api/search/image?q=sunset&perPage=3"
```

### Response

```json
{
  "success": true,
  "query": "sunset",
  "totalResults": 8000,
  "photos": [
    {
      "id": 1234,
      "photographer": "John Doe",
      "url": "https://www.pexels.com/photo/1234",
      "src": {
        "original": "https://images.pexels.com/photos/1234/...",
        "large": "...",
        "medium": "...",
        "small": "...",
        "thumbnail": "..."
      },
      "alt": "Orange sunset over the ocean"
    }
  ]
}
```

## Notes

- Requires a valid `PEXELS_API_KEY` configured on the server.
- Returns `500` if the API key is not configured.
- Returns `404` if no images match the query.
- Returns `502` if the Pexels API is unreachable.
