# NEBUCHADREKTZAR — admin

Private content desk for the NEBU public site.

## Environment

```bash
PORT=3000
API_ORIGIN=https://your-nebu-web-origin
ADMIN_API_KEY=same-secret-as-nebu-web
```

The browser never receives `ADMIN_API_KEY`. This app proxies edits server-side to the protected public-site content API.

Current controls: site state, hero copy, character URL, current song, lore, contract address, X and Telegram links.

Bunny `NEBUFILES` is represented by character/audio URL fields. Direct Bunny uploads should be added only after storage-zone credentials are configured server-side.
