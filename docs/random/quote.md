# Quote

Returns a random inspirational or famous quote.

```
GET /random/quote
```

## Parameters

No parameters required.

## Example

```bash
curl "https://api.uwuapps.org/random/quote"
```

### Response

```json
{
  "success": true,
  "quote": "The only way to do great work is to love what you do.",
  "author": "Steve Jobs"
}
```

## Response fields

| Field    | Description             |
| -------- | ----------------------- |
| `quote`  | The quote text          |
| `author` | The author of the quote |
