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
- **Generate Signed URL** — build an HMAC-signed OG image link safe to embed in public HTML
  - Computed locally in the node: no API call, no render billed
  - The image renders on first request and updates whenever the signed parameters change; CDN edge hits are free
  - Requires the Signing Secret and UID fields in your credential

The two render operations output the image as **binary data** (default field: `data`), ready to pipe into any downstream node — upload to S3, attach to email, send via Telegram, write to disk, and so on. Generate Signed URL outputs JSON with a `url` field.

## Credentials

1. Sign in at [shotium.com/account](https://shotium.com/account) (GitHub sign-in, 100 free render credits — no credit card).
2. Create an API key. The key (`sk_live_…`), your signing secret and your UID are shown **once**, together.
3. In n8n, create a **Shotium API** credential and paste the key. The signing secret and UID are only needed for the Generate Signed URL operation — leave them empty otherwise.

Note: there is no zero-cost validation endpoint — the credential is verified on first execution. A render is billed only when an image is successfully returned; failed renders are never billed.

## Compatibility

Requires n8n version 1.0 or above. Built and tested against the current n8n release.

## Usage

Typical patterns:

- **Nightly site archive**: Schedule Trigger → Shotium (Take Screenshot, full page) → S3/Drive upload
- **OG images that follow your data**: new blog post webhook → Shotium (Generate Signed URL, Blog template with expressions) → write the URL into your CMS's og:image field — the image updates whenever the signed parameters change
- **Visual monitoring**: Cron → Screenshot of a competitor page → image diff → alert

Rate limit is 60 requests/minute per API key. When quota and credits run out the API returns `429 quota_exceeded` — nothing auto-charges.

For build-time embedding without n8n, see the [Shotium docs](https://shotium.com/docs).

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Shotium API reference](https://shotium.com/docs)
- [OG image templates & parameters](https://shotium.com/og-templates)
- [Service status](https://status.shotium.com)
- [Changelog](https://shotium.com/changelog)

## Version history

- **0.1.1** — Credential verification moved to the dedicated `GET /v1/me` endpoint (declarative credential test).
- **0.1.0** — Initial release: Take Screenshot, Generate OG Image and Generate Signed URL operations.
