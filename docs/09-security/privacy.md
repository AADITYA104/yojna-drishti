# Privacy

## Principle
The platform shows aggregates. It does not collect, store or display individual beneficiary data.

## Never stored or shown
Aadhaar numbers, mobile numbers, bank details, beneficiary names, addresses, application documents, individual circumstances. Import rejects such columns (DQ-09). No public individual search exists and none will be added.

## Legal basis (working notes, confirm with counsel)
India's Digital Personal Data Protection Act, 2023 and the DPDP Rules, 2025 (notified November 2025 per the blueprint's PIB references) are the relevant framework for personal data. Because the platform holds no personal data of beneficiaries, obligations mainly attach to admin users' account data (email, name) and any visitor data. Government information-security requirements for hosting sensitive government data must be checked with the relevant IT department. Nothing here is legal advice.

## Personal data that does exist
Admin user: name, work email, role, login timestamps, hashed IP in audit logs. Purpose: access control and accountability. Retention per security.md. Provide a privacy notice page and a contact for grievances (placeholder until the owner organisation is known; OQ-08).

## <a id="small-number-suppression"></a>Small-number suppression
- Default threshold k = 10 for village-level counts (ADR-0010, provisional). Stricter k = 20 for the sensitive schemes S2, S4, S5 (widowhood, pregnancy, remarriage) pending legal review.
- Display: "less than 10" instead of the exact number; rates derived from suppressed inputs are not shown.
- Complementary suppression in child tables to stop differencing from parent totals.
- Suppression applies in API, UI, exports; it is computed in the metrics module only.
- Trade-off recorded: suppression lowers village-level insight. The decision to relax it needs an ADR and legal sign-off.

## Visitors
No analytics trackers or advertising cookies in v1. Only functional cookies (language preference). Map tile requests go to the configured provider, which may see IP addresses; disclosed in the privacy notice.

## Data minimisation and access
Public API returns only published aggregates. Unpublished batches visible only to authorised roles. Admin access scoped by role and optional district.

## Breach response
Runbook in disaster-recovery.md (incident section): contain, assess, notify per legal duty, record in risk register.
