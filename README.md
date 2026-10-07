# NEUSTAND website

The site presents NEUSTAND's German-language property clearance, renovation
preparation, and property services. It uses the Next.js App Router, React 19,
TypeScript, Tailwind CSS 4, DaisyUI 5, and a server-side contact route backed by
Resend.

## Requirements

- Node.js 22 (verified here with Node 22.14.0 and npm 11.14.1).
- npm and the committed `package-lock.json`.
- Windows PowerShell for the pinned OSV-Scanner helper; the web app and other
  npm scripts use Node.js.

The dependency versions are pinned in `package.json` and `package-lock.json`.
The Agency Agents source commits and project skills are recorded in
`config/agency-agent-skill-map.json` and `skills-lock.json`.

## Install and run

```powershell
npm ci
npm run dev
```

The development server is available at `http://localhost:3000`. To configure
the contact route locally, copy the safe template once and edit `.env.local`:

```powershell
if (-not (Test-Path .env.local)) { Copy-Item .env.example .env.local }
```

`.env.local` is ignored by Git. Set the server-only variables `RESEND_API_KEY`,
`RESEND_FROM_EMAIL`, and `RESEND_TO_EMAIL` locally. The sender domain must be
verified in Resend, and the recipient must match the destination enforced by
the route. The values in `.env.example` are placeholders; with them, the route
returns its unconfigured response and cannot send mail. Never use a
`NEXT_PUBLIC_` prefix for these values.

## Build and checks

```powershell
npm run build
npm run typecheck
npm run lint
npm test
npm run lighthouse:ci
npm run security:osv
```

`npm test` runs Playwright Test in desktop Chromium and Pixel 7 mobile Chromium.
Its local server has a test-only Resend fetch stub and an invalid placeholder
key, so provider success, rejection, and network failure can be exercised
without sending a real email. Playwright reports and screenshots are ignored.
Lighthouse CI writes into the ignored `node_modules/.cache/lhci/` tree. The OSV
helper downloads OSV-Scanner 2.6.0 to the current user's local tools directory
and verifies the pinned SHA-256 before running it against `package-lock.json`.

## Agents, skills, and MCP tools

Use the existing Codex profiles in `.codex/agents/` and preserved Agency Agents
instructions in `.codex/agency-agents/source/`. `config/agency-agent-skill-map.json`
maps profiles to the skills under `.agents/skills/`; `skills-lock.json` records
the installed external skill sources. `shadcn` is optional guidance and does
not make shadcn/ui mandatory for this or future sites.

Restore project MCP settings from
[`config/codex-mcp.example.toml`](config/codex-mcp.example.toml) as described in
[docs/MCP_SETUP.md](docs/MCP_SETUP.md). Do not overwrite an existing local
`.codex/config.toml`; merge the entries you need. Codex's user-level Ruflo
connection is managed separately from this project template.

## Project references

- [Agent instructions](AGENTS.md)
- [Security and current limitations](docs/SECURITY.md)
- [Contact API contract](docs/CONTACT_API.md)
- [MCP restoration and safe checks](docs/MCP_SETUP.md)
- [NEUSTAND first variant](docs/NEUSTAND-FIRST-VARIANT.md)
