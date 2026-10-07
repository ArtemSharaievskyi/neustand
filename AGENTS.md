# neustand-site

NEUSTAND is a German service-company website built with the Next.js App Router,
React, TypeScript, Tailwind CSS 4, and DaisyUI. The contact API is a server-side
Next.js route backed by Resend. Agent profiles and project skills are kept in
`.codex/agents/`, `.codex/agency-agents/`, `.agents/skills/`, and their maps.

## Required commands

Install from the committed lockfile with `npm ci`; copy `.env.example` to a
local `.env.local` only when you need to configure the contact route. Use
`npm run dev`, `npm run build`, `npm run typecheck`, `npm run lint`, `npm test`,
`npm run lighthouse:ci`, and `npm run security:osv` as needed. `npm test` runs
desktop and mobile Chromium checks and uses a local Resend simulation; it never
sends email.

See [README.md](README.md) for setup, [docs/SECURITY.md](docs/SECURITY.md) for
server-side safeguards, [docs/CONTACT_API.md](docs/CONTACT_API.md) for the
contact contract, and [docs/MCP_SETUP.md](docs/MCP_SETUP.md) for restoring MCPs.

## Change limits

- Preserve the approved NEUSTAND layout, copy, images, FAQ, and contact-form
  appearance unless the user explicitly asks for a visual change.
- Do not create agent profiles or skills from scratch, duplicate installed
  tools, add paid components, or publish project data to external scanners.
- Keep secrets in ignored local environment files. Never add API keys, personal
  request data, local runtime state, or machine-specific paths to the repository.
- Do not stage, commit, push, merge, or publish unless the user explicitly
  authorizes that exact action.
- Read the matching guide under `node_modules/next/dist/docs/` before changing
  Next.js application code; this project uses Next.js 16.

## Agent Coordination

### Swarm Configuration

This project uses hierarchical swarm coordination for complex tasks:

| Setting | Value | Purpose |
|---------|-------|---------|
| Topology | `hierarchical` | Queen-led coordination (anti-drift) |
| Max Agents | 8 | Optimal team size |
| Strategy | `specialized` | Clear role boundaries |
| Consensus | `raft` | Leader-based consistency |

### When to Use Swarms

**Invoke swarm for:**
- Multi-file changes (3+ files)
- New feature implementation
- Cross-module refactoring
- API changes with tests
- Security-related changes
- Performance optimization

**Skip swarm for:**
- Single file edits
- Simple bug fixes (1-2 lines)
- Documentation updates
- Configuration changes

### Available Skills

Use `$skill-name` syntax to invoke:

| Skill | Use Case |
|-------|----------|
| `$swarm-orchestration` | Multi-agent task coordination |
| `$memory-management` | Pattern storage and retrieval |
| `$sparc-methodology` | Structured development workflow |
| `$security-audit` | Security scanning and CVE detection |

### Agent Types

| Type | Role | Use Case |
|------|------|----------|
| `researcher` | Requirements analysis | Understanding scope |
| `architect` | System design | Planning structure |
| `coder` | Implementation | Writing code |
| `tester` | Test creation | Quality assurance |
| `reviewer` | Code review | Security and quality |

## Execution Model

- **claude-flow** = LEDGER (coordinates: memory, routing, swarm state)
- **Codex** = EXECUTOR (writes code, runs tests, creates files)

**Critical rule:** DON'T STOP after calling claude-flow commands. Coordination commands return instantly — continue immediately with the next implementation step.

## Ruflo + Codex Automated Workflow

Ruflo is the coordination ledger and policy decision point; Codex workers execute code, tests, and commands. A Ruflo coordination call records work but never replaces implementation.

Use `guidance_brain({ mode: "recommend", task: "..." })` when the task can
benefit from Ruflo-specific capabilities. Its live registry is authoritative
for tool presence; registration alone does not prove configuration,
reachability, health, or authorization. If it is not registered, use compatible
`guidance_recommend`, CLI discovery, and repository instructions.

1. **Recall** — search AgentDB memory and relevant ADRs for patterns and constraints.
2. **Inspect** — read source, runtime, dependency, policy, and health state.
3. **Route** — choose the smallest capable topology, agents, skills, and tools.
4. **Plan** — define acceptance criteria, safety envelope, ownership, and validation.
5. **Execute** — Codex workers implement in isolated scopes; Ruflo records coordination.
6. **Test** — run focused tests, regression tests, and failure-path checks.
7. **Validate** — check types, security, policy, compatibility, and artifact integrity.
8. **Benchmark** — compare a source-bound candidate with a source-bound baseline.
9. **Optimize** — improve measured bottlenecks without weakening the safety envelope.
10. **Receipt** — bind claims, evidence, and decisions to exact source/build inputs.
11. **Handoff** — reconcile concurrent work and disclose unresolved limitations.
12. **Publish** — only an independently authorized release gate may publish immutable artifacts.

