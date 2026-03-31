# Location (Reverse Geocode)

Converts GPS coordinates into a human-readable address. Powered by [OpenCage](https://opencagedata.com).

```
GET /detect/location
```

## Parameters

| Parameter | Required | Description |
|---|---|---|
| `lat` | Yes | Latitude (-90 to 90) |
| `lon` | Yes | Longitude (-180 to 180) |

## Example

```bash
curl "https://api.uwuapps.org/detect/location?lat=1.3521&lon=103.8198"
```

### Response

```json
{
  "success": true,
  "lat": 1.3521,
  "lon": 103.8198,
  "road": "Orchard Road",
  "suburb": "Museum Planning Area",
  "county": "Central",
  "city": "Singapore",
  "state": null,
  "postcode": "238895",
  "country": "Singapore",
  "countryCode": "SG",
  "formatted": "Orchard Road, 238895 Singapore, Singapore"
}
```

## Response fields

| Field | Description |
|---|---|
| `lat` | Latitude as provided |
| `lon` | Longitude as provided |
| `road` | Street name or road |
| `suburb` | Suburb or neighbourhood |
| `county` | County or district |
| `city` | City, town, or village |
| `state` | State or region (if applicable) |
| `postcode` | Postal code |
| `country` | Country name |
| `countryCode` | ISO 3166-1 alpha-2 country code |
| `formatted` | Full formatted address string |

Fields may be `null` if not available for the given coordinates.

## Notes

- Requires a valid `OPENCAGE_API_KEY` configured on the server.
- Returns `404` if no address is found for the given coordinates.
- Returns `500` if the API key is not configured.
- Returns `502` if OpenCage is unreachable.
