# Rock Paper Scissors

Play rock-paper-scissors against the computer.

```
GET /random/rps
```

## Parameters

| Parameter | Required | Description                                 |
| --------- | -------- | ------------------------------------------- |
| `choice`  | Yes      | Your choice: `rock`, `paper`, or `scissors` |

## Example

```bash
curl "https://api.uwuapps.org/random/rps?choice=rock"
```

### Response

```json
{
  "success": true,
  "userChoice": "rock",
  "computerChoice": "scissors",
  "result": "win"
}
```

## Response fields

| Field            | Description                           |
| ---------------- | ------------------------------------- |
| `userChoice`     | Your choice                           |
| `computerChoice` | The computer's randomly chosen option |
| `result`         | Outcome: `win`, `lose`, or `draw`     |
