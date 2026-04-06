# PhishRaksha

PhishRaksha is a premium-style phishing detection dashboard built with Next.js, Tailwind CSS, and a small server-side proxy route for the live analyzer webhook.

## Features

- Single-page phishing analyzer UI with dark cybersecurity styling
- Basic client and server validation for email analysis requests
- Same-origin `POST /api/analyze` route that forwards requests to the live webhook
- Dynamic risk dashboard for risk score, confidence, URL telemetry, reasons, and suspicious indicators
- Downloadable JSON report with the submitted payload and analysis response

## Environment

Create a `.env.local` file from `.env.example` if you want to override the upstream webhook:

```bash
cp .env.example .env.local
```

Default value:

```bash
PHISHRAKSHA_API_URL=https://api.phishraksha.tech/webhook/check
```

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production Checks

```bash
npm run lint
npm run build
```
