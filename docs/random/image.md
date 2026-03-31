# Image

Returns a curated random photo from [Pexels](https://www.pexels.com).

```
GET /random/image
```

## Parameters

| Parameter | Required | Default | Description                         |
| --------- | -------- | ------- | ----------------------------------- |
| `page`    | No       | `1`     | Page number for pagination          |
| `perPage` | No       | `1`     | Number of images to return per page |

## Example

```bash
curl "https://api.uwuapps.org/random/image"
```

### Response

```json
{
  "success": true,
  "photos": [
    {
      "id": 12345,
      "photographer": "Jane Doe",
      "url": "https://www.pexels.com/photo/12345",
      "src": {
        "original": "https://images.pexels.com/photos/12345/pexels-photo-12345.jpeg",
        "large": "...",
        "medium": "...",
        "small": "...",
        "thumbnail": "..."
      },
      "alt": "A scenic landscape"
    }
  ]
}
```

## Notes

* Requires a valid `PEXELS_API_KEY` configured on the server.
* Returns `500` if the API key is not configured.
* Returns `502` if the Pexels API is unreachable.
