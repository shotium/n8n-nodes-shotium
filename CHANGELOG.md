# Changelog

## 0.1.3

- Corrected credential documentation to reflect free validation through `GET /v1/me`
- Hardened tag-driven GitHub Actions publishing with OIDC-only authentication and exact release metadata checks
- Documented the complete maintenance release checklist and synchronized package lock versions

## 0.1.2

- Codex `node` field now uses the fully-qualified identifier `n8n-nodes-shotium.shotium` (n8n verification requirement)
- Removed unsupported `Developer Tools` codex category — `Development` already covers it

## 0.1.1

- Credential verification now uses the dedicated `GET /v1/me` endpoint via a declarative credential test (required by n8n's verification vetting) — still free, never bills a render

## 0.1.0

- Initial release
- **Take Screenshot** operation: render any public URL to PNG/JPEG/WebP with viewport, full-page and quality options
- **Generate OG Image** operation: render 1200×630 social cards from the Blog, Product, Podcast, Event and Minimal templates
- **Generate Signed URL** operation: build HMAC-signed OG image links locally — no API call, no render billed, safe to embed in public HTML
- Binary output ready for downstream nodes (S3, email, Telegram, …)
