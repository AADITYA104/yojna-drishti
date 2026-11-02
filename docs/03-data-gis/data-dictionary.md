# Data Dictionary

Authoritative field list is data-model.md. This file defines semantics and import column names.

## Terms
| Term | Definition |
|---|---|
| LGD code | Identifier assigned by the Local Government Directory; the only join key for geography |
| received | Applications received in the period |
| approved | Applications approved in the period |
| rejected | Applications rejected in the period |
| pending | Applications neither approved nor rejected at period end |
| active_count | Beneficiaries receiving benefit at period end (department definition must be recorded per source) |
| ever_approved_count | Cumulative approved beneficiaries since scheme start |
| unique_paid_count | Distinct beneficiaries paid in period (needed for average assistance) |
| allocated_inr | Budget provision, not yet approved for any person |
| sanctioned_inr | Amount approved for beneficiaries |
| disbursed_inr | Amount actually paid |
| in_kind_units | Count of kits or items distributed; never rupees |
| data_as_of | The date to which the figures are accurate |
| financial_year | Indian FY, April to March, text YYYY-YY (example 2025-26) |

<a id="nulls"></a>
## Null semantics
NULL means the source did not provide the value. Zero means the source reported zero. Importers never coerce blank to zero. Blank cells and strings like NA, -, N/A become NULL with a warning. API returns null plus reason_code (SOURCE_NOT_PROVIDED, NOT_COMPUTABLE, SUPPRESSED, NOT_PUBLISHED).

## Import file column specs
### Statistics file (applications, beneficiaries, financial) - CSV UTF-8 or XLSX first sheet
Required: lgd_code, level, scheme_code, financial_year, period_type, period_start, period_end, count_basis (period or cumulative), data_as_of. Value columns by dataset: received, approved, rejected, pending | active_count, ever_approved_count, unique_paid_count | benefit_type, allocated_inr, sanctioned_inr, disbursed_inr, in_kind_units, in_kind_unit_label. Optional: remarks.
Forbidden (batch rejected if present, case-insensitive match including Gujarati equivalents): name, beneficiary_name, aadhaar, aadhar, uid, mobile, phone, account, ifsc, bank, address, dob, application_number, photo.
Number formats: plain digits, optional decimal point, no thousands separators; Indian digit grouping rejected with a clear message.
### Geography file (LGD) - as exported by LGD; mapping file records original column names.
### Boundary file - GeoJSON or Shapefile with lgd_code property; see gis-data-spec.md.
