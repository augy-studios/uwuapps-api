# Random Word

Returns a random word from the word list, optionally filtered by length.

```
GET /random/word
```

## Parameters

| Parameter | Required | Description |
|---|---|---|
| `length` | No | Word length to filter by (1–50). If omitted, a random length is chosen |

## Example

```bash
curl "https://api.uwuapps.org/random/word"
```

**With a specific length:**

```bash
curl "https://api.uwuapps.org/random/word?length=5"
```

### Response

```json
{
  "success": true,
  "word": "storm",
  "length": 5
}
```

## Errors

| Error | Cause |
|---|---|
| `"length" must be an integer between 1 and 50.` | Length is out of range |
| `No words available with length N.` | No words of that length exist in the word list |
