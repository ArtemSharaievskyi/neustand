# MCP setup

## Project template and local file

The tracked Windows template is `config/codex-mcp.example.toml`. The active
machine-local `.codex/config.toml` is ignored by Git. If there is no local file,
copy the template once:

```powershell
if (-not (Test-Path .codex/config.toml)) {
  New-Item -ItemType Directory -Force .codex | Out-Null
  Copy-Item config/codex-mcp.example.toml .codex/config.toml
}
```

If `.codex/config.toml` already exists, merge the needed entries instead of
replacing it. The template uses repo-relative Node package paths and assumes
Codex starts commands from the project root. On macOS or Linux, use `npx` as
the Playwright, GitMCP, and shadcn command instead of the Windows `cmd /c` wrapper.
Restart Codex after editing the local MCP configuration, then inspect the
server list with `codex mcp list`. Codex does not load `.env.local` as its own
environment: provide `ORIGINKIT_API_KEY` to the Codex process before starting it.

## Servers and versions

| Server | Setup | Notes |
| --- | --- | --- |
| Playwright MCP | `@playwright/mcp@0.0.30` | Headless, isolated browser; allows only the local app origins on ports 3000, 4317, and 4318 |
| Next.js DevTools MCP | `next-devtools-mcp@0.4.0` from the npm lockfile | Requires a running Next.js dev server; stdio server itself does not reserve a port |
| Context7 | `@upstash/context7-mcp@4.1.2` from the npm lockfile | Local stdio process; a documentation lookup uses the network but does not require a project key |
| DaisyUI GitMCP | `mcp-remote@0.14.3` | Remote documentation endpoint; the client package is pinned, while upstream documentation changes over time |
| shadcn MCP | `shadcn@4.21.4` via pinned npx command | Browse the public registry; optional, independent of the installed shadcn skill |
| OriginKit | Optional remote integration | The template points to the endpoint; it becomes usable after `ORIGINKIT_API_KEY` is available to Codex. Keep the value outside Git and TOML. |
| Ruflo | Codex user-level configuration | Keep the existing user-level server; do not duplicate it in this template |

The separate `.agents/config.toml` is an agent-harness configuration, not a
second copy of Codex's local MCP file. Its Ruflo command is pinned to `3.54.1`;
the active Ruflo server may still come from user-level settings. No paid component
or service is required by the website.

## Allowlist and safe smoke checks

The pinned Playwright MCP `0.0.30` requires host-and-port entries without a
scheme in `--allowed-origins`; the scheme-prefixed format from the current
upstream documentation is rejected by this older pinned version. The tested
list contains only the app's local ports. Upstream also documents that the
allowlist does not constrain redirects, so treat it as a scope setting rather
than a complete security boundary. Keep `--headless` and `--isolated`; do not
remove the list or add arbitrary external hosts. Re-check the format before
changing the pinned MCP version.

To check local navigation, start `npm run dev`, then use the Playwright MCP to
navigate to `http://127.0.0.1:3000/` or `http://localhost:3000/`. The normal
Playwright Test suite is the fallback if the MCP client cannot navigate:

```powershell
npm test
```

For Next.js DevTools, start the dev server and call `nextjs_index`; it should
discover the running app. For Context7, call `resolve-library-id` with a generic
library query such as `Next.js`. A server appearing in `codex mcp list` proves
only registration; report each safe tool call separately.
