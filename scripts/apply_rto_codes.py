import re

RTO_MAPPING = {
    "ahmedabad": "GJ-01",
    "mehsana": "GJ-02",
    "rajkot": "GJ-03",
    "bhavnagar": "GJ-04",
    "surat": "GJ-05",
    "vadodara": "GJ-06",
    "kheda": "GJ-07",
    "banaskantha": "GJ-08",
    "sabarkantha": "GJ-09",
    "jamnagar": "GJ-10",
    "junagadh": "GJ-11",
    "kutch": "GJ-12",
    "surendranagar": "GJ-13",
    "amreli": "GJ-14",
    "valsad": "GJ-15",
    "bharuch": "GJ-16",
    "panchmahal": "GJ-17",
    "gandhinagar": "GJ-18",
    "dahod": "GJ-20",
    "navsari": "GJ-21",
    "narmada": "GJ-22",
    "anand": "GJ-23",
    "patan": "GJ-24",
    "porbandar": "GJ-25",
    "tapi": "GJ-26",
    "dang": "GJ-30",
    "aravalli": "GJ-31",
    "gir_somnath": "GJ-32",
    "botad": "GJ-33",
    "chhotaudepur": "GJ-34",
    "mahisagar": "GJ-35",
    "morbi": "GJ-36",
    "devbhumi_dwarka": "GJ-37",
    "vav_tharad": "GJ-39",
}

# 1. Update demo-data.ts
with open('yojana-drishti/src/lib/demo-data.ts', 'r', encoding='utf-8') as f:
    text = f.read()

for dist_id, rto_code in RTO_MAPPING.items():
    # Update officialNo and code in demoDistricts
    pattern = rf'(id:\s*"{dist_id}",[\s\S]*?officialNo:\s*)"[^"]+"([\s\S]*?code:\s*)"[^"]+"'
    text = re.sub(pattern, rf'\g<1>"{rto_code}"\g<2>"{rto_code}"', text)

with open('yojana-drishti/src/lib/demo-data.ts', 'w', encoding='utf-8') as f:
    f.write(text)
print("Updated demo-data.ts with RTO codes!")

# 2. Update master-hierarchy.ts
with open('yojana-drishti/src/lib/master-hierarchy.ts', 'r', encoding='utf-8') as f:
    mtext = f.read()

for dist_id, rto_code in RTO_MAPPING.items():
    pattern = rf'("officialNo":\s*)"[^"]+"(,\s*"code":\s*\d+,\s*"id":\s*"{dist_id}")'
    mtext = re.sub(pattern, rf'\g<1>"{rto_code}"\g<2>', mtext)

with open('yojana-drishti/src/lib/master-hierarchy.ts', 'w', encoding='utf-8') as f:
    f.write(mtext)
print("Updated master-hierarchy.ts with RTO codes!")
