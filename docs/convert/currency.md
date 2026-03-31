# Currency

Converts an amount from one currency to another using live exchange rates.

```
GET /convert/currency
```

## Parameters

| Parameter | Required | Description                              |
| --------- | -------- | ---------------------------------------- |
| `amount`  | Yes      | The amount to convert (numeric)          |
| `from`    | Yes      | Source currency code (e.g. `SGD`, `USD`) |
| `to`      | Yes      | Target currency code (e.g. `MYR`, `EUR`) |

Currency codes follow **ISO 4217** (e.g. `USD`, `SGD`, `EUR`, `JPY`, `GBP`).

## Example

```bash
curl "https://api.uwuapps.org/convert/currency?amount=100&from=SGD&to=USD"
```

### Response

```json
{
  "success": true,
  "amount": 100,
  "from": "SGD",
  "to": "USD",
  "rate": 0.74,
  "result": 74,
  "date": "2025-01-15"
}
```

## Response fields

| Field    | Description                    |
| -------- | ------------------------------ |
| `amount` | The original amount            |
| `from`   | Source currency code           |
| `to`     | Target currency code           |
| `rate`   | Exchange rate used             |
| `result` | Converted amount               |
| `date`   | Date of the exchange rate data |

## Notes

* Exchange rates are fetched from the open-source `@fawazahmed0/currency-api` CDN. Rates update daily.
* If `from` and `to` are the same, the result equals the original amount with a rate of `1`.
* Returns a `502` error if the upstream rates API is unavailable.
