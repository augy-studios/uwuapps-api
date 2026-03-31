# Introduction

Welcome to the **UwU Apps API** documentation. This is a free, serverless REST API providing a wide range of utility services — from calculations and conversions to random content, Singapore-specific data, and more.

## What's available

| Category                          | Description                                                                |
| --------------------------------- | -------------------------------------------------------------------------- |
| [Calc](calc/age.md)               | Age, BMI, days between dates, interest, aspect ratio                       |
| [Convert](convert/temperature.md) | Temperature, weight, base numbers, morse code, currency, ciphers, encoding |
| [Check](check/password.md)        | Password strength, color contrast (WCAG)                                   |
| [Generate](generate/password.md)  | Passwords, QR codes, gradients                                             |
| [NRIC](nric/validate.md)          | Validate, generate, and reconstruct Singapore NRICs                        |
| [UEN](uen/validate.md)            | Validate and generate Singapore UENs                                       |
| [Car Plate](carplate/validate.md) | Validate and generate Singapore car plates                                 |
| [Predict](predict/gender.md)      | Predict gender, age, and nationality from a name                           |
| [Random](random/joke.md)          | Jokes, Pokémon, images, quotes, dice, coin flips, and more                 |
| [Search](search/movie.md)         | Movies, recipes, cocktails, countries, words, images                       |
| [SG](sg/bus-arrivals.md)          | Singapore bus arrivals, bus stops, and air quality (PSI)                   |
| [Detect](detect/browser.md)       | Browser and OS detection                                                   |
| [Scan](scan/qr.md)                | QR code scanning                                                           |
| [CAPTCHA](captcha.md)             | CAPTCHA generation and verification                                        |

## Quick start

All endpoints are HTTP `GET` requests (except QR scanning which is `POST`). Parameters are passed as query strings.

```
GET https://api.uwuapps.org/calc/age?date=2000-01-15
```

See [Getting Started](getting-started.md) for full details on base URLs, response formats, and error handling.
