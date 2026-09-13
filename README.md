# NEBUCHADREKTZAR — admin

Private content desk for the NEBU public site.

## Environment

```bash
PORT=3000
API_ORIGIN=https://your-nebu-web-origin
ADMIN_API_KEY=same-secret-as-nebu-web
ADMIN_PANEL_USER=nebu
ADMIN_PANEL_PASSWORD=strong-private-password
```

The browser never receives `ADMIN_API_KEY`. This app proxies edits server-side to the protected public-site content API.

The entire admin surface is also protected by HTTP Basic authentication at `proxy.ts`, including the same-origin admin API route. Production must define both `ADMIN_PANEL_USER` and `ADMIN_PANEL_PASSWORD`; otherwise the admin fails closed with HTTP 503.

## Current controls

- public status / eyebrow / headline / one-liner
- approved Fallen King character/logo URL
- featured broadcast title and subtitle
- preferred video URL
- video poster URL
- fallback feature image URL
- fallback audio URL
- lore cards
- contract address
- X / Telegram URLs

The admin shows which public mode will be used: **VIDEO FIRST**, **IMAGE + AUDIO FALLBACK**, visual-only, or waiting for media.

Bunny `NEBUFILES` remains the media origin. The video file should normally contain its soundtrack; the separate audio URL is used when the video is unavailable.
