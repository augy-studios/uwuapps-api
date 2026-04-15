# No

Returns a random, creative way to say no. Powered by [no-as-a-service](https://github.com/hotheadhacker/no-as-a-service).

```
GET /no
```

No parameters required.

## Example

```bash
curl "https://api.uwuapps.org/no"
```

### Response

```json
{
  "success": true,
  "reason": "I have to trust my gut — and it's gently suggesting a no."
}
```

## Notes

* Returns a randomly selected reason from a pool of 1,000+ entries.
* Returns `502` if the database is unreachable.
