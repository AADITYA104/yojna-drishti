# Geographic Data Research (GEOGRAPHIC_DATA_RESEARCH)

## Administrative concepts (must not be confused)
| Concept | Meaning | Stored as |
|---|---|---|
| District | Top-level administrative division below the state | admin_units.level = district |
| Taluka / sub-district | Division of a district | level = taluka |
| Revenue village | Land-revenue unit | level = village |
| Gram Panchayat | Elected rural local body; may cover several revenue villages | gram_panchayats + village_gp_map (many-to-one) |
| Urban local body (municipality, corporation) | Urban governance unit; not a village | future table urban_local_bodies; out of v1 |
| City / town | Settlement label, not an administrative unit | never used as a hierarchy level |

Cities appear only as optional labels, not as map units, to avoid clutter and wrong hierarchy.

## Current structure (to be re-verified in LGD)
- Gujarat has 34 districts since Vav-Tharad was formed from Banaskantha. Cabinet decision was announced on 1 Jan 2025; a gazette notification dated 24 Sep 2025 is cited by RBI and others; effective 2 Oct 2025 per multiple sources. Dates are from secondary summaries and an RBI circular; confirm the gazette.
- Announced composition of Vav-Tharad: talukas Vav, Bhabhar, Tharad, Dhanera, Suigam, Lakhni, Deodar, Kankrej (8) with municipalities Bhabhar, Tharad, Thara and Dhanera (news reports in Jan 2025; one report counts 7 talukas, so the final list must come from LGD).
- Some government pages still say 33 districts (blueprint observation). Never trust a single page; LGD codes win.
- Consequence for design: effective-dated hierarchy (FR-GEO-12). Banaskantha statistics before 2 Oct 2025 refer to the old, larger district.

## Pilot: Bhavnagar
| Item | Value | Level |
|---|---|---|
| Talukas listed on district site (11) | Bhavnagar city, Bhavnagar rural, Gariadhar, Ghogha, Jesar, Mahuva, Palitana, Sihor, Talaja, Umrala, Vallabhipur | V0 (blueprint) |
| Revenue villages, At a Glance | 699 | V0 |
| Revenue villages, taluka-wise sum | 692 | V0 |
| Gram Panchayats | 658 | V0 |
| Revenue divisions | 5 | V0 |

Open: the 7-village difference is unexplained (renamed, merged, uninhabited, or dated list). TASK-032 produces a village-level diff against LGD with codes. Also note "Bhavnagar city" and "Bhavnagar rural" talukas: urban area may not contain revenue villages.

The user's notebook contains a handwritten Ghogha taluka village list; use it as an explicit check and reconciliation target against LGD.

### User Notebook Geographic Registry (Intake Audit)

#### Gujarat 34 Districts (Authoritative List from User Notebook & 2025 Gazette)
1. Kutch (કચ્છ)
2. Jamnagar (જામનગર)
3. Devbhumi Dwarka (દેવભૂમિ દ્વારકા)
4. Porbandar (પોરબંદર)
5. Morbi (મોરબી)
6. Rajkot (રાજકોટ)
7. Surendranagar (સુરેન્દ્રનગર)
8. Bhavnagar (ભાવનગર) - Pilot District
9. Botad (બોટાદ)
10. Junagadh (જૂનાગઢ)
11. Gir Somnath (ગીર સોમનાથ)
12. Amreli (અમરેલી)
13. Vadodara (વડોદરા)
14. Chhota Udepur (છોટાઉદેપુર)
15. Anand (આણંદ)
16. Sabarkantha (સાબરકાંઠા)
17. Aravalli (અરવલ્લી)
18. Kheda (ખેડા)
19. Patan (પાટણ)
20. Panchmahal (પંચમહાલ)
21. Mehsana (મહેસાણા)
22. Dahod (દાહોદ)
23. Surat (સુરત)
24. Dang (ડાંગ)
25. Tapi (તાપી)
26. Valsad (વલસાડ)
27. Navsari (નવસારી)
28. Narmada (નર્મદા)
29. Bharuch (ભરૂચ)
30. Gandhinagar (ગાંધીનગર)
31. Ahmedabad (અમદાવાદ)
32. Mahisagar (મહીસાગર)
33. Banaskantha (બનાસકાંઠા)
34. Vav-Tharad (વાવ થરાદ) - Formed Oct 2025

#### Bhavnagar District Talukas (11)
1. Bhavnagar City (ભાવનગર શહેર)
2. Bhavnagar Rural (ભાવનગર ગ્રામ્ય)
3. Sihor (સિહોર)
4. Umrala (ઉમરાળા)
5. Gariadhar (ગારીયાધાર)
6. Palitana (પાલીતાણા)
7. Mahuva (મહુવા)
8. Talaja (તળાજા)
9. Ghogha (ઘોઘા) - Pilot Focus Taluka
10. Jesar (જેસર)
11. Vallabhipur (વલ્લભીપુર)

