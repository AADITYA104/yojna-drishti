# Roles and Permissions

Enforced on the server by one guard. Deny by default. MFA required for every role except Public Viewer.

| Capability | Public Viewer | Analyst | Data Manager | Department Reviewer | Super Admin |
|---|---|---|---|---|---|
| View published VERIFIED data | yes | yes | yes | yes | yes |
| View DEMO data (if enabled) | yes (badged) | yes | yes | yes | yes |
| View ARCHIVED history | no | yes | yes | yes | yes |
| Export | limited | yes | yes | yes | yes |
| View unpublished batches | no | no | own | all | all |
| Upload import | no | no | yes | no | yes |
| Validate and submit batch | no | no | yes | no | yes |
| Approve or reject batch | no | no | no | yes (not own upload) | yes (not own upload) |
| Publish / unpublish | no | no | no | yes | yes |
| Rollback | no | no | no | yes | yes |
| Edit schemes, sources | no | no | yes (draft) | approve | yes |
| Manage users and roles | no | no | no | no | yes |
| Read audit log | no | no | no | read | yes |
| Change system settings | no | no | no | no | yes |

## Rules
1. Separation of duties: approver cannot equal uploader (enforced in service and by DB CHECK).
2. Optional district scope: Data Manager and Reviewer may be limited to given districts via user_roles.scope_unit_id.
3. Role changes by Super Admin only, audited; at least two Super Admins recommended (no last-admin lockout: system refuses to remove the last Super Admin).
4. Break-glass: none in v1. Emergency access procedure documented in disaster-recovery.md and audited.
5. Service accounts (CI, import) have separate least-privilege DB roles; not usable through the web UI.

6. **Single-owner development mode:** with SOLO_OWNER_MODE=true, in a non-production environment, a Super Administrator may approve their own DEMO upload. The system refuses to start with this flag when NODE_ENV is production, and VERIFIED data can never be self-approved. Every such approval is audited with solo_owner=true. This exists because a one-person team would otherwise be unable to exercise the workflow in development.