### Concurrency and authority invariants

- Never allow two writers in one worktree.
- Read-only research agents may share a checkout; writing agents may not.
- A child may drop capabilities but can never add tools, servers, namespaces, network access, spend, concurrency, or delegation depth.
- Cancel dependent and not-yet-started sibling work when policy denies an action or a required dependency fails.
- MetaHarness may benchmark candidates concurrently, but it cannot promote, serve, or expand its own SafetyEnvelope.
- Only the integration agent changes shared manifests or lockfiles.
- Do not auto-commit, push, merge, release, or delete worktrees unless the user authorized that operation.
- Every consequential action must produce a policy decision receipt; production, destructive, spend, and promotion actions may require human approval.

### Repository harness adapter

When tracked repository instructions define a local collaboration harness:

1. Assign the isolated worktree before starting a writing session.
2. Start or register the session, inspect current claims, and acquire only the
   exact paths, resources, and development ports needed for the task.
3. Renew leases during long work, check acknowledged inbox messages at integration
   boundaries, and release claims when handing off or ending.
4. Record focused and integration evidence against the exact source state,
   then let the designated integration owner decide release.

A repository lease coordinates ownership; it does not grant authorization.
In-memory reference adapters demonstrate semantics but are not distributed,
restart-durable release authorities.
The worker still needs the current ADR-324/325 action capability and fencing
epoch for every protected side effect. Heartbeat and lease expiry establish
liveness; a PID is diagnostic only. HEAD alone is not an exact source-state
identity when tracked or untracked changes exist, so a release receipt must
bind a clean commit or an immutable snapshot including those changes.


## MCP Integration

Use MCP tools for coordination, then keep coding:

| Tool | Purpose | Example |
|------|---------|---------|
| `swarm_init` | Start coordination | `swarm_init({topology: "hierarchical"})` |
| `memory_store` | Save patterns | `memory_store({key: "auth", value: "JWT"})` |
| `memory_search` | Find patterns | `memory_search({query: "auth patterns"})` |
| `task_orchestrate` | Assign work | `task_orchestrate({task: "implement"})` |

## NEUSTAND Frontend Development

External UI sources are reference material only. The final interface must
follow approved NEUSTAND design evidence and pass browser, accessibility, and
performance checks before handoff. Use the project-local `frontend-dev` skill
for source routing, review gates, and evidence requirements; do not replace
the existing Ruflo MCP or duplicate installed skills.

## Code Standards

### File Organization
- **NEVER** save to root folder
- `/src` - Source code files
- `/tests` - Test files
- `/docs` - Documentation
- `/config` - Configuration files

### Quality Rules
- Files under 500 lines
- No hardcoded secrets
- Input validation at boundaries
- Typed interfaces for public APIs
- TDD London School (mock-first) preferred

### Commit Messages
```
<type>(<scope>): <description>

[optional body]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

Do not add a `Co-Authored-By` trailer unless the repository explicitly
configures and authorizes that attribution.

## Security

### Critical Rules
- NEVER commit secrets, credentials, or .env files
- NEVER hardcode API keys
- Always validate user input
- Use parameterized queries for SQL
- Sanitize output to prevent XSS

### Path Security
- Validate all file paths
- Prevent directory traversal (../)
- Use absolute paths internally

## Memory System

### Storing Patterns
```bash
npx @claude-flow/cli memory store \
  --key "pattern-name" \
  --value "pattern description" \
  --namespace patterns
```

### Searching Memory
```bash
npx @claude-flow/cli memory search \
  --query "search terms" \
  --namespace patterns
```

## Quick Commands

```bash
npx @claude-flow/cli memory search --query "relevant patterns"
npx @claude-flow/cli hooks route --task "current task description"
npx @claude-flow/cli swarm init --topology hierarchical
npx @claude-flow/cli hooks pre-task --description "task summary"
```

## Links

- Documentation: https://github.com/ruvnet/ruflo
- Issues: https://github.com/ruvnet/ruflo/issues

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
