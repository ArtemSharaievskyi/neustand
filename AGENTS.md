# NEUSTAND site

This repository is the independent NEUSTAND website. Its code, public assets, package lockfile, tests, build configuration, and site documentation stay here. The stable site ID is in `config/site.json`. Run `npm ci`, `npm run typecheck`, `npm run lint`, `npm run build`, and `npm test` from this folder. The tests use a local Resend simulation and do not send email.

Preserve the approved layout, copy, images, Hero, animations, FAQ, and contact form unless the user explicitly requests a visual change. Keep secrets in ignored local `.env` files. Do not stage, commit, push, merge, or publish without exact user authorization. Read the matching guide under `node_modules/next/dist/docs/` before editing Next.js application code; this project uses Next.js 16.

The sibling `ruflo` repository holds reusable agent profiles, original sources and licenses, technical skills, their locks, and site launch scripts. It is optional for installation, builds, tests, and production. This site retains only its project-specific `frontend-dev` skill and `config/site-design-context.json`. Shared tools are connected through the user's Codex skills directory and an ignored local `.codex/agents` junction. A fresh machine may run the site without those developer tools.

For Codex with Ruflo, open this project using `..\ruflo\scripts\open-site.ps1 -Slug neustand`. It starts a fresh session with `approval_policy=on-request`, `sandbox_mode=workspace-write`, and this site's private Ruflo memory path. Never resume or fork a session from another site. Do not run swarm, neural, or cross-site memory imports. The site-specific Ruflo and other local state is ignored by Git. See `docs/MCP_SETUP.md` for optional MCP setup.

Keep source in `app` and `src`, tests in `tests`, and documentation in `docs`. Validate input at boundaries, use typed public APIs, and keep files under 500 lines where practical. The contact route and server-side safeguards are documented in `docs/CONTACT_API.md` and `docs/SECURITY.md`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
