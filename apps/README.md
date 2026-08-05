# Apps built on XALEN

This directory contains applications built on top of the XALEN ephemeris library.

## Available apps

| App | Language | Description |
|---|---|---|
| [`kp-astro-web/`](kp-astro-web/) | Kotlin/JS | KP (Krishnamurti Paddhati) astrology web app — pure frontend, zero runtime dependencies |

## Adding a new app

Each app should:
1. Live in its own subdirectory under `apps/`
2. Have its own `README.md` describing the app
3. Have its own build configuration (Cargo.toml / build.gradle.kts / package.json etc.)
4. Be referenced from this index

Apps in this directory are **not part of the core XALEN library** — they are demonstrations of what you can build with XALEN, and may have different stability guarantees.
