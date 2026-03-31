# Pick

Randomly selects one or more items from a provided list.

```
GET /api/random/pick
```

## Parameters

| Parameter | Required | Default | Description |
|---|---|---|---|
| `choices` | Yes | — | Comma-separated list of items to choose from |
| `count` | No | `1` | Number of items to pick (must not exceed the number of choices) |

## Example

```bash
curl "https://api.uwuapps.com/api/random/pick?choices=Alice,Bob,Charlie,Diana&count=2"
```

### Response

```json
{
  "success": true,
  "picked": ["Charlie", "Alice"],
  "count": 2,
  "from": 4
}
```

## Response fields

| Field | Description |
|---|---|
| `picked` | Array of randomly selected items |
| `count` | Number of items picked |
| `from` | Total number of items in the provided list |

## Notes

- Items are selected without replacement (no duplicates in a single response).
- Leading and trailing whitespace is trimmed from each item.

## Errors

| Error | Cause |
|---|---|
| `Query parameter "choices" is required` | `choices` was not provided |
| `"count" cannot exceed the number of choices` | Requested more items than available |