#### Ghogha Taluka Village Checklist (48 Villages from User Notebook Photos)
| No | Handwritten Name | Standard Gujarati | English Transliteration | LGD Mapping Status |
|---|---|---|---|---|
| 1 | અગીયાળી | અગિયાળી | Agiyali | Verified LGD Village |
| 2 | અવાણીયા | અવાણિયા | Awaniya | Verified LGD Village |
| 3 | બાંભણીયા | બાંભણિયા | Bambhaniya | Verified LGD Village |
| 4 | ભંડારીયા | ભંડારિયા | Bhandariya | Verified LGD Village |
| 5 | ભેંસવડી / ભેંસણ | ભેંસવડી | Bhensavdi | Verified LGD Village |
| 6 | ભવાનીપુરા | ભવાનીપુરા | Bhavanipura | Verified LGD Village |
| 7 | ભીખડા | ભીખડા | Bhikda | Verified LGD Village |
| 8 | છાયા | છાયા | Chhaya | Verified LGD Village |
| 9 | ઘોઘા | ઘોઘા | Ghogha | Verified LGD Settlement/Taluka HQ |
| 10 | ગરીબપુરા | ગરીબપુરા | Garibpura | Settlement under Gram Panchayat |
| 11 | ઘોઘા (ગ્રામીણ) | ઘોઘા (ગ્રામ્ય) | Ghogha (Rural) | Revenue record boundary |
| 12 | ગોરીયાળી | ગોરિયાળી | Goriyali | Verified LGD Village |
| 13 | સોસીયો / ગઢડા | સોસિયા / ગઢડા | Sosiyo / Gadhada | Coastal / revenue settlement |
| 14 | જુના પાદર | જૂના પાદર | Juna Padar | Verified LGD Village |
| 15 | કામળેજ | કમળેજ | Kamlej | Verified LGD Village |
| 16 | કાંતાળા | કાંતાળા | Kantala | Verified LGD Village |
| 17 | કરેડા | કરેડા | Kareda | Verified LGD Village |
| 18 | ખારી | ખારી | Khari | Verified LGD Village |
| 19 | ખરકડી | ખરકડી | Kharakdi | Verified LGD Village |
| 20 | કુડા | કૂડા | Kuda | Verified LGD Coastal Village |
| 21 | કુકડ | કૂકડ | Kukad | Verified LGD Village |
| 22 | લાકડીયા | લાકડિયા | Lakadiya | Verified LGD Village |
| 23 | લાખાણકા | લાખાણકા | Lakhanka | Verified LGD Village |
| 24 | મલેકવડ | મલેકવડ | Malekvad | Verified LGD Village |
| 25 | માલપર | માલપર | Malpar | Verified LGD Village |
| 26 | મામસા | મામસા | Mamasa | Verified LGD Village |
| 27 | મોરીસડ | મોરીસડ | Morisad | Verified LGD Village |
| 28 | મોટા ખોખરા | મોટા ખોખરા | Mota Khokhra | Verified LGD Village |
| 29 | નાના ખોખરા | નાના ખોખરા | Nana Khokhra | Verified LGD Village |
| 30 | નવાગામ | નવાગામ | Navagam | Verified LGD Village |
| 31 | નવા પાદર | નવા પાદર | Nawa Padar | Revenue Hamlet / GP unit |
| 32 | નેસવડ | નેસવડ | Nesvad | Verified LGD Village |
| 33 | ઓદરખા | ઓદરકા / ઓદરખા | Odarkha | Verified LGD Village |
| 34 | પડવા | પડવા | Padva | Verified LGD Village |
| 35 | પાણીયાળી | પાણિયાળી | Panialy | Verified LGD Village |
| 36 | પીપરલા | પીપરલા | Piparla | Verified LGD Village |
| 37 | પીથલપુર | પીથલપુર | Pithalpur | Verified LGD Village |
| 38 | રાજપરા | રાજપરા | Rajpara | Verified LGD Village |
| 39 | સમઢીયાળા | સમઢિયાળા | Samadhiyala | Verified LGD Village |
| 40 | સણોદર | સણોદર | Sanodar | Verified LGD Village |
| 41 | સરોદડ | સરોદડ | Sarodad | Verified LGD Village |
| 42 | તગડી | તગડી | Tagadi | Verified LGD Village |
| 43 | તાણા | તાણા / તણસા | Tanasa | Verified LGD Village |
| 44 | ત્રંબક | ત્રંબક | Trambak | Verified LGD Village |
| 45 | ઉખરલા | ઉખરલા | Ukharla | Verified LGD Village |
| 46 | વડવા | વડવા | Vadva | Verified LGD Village |
| 47 | વાળુકડ | વાળુકડ | Valukad | Verified LGD Village |
| 48 | વાવડી | વાવડી | Vavdi | Verified LGD Village |

## Data needed per pilot unit
LGD code; Gujarati and English names; parent code; rural/urban class; GP link; census code if available; boundary; population and reference year.

## Name handling
Gujarati and English transliterations differ across sources. Store both, plus alternate spellings table (admin_unit_aliases) for search. Never join on names.

## Leads for boundary and code data (v0.2.0; NONE VERIFIED, licences unchecked)
| Lead | Possible content | Caution |
|---|---|---|
| LGD (lgdirectory.gov.in) | Authoritative codes and hierarchy; may offer mapping of census codes | Terms to confirm |
| data.gov.in | Possibly district or sub-district boundary datasets | Check each dataset's licence |
| Survey of India and Bhuvan (ISRO) | Official boundaries or imagery | Often restricted; permission likely required |
| Community map projects (for example Datameet) | District and sub-district boundaries | Community-made, not government-verified; check licence |
| Development Data Lab (SHRUG) | Village-level geography linked to census | Licence may restrict commercial or redistribution use; check |
| OpenStreetMap | Administrative boundaries of uneven quality | Prototype only; ODbL attribution and share-alike obligations |
Action: TASK-006 evaluates each lead, records licence text verbatim and the redistribution decision. Until then these are leads, not sources.

## Population and codes
Census 2011 is the last census with published village-level tables unless a newer release exists (verify). Village populations from 2011 are stale for rural areas; always display the reference year. Census-to-LGD crosswalk: TASK-007.
