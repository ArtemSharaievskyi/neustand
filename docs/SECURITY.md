# Security and operational limits

## Resend credentials

The contact route reads `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and
`RESEND_TO_EMAIL` only in the Node.js server runtime at
`app/api/contact/route.ts`. Keep them in an ignored local environment file or
the hosting provider's server-side secret store. Do not prefix them with
`NEXT_PUBLIC_`, embed them in source, or include real values in `.env.example`.

The route refuses to send when a required value is missing, when the configured
recipient differs from the site's fixed contact destination, or when the
sender and submitter addresses match. A non-empty Resend message ID means the
provider accepted the API request. It does not prove delivery to the recipient's
mailbox.

## Input and attachment safeguards

- Names are trimmed and limited to 80 characters each; email is limited to 254
  characters and checked for a basic address shape; the message is limited to
  5,000 characters.
- The optional `company` honeypot rejects a non-empty value.
- A request body is streamed and capped at 12 MiB, including requests without a
  trustworthy `Content-Length` header.
- At most 5 attachments are accepted, with a 5 MiB per-file limit and 10 MiB
  total-file limit. Accepted formats are PDF, JPEG, PNG, and WebP. The server
  checks file signatures and rejects a declared MIME type that disagrees.
- Filenames are reduced to a restricted ASCII set before being sent to Resend.
- A validated `requestId` is passed as a Resend idempotency key. Resend documents
  a 24-hour key lifetime; this is not a persistent, database-backed exactly-once
  guarantee. See [Resend's send-email API](https://resend.com/docs/api-reference/emails/send-email).

## Abuse controls and limits

The route allows 5 requests per 15 minutes per client key, using the first
`x-forwarded-for` address or `x-real-ip`. Its `Map` is in process memory: it
resets on restart and is not shared across server instances. Forwarded headers
must be sanitized by the hosting proxy. This is a basic application guard, not
a distributed rate limiter or protection against volumetric traffic. Configure
an edge rate limit or WAF before exposing the form to substantial public
traffic.

The route is public and has no user accounts or authentication. Hosting-level
request limits should also be configured to match or tighten the 12 MiB body
limit. The hosting target has not been selected, so the current process-local
limiter remains a best-effort application guard. After choosing a host, configure
its edge rate limit and trusted proxy handling before public traffic; no external
rate-limit service is assumed here.

## Logging and responses

The route returns generic provider error messages and logs only a sanitized
error code. It suppresses Resend SDK development logging so recipient details
and message bodies are not written to console output. Do not add request bodies,
names, email addresses, message text, attachment contents, or API keys to logs.

## Dependency scan snapshot

As checked on 2026-10-07, `npm run security:osv` reported that it scanned 658
packages from `package-lock.json`, found 2 affected development packages and 3
advisories, and exited `1` with zero fixed versions available. Both packages
are absent from the production dependency graph
(`npm ls --omit=dev extract-zip sprintf-js --all` is empty).

The current chains are:

- `@lhci/cli@0.15.1 → lighthouse@12.6.1 → puppeteer-core@24.43.1 → @puppeteer/browsers@2.13.2 → extract-zip@2.0.1`
- `@lhci/cli@0.15.1 → @lhci/utils@0.15.1 → js-yaml@3.15.2 → argparse@1.0.10 → sprintf-js@1.0.3`

`extract-zip@2.0.1` is affected by [GHSA-7pqw-9j4j-h8q3](https://osv.dev/vulnerability/GHSA-7pqw-9j4j-h8q3)
(archive entries can write outside the extraction directory through a symlink)
and [GHSA-jmr9-qjv8-65gv](https://osv.dev/vulnerability/GHSA-jmr9-qjv8-65gv)
(unvalidated symlink targets can escape the extraction directory). Exploitation
requires a malicious archive to reach the browser-extraction path in the local
or CI tooling. `sprintf-js@1.0.3` is affected by
[GHSA-hp3w-g68c-fv3c](https://osv.dev/vulnerability/GHSA-hp3w-g68c-fv3c): an
attacker-controlled format string with unbounded precision can throw and cause
denial of service if it reaches the vulnerable formatter. These are tool-host
risks when the Lighthouse CI developer tooling runs; neither dependency is
shipped with the website.

Registry metadata still reports `@lhci/cli@0.15.1` as latest, pinned to
Lighthouse 12.6.1; `extract-zip` latest is 2.0.1 and `sprintf-js` latest is
1.1.3, which remains in the published affected range. Lighthouse 13.5.0
requires Node.js `>=22.19`, while this workspace uses Node.js 22.14.0, and LHCI
does not yet provide a compatible release. `package.json` contains unrelated
overrides, but none target these vulnerable dependency paths; no advisory
suppression is configured. Re-run `npm run security:osv` before releases; a
non-zero exit code remains a finding and must not be reported as a pass.
