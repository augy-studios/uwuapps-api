# UwU Apps API

A free, public, serverless REST API providing a wide range of utility services — from calculations and conversions to random content, Singapore-specific data, and more.

**Base URL:** `https://api.uwuapps.org`

## Quick Start

All endpoints are HTTP `GET` requests. Parameters are passed as query strings.

```bash
curl "https://api.uwuapps.org/calc/age?date=2000-01-15"
```

All responses are JSON:

```json
{
  "success": true,
  "age": 25
}
```

## API Categories

| Category    | Endpoints                                                          |
| ----------- | ------------------------------------------------------------------ |
| Calc        | Age, BMI, days between dates, simple interest, aspect ratio        |
| Convert     | Temperature, weight, number base, morse code, currency, ciphers, encoding |
| Check       | Password strength, color contrast (WCAG)                           |
| Generate    | Passwords, QR codes, gradients                                     |
| NRIC        | Validate, generate, and reconstruct Singapore NRICs                |
| UEN         | Validate and generate Singapore UENs                               |
| Car Plate   | Validate and generate Singapore car plates                         |
| Predict     | Gender, age, and nationality from a name                           |
| Random      | Jokes, Pokémon, images, quotes, dice, coin flips, words, and more  |
| Search      | Movies, recipes, cocktails, countries, word definitions, images    |
| SG          | Singapore bus arrivals, bus stops, and air quality (PSI)           |
| Detect      | Browser/OS detection, reverse geocoding                            |
| Scan        | QR code scanning                                                   |
| Translate   | Text translation and language detection                            |
| Weather     | Current weather, 7-day forecast, precipitation nowcast             |
| Wordle      | Get and validate words for Wordle-style games                      |
| CAPTCHA     | CAPTCHA generation and verification                                |

## Documentation

Full documentation is available in the [`docs/`](docs/) folder.

## Stack

- **Runtime:** Node.js
- **Hosting:** Vercel (serverless, Singapore region)

## License

MIT
