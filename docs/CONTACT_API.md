# Contact API

`POST /api/contact` accepts `multipart/form-data` and runs in the Next.js Node.js
runtime. The browser form calls this route; the route validates the request and
then calls the Resend email API.

## Fields

| Field | Requirement and limit |
| --- | --- |
| `firstName` | Required, trimmed, 1–80 characters |
| `lastName` | Required, trimmed, 1–80 characters |
| `email` | Required, trimmed, at most 254 characters, basic address validation |
| `message` | Required, trimmed, 1–5,000 characters |
| `requestId` | Required; 12–100 ASCII letters, digits, `_`, or `-` |
| `files` | Optional repeated field; PDF, JPEG, PNG, or WebP; max 5 files, 5 MiB per file, 10 MiB total |
| `company` | Optional honeypot; a non-empty value is rejected |

The entire streamed request body is limited to 12 MiB. File extensions and MIME
headers are not trusted on their own; the server checks the file signature and
checks any declared MIME type against it.

## Responses

All JSON errors have `{ "ok": false, "message": "…" }` with a German,
user-facing message.

| HTTP status | Meaning |
| --- | --- |
| `200` | `{ "ok": true }`; Resend returned a message ID and accepted the request |
| `400` | Malformed multipart data, honeypot, invalid fields, unsupported file, or a file/count limit violation |
| `413` | The complete request body exceeded 12 MiB |
| `429` | More than 5 requests in 15 minutes for the process-local client key; includes `Retry-After` |
| `502` | Resend rejected the request, returned no message ID, or could not be reached |
| `503` | Required Resend configuration is incomplete or does not match the route's fixed recipient |

An HTTP 200 means the Resend API accepted the send request; it does not confirm
that a mailbox received the email. The client creates a new `requestId` when
form data or selected files change. The route passes
`neustand-contact-${requestId}` to Resend as its idempotency key; Resend keys
expire after 24 hours. No local deduplication store is used.
