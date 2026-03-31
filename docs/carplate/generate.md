# Car Plate Generate

Generates a random valid Singapore vehicle registration plate.

```
GET /api/carplate/generate
```

## Parameters

No parameters required.

## Example

```bash
curl "https://api.uwuapps.com/api/carplate/generate"
```

### Response

```json
{
  "success": true,
  "plate": "SHA1234B"
}
```

## Notes

- The generated plate has a valid checksum.
- Plates are randomly generated and do not correspond to any registered vehicle.
