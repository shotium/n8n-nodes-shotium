# n8n-nodes-shotium

This is an n8n community node. It lets you use [Shotium](https://shotium.com) in your n8n workflows.

Shotium is a screenshot and OG image rendering API: turn any URL into a PNG/JPEG/WebP screenshot, or generate 1200×630 Open Graph images from typed templates — rendered by a real browser.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

[Installation](#installation)
[Operations](#operations)
[Credentials](#credentials)
[Compatibility](#compatibility)
[Usage](#usage)
[Resources](#resources)
[Version history](#version-history)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

Package name: `n8n-nodes-shotium`

## Operations

- **Take Screenshot** — render any public URL to an image
  - Formats: PNG, JPEG, WebP
  - Viewport control (width/height), full-page capture, quality for lossy formats
  - Identical parameter sets are cached for 24 hours by the API
- **Generate OG Image** — render a 1200×630 social card from one of five templates
  - Templates: Blog, Product, Podcast, Event, Minimal — each with typed fields
  - Formats: PNG, JPEG

Both operations output the image as **binary data** (default field: `data`), ready to pipe into any downstream node — upload to S3, attach to email, send via Telegram, write to disk, and so on.

## Credentials

1. Sign in at [shotium.com/account](https://shotium.com/account) (GitHub sign-in, 100 free render credits — no credit card).
2. Create an API key. The key (`sk_live_…`) is shown **once**.
3. In n8n, create a **Shotium API** credential and paste the key.

Note: there is no zero-cost validation endpoint — the credential is verified on first execution. A render is billed only when an image is successfully returned; failed renders are never billed.

## Compatibility

Requires n8n version 1.0 or above. Built and tested against the current n8n release.

## Usage

Typical patterns:

- **Nightly site archive**: Schedule Trigger → Shotium (Take Screenshot, full page) → S3/Drive upload
- **OG images that follow your data**: new blog post webhook → Shotium (Generate OG Image, Blog template with expressions) → upload to your CDN
- **Visual monitoring**: Cron → Screenshot of a competitor page → image diff → alert

Rate limit is 60 requests/minute per API key. When quota and credits run out the API returns `429 quota_exceeded` — nothing auto-charges.

For build-time or signed-URL embedding use cases (OG images in `<meta>` tags with edge caching), see the [Shotium docs](https://shotium.com/docs) — those flows don't need n8n at all.

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Shotium API reference](https://shotium.com/docs)
- [OG image templates & parameters](https://shotium.com/og-templates)
- [Service status](https://status.shotium.com)
- [Changelog](https://shotium.com/changelog)

## Version history

- **0.1.0** — Initial release: Take Screenshot and Generate OG Image operations with binary output.
