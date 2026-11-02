# Official Scheme Research Register (OFFICIAL_SCHEME_RESEARCH)

Register date: 2026-10-31. Researcher: Part 1 documentation pass.

## Verification levels
| Level | Meaning |
|---|---|
| V0 UNVERIFIED | Carried from the user's blueprint; not re-checked |
| V1 SECONDARY | Seen in non-official sites (news, aggregators, blogs); useful lead, not citable as fact |
| V2 OFFICIAL | Confirmed on an official government page or GR; URL and date recorded |

**Result of this pass: no scheme field has reached V2.** Official WCD pages and GRs were not retrieved in this session. TASK-004 must perform primary-source verification. Nothing below may be displayed in the product as official until upgraded.

## Discrepancies and Scope Mapping (Notebook vs Pilot Scope)
1. The user's notebook specifically lists 7 national & state schemes under the header "Government Scheme for Women, Housewife & Women Entrepreneur":
   - **N-1: Pradhan Mantri Matru Vandana Yojana (PMMVY)** - Maternity benefit scheme (Direct Benefit Transfer of ₹5,000 in stages to pregnant women & lactating mothers).
   - **N-2: Stand Up India Scheme** - Bank loans between ₹10 lakh and ₹1 crore to at least one woman borrower per bank branch for setting up a greenfield enterprise.
   - **N-3: Pradhan Mantri Mudra Yojana (PMMY)** - Collateral-free micro loans up to ₹10 lakh under Shishu, Kishore, and Tarun categories for non-corporate micro enterprises (huge housewife/women artisan participation).
   - **N-4: Beti Bachao Beti Padhao (BBBP)** - Inter-sectoral initiative for gender ratio improvement, girl child protection, and secondary education retention.
   - **N-5: Sukanya Samriddhi Yojana (SSY)** - Government-backed savings scheme for girl children with high interest rates and tax exemptions.
   - **N-6: Mahila Samridhi Yojana (MSY)** - Micro-credit and socio-economic support targeting marginalized women entrepreneurs through state channelizing agencies.
   - **N-7: Mukhya Mantri Mahila Utkarsh Yojana (MMUY)** - Gujarat State government scheme providing interest-free loans of ₹1,00,000 to Joint Liability and Earning Groups (JLEG) of women (10 women per group, state covers ₹9,000 annual interest).

2. The 5 Core Gujarat State Pilot Schemes (WCD Gujarat Focus):
   - **S-1: Vahali Dikri Yojana** (દીકરી સહાય)
   - **S-2: Ganga Swarupa Arthik Sahay Yojana** (વિધવા સહાય - માસિક ₹1,250)
   - **S-3: Mahila Swavlamban Yojana** (મહિલા વ્યવસાય સબસિડી/લોન)
   - **S-4: Mukhyamantri Matrushakti Yojana** (પોષણ કિટ - 1L તેલ, 1kg તુવેર દાળ, 2kg ચણા)
   - **S-5: Ganga Swarupa Punarlagna Arthik Sahay Yojana** (પુનઃલગ્ન સહાય ₹50,000)

3. Architecture Resolution:
   The database and scheme catalogue support both sets through `scheme_category` ('STATE_WCD', 'CENTRAL_SPONSORED', 'WOMEN_ENTREPRENEUR') and `scheme_target_groups` ('GIRL_CHILD', 'PREGNANT_LACTATING', 'WIDOW', 'HOUSEWIFE', 'WOMEN_ENTREPRENEUR'). The initial Phase 1/Pilot UI filters spotlight the 5 Core State WCD schemes, while reserving catalogue rows and metadata filters for the notebook's extended 7 women empowerment schemes.

## Register
### S1 Vahali Dikri Yojana (વ્હાલી દીકરી યોજના)
| Field | Value | Level | Notes |
|---|---|---|---|
| Department | Women and Child Development, Gujarat | V1 | Multiple secondary sites agree; portal reference wcd.gujarat.gov.in |
| Launch | 2 Aug 2019 | V1 | Vikaspedia-style listing |
| Benefit | Rs 4,000 at Std 1 admission; Rs 6,000 at Std 9 admission; Rs 1,00,000 at age 18; total Rs 1,10,000 | V1 | Consistent across several secondary sources and the blueprint; all are cash, staged |
| Eligibility | Permanent Gujarat resident; family income below Rs 2 lakh per year (one secondary source); guardian may apply if parents not alive | V1 | Secondary sources conflict on target group (one says SC and BPL first girl child; others say low-income families). Which daughters/birth dates qualify is NOT established |
| Documents | Birth certificate of daughter, income proof, ration card and others | V1 | Incomplete list |
| Application | Offline via Anganwadi/District WCD office; online route claimed | V1 | Route must be confirmed |
| Status in 2026 | Unknown | V0 | |
| Statistics availability | Unknown | F | See data-availability-matrix.md |

### S2 Ganga Swarupa Arthik Sahay Yojana (ગંગા સ્વરૂપા આર્થિક સહાય યોજના)
Blueprint claim (V0): monthly assistance Rs 1,250 to widows aged 18 or above; separate rural and urban income limits. Not re-checked. Status 2026, GR, documents, application route: unknown.

### S3 Mahila Swavlamban Yojana (મહિલા સ્વાવલંબન યોજના)
Blueprint claim (V0): bank loan recommendation up to Rs 2 lakh; subsidy is the lesser of 15 percent of project cost or Rs 30,000; age and income conditions apply. Benefit type mixes loan and subsidy: the product must model them as separate benefit types. Everything else unknown.

### S4 Mukhyamantri Matrushakti Yojana (મુખ્યમંત્રી માતૃશક્તિ યોજના)
Blueprint claim (V0): in-kind nutrition support per beneficiary: 1 litre groundnut oil, 1 kg tur dal, 2 kg chana; for first-time pregnant women and mothers of a first child up to 2 years. In-kind: statistics are kit counts, not rupees. Frequency, delivery channel and 2026 status unknown. Note: the blueprint's wording on eligibility mentions pregnancy; any display must stay aggregate-only (sensitive circumstance).

### S5 Ganga Swarupa Punarlagna Arthik Sahay Yojana
Blueprint claim (V0): Rs 50,000 total, Rs 25,000 to bank account and Rs 25,000 as NSC; eligible widows aged 18 to 50. Status and conditions unknown. Remarriage status is sensitive; aggregate-only and strong small-number suppression required.

## Fields to capture per scheme during TASK-004
Official Gujarati and English name; department; implementing authority; status; latest GR number and date; latest guidelines; objectives; eligibility (age, income, residence, other); documents; benefits by type and amount; application method and portal; beneficiary definition; reporting process; availability of district, taluka and village statistics; official URL; publication/update date; retrieved date; verification status; replacement scheme if discontinued.

## Handling of changes
If a scheme is renamed, merged or discontinued: set schemes.status, close the scheme_versions row with effective_to, keep statistics under the version in force, and propose the officially named replacement in open-questions.md. Do not delete.

## Sensitive-category note
Widowhood, remarriage and pregnancy are sensitive. See privacy.md#small-number-suppression: for S2, S4, S5 the suppression threshold is stricter (see ADR-0010).
