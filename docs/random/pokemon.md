# Pokémon

Returns data for a random (or specific) Pokémon. Powered by [PokéAPI](https://pokeapi.co).

```
GET /random/pokemon
```

## Parameters

| Parameter | Required | Description                                                   |
| --------- | -------- | ------------------------------------------------------------- |
| `id`      | No       | Pokémon ID (1–1025). If omitted, a random Pokémon is returned |

## Example

```bash
curl "https://api.uwuapps.org/random/pokemon"
```

### Response

```json
{
  "success": true,
  "id": 25,
  "name": "pikachu",
  "types": ["electric"],
  "height": 4,
  "weight": 60,
  "sprite": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
  "stats": {
    "hp": 35,
    "attack": 55,
    "defense": 40,
    "specialAttack": 50,
    "specialDefense": 50,
    "speed": 90
  }
}
```

## Notes

* Returns `502` if PokéAPI is unreachable.
