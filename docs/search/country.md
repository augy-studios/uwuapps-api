# Country

Searches for country information by name or code.

```
GET /search/country
```

## Parameters

| Parameter | Required | Description                            |
| --------- | -------- | -------------------------------------- |
| `q`       | Yes      | Country name or ISO code to search for |

## Example

```bash
curl "https://api.uwuapps.org/search/country?q=Singapore"
```

### Response

```json
{
  "success": true,
  "countries": [
    {
      "name": "Singapore",
      "official": "Republic of Singapore",
      "capital": "Singapore",
      "region": "Asia",
      "subregion": "South-Eastern Asia",
      "population": 5850342,
      "area": 710,
      "currencies": { "SGD": { "name": "Singapore dollar", "symbol": "$" } },
      "languages": { "eng": "English", "msa": "Malay", "tam": "Tamil", "zho": "Chinese" },
      "flag": "🇸🇬",
      "cca2": "SG",
      "cca3": "SGP"
    }
  ]
}
```

## Notes

* Search is case-insensitive and supports partial matches.
* Returns `404` if no countries match the query.
