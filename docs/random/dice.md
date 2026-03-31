# Dice Roll

Rolls one or more dice and returns the individual results and total.

```
GET /random/dice
```

## Parameters

You can specify dice using either the shorthand `type` notation or separate `dice` and `sides` parameters.

| Parameter | Required | Default | Description                             |
| --------- | -------- | ------- | --------------------------------------- |
| `type`    | No       | —       | Shorthand notation (e.g. `2d6`, `4d20`) |
| `dice`    | No       | `2`     | Number of dice to roll (1–20)           |
| `sides`   | No       | `6`     | Number of sides per die (2–1000)        |

If `type` is provided, it takes priority over `dice` and `sides`.

## Example

**Using shorthand:**

```bash
curl "https://api.uwuapps.org/random/dice?type=2d6"
```

**Using separate parameters:**

```bash
curl "https://api.uwuapps.org/random/dice?dice=2&sides=6"
```

### Response

```json
{
  "success": true,
  "type": "2d6",
  "dice": 2,
  "sides": 6,
  "results": [4, 2],
  "total": 6
}
```

## Response fields

| Field     | Description                       |
| --------- | --------------------------------- |
| `type`    | Dice notation string (e.g. `2d6`) |
| `dice`    | Number of dice rolled             |
| `sides`   | Number of sides per die           |
| `results` | Array of individual roll results  |
| `total`   | Sum of all roll results           |
