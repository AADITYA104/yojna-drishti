# Security (SECURITY_AND_PRIVACY, security part) and Threat Model

Status: design. Legal and regulatory statements below are working notes to be confirmed with counsel; see privacy.md.

## Assets
Published aggregate statistics (integrity matters most), unpublished batches (confidentiality, may be pre-release), admin accounts, raw uploads, audit logs, secrets.

## Actors
Anonymous internet user; malicious uploader (compromised Data Manager); insider with excessive rights; automated scrapers/DoS; supply-chain attacker via dependencies.

## Threat model (STRIDE-oriented)
| ID | Threat | Control | Test |
|---|---|---|---|
| T-01 | Spoofing admin login | MFA for non-public roles, lockout, secure session cookies (HttpOnly, Secure, SameSite=Lax or Strict), session rotation on login | auth tests |
| T-02 | Privilege escalation by calling admin API directly | Central server-side guard on every route; deny by default; UI hiding never trusted | TC-ADM-01 bypass tests |
| T-03 | SQL injection | Parameterised queries only; ORM or prepared statements; lint rule banning string-built SQL; DB role least privilege | static check + payload tests |
| T-04 | XSS | React escaping, no dangerouslySetInnerHTML without sanitiser review, CSP, sanitise names from imports on display | payload tests |
| T-05 | CSRF on cookie-authenticated mutations | CSRF token or same-site + custom header check | tests |
| T-06 | Malicious upload (CSV injection, zip bomb, XLSX macro, path traversal) | Allow-list types, size caps, parse in restricted path, ignore macros, neutralise formula prefixes on export, sanitise filenames, store outside web root, hash | upload tests |
| T-07 | Tampering with published data | Approval workflow with separation of duties, immutable audit log, DB grants, batch rollback | integration tests |
| T-08 | Tampering with audit logs | App role has INSERT/SELECT only; periodic hash chain export (optional, ADR) | grant test |
| T-09 | Information disclosure through errors | Error contract, no stack traces, safe messages | TC-NFR-ERR |
| T-10 | Re-identification through small counts | Suppression threshold and complementary suppression, no individual endpoints | TC-DAT-06 |
| T-11 | Secrets leakage in repo or logs | Secret scanning in CI, redaction in logger, .env.example placeholders only, secrets in environment stores | scan |
| T-12 | Dependency vulnerabilities | Lockfile, audit in CI, update policy, no unneeded packages | CI audit |
| T-13 | DoS / scraping | Rate limits, pagination caps, export row cap, caching, request size limits | load test |
| T-14 | Clickjacking, MIME sniffing | frame-ancestors none, X-Content-Type-Options nosniff | header test |
| T-15 | Boundary data licence breach | Licence recorded; redistribution gate before publishing | review |
| T-16 | Demo data mistaken for real | Badges, API meta, DB checks, leak test | TC-DAT-01 |
| T-17 | Backup exposure | Encrypted backups, restricted access, restore drill | drill |

## Authentication and sessions
Maintained library (ADR-0005). Admin roles require MFA. Passwords, if used, hashed with a modern memory-hard algorithm per library defaults. Session lifetime short for admins (provisional 8 hours absolute, 30 minutes idle).

## Authorisation
RBAC with optional district scope per user. One guard function `requireRole(roles, scope?)` used in every admin handler. Deny by default.

## Secure headers (production)
Content-Security-Policy (script-src self plus nonce; connect-src self plus configured tile provider; img-src self data blob plus provider), Strict-Transport-Security, X-Content-Type-Options, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy minimal, frame-ancestors none. CORS: API same-origin only unless a public API origin is approved.

## <a id="audit"></a>Audit logging
Logged: logins, failed logins, role changes, imports, approvals, publish, rollback, scheme and source edits, user admin, exports above a threshold. Fields in data-model.md. Immutable by grants. Viewable by Super Administrator; reviewer read-only.

## Data retention
Raw uploads 12 months; audit logs 7 years; error logs 90 days; access logs 90 days with IP hashing (all provisional pending legal confirmation).

## Backup security
Encrypted at rest and in transit, separate credentials, access logged, restore tested (disaster-recovery.md).

## Secrets management
Environment variables via the hosting platform or GitHub environment secrets; classification in environment.md; rotation procedure documented; never in repo, never in client bundle (only NEXT_PUBLIC_ variables are public, and they hold no secrets).

## Residual risks
See risk-register.md R-05 to R-09.

## Bootstrap and account recovery (v0.3.0, TASK-084)
- First Super Administrator is created only by a CLI that needs direct database access; it refuses if a Super Admin exists (override flag is audited). The account has a one-time password, forced change and mandatory MFA enrolment at first login.
- MFA recovery codes are generated once, shown once, stored hashed.
- Lost password: another Super Admin issues a reset link (single use, 30 minutes). Lost MFA: another Super Admin resets MFA; both actions audited.
- Last Super Admin locked out: operator with database access runs the CLI recovery path; this is logged outside the application and recorded in the incident log.
- The system refuses to remove or demote the last Super Admin.
