import re

IMAGE2_SPECS = {
    "ahmedabad": {"no": "01", "area": 8719, "talukas": 21},
    "amreli": {"no": "02", "area": 6577, "talukas": 11},
    "anand": {"no": "03", "area": 2654, "talukas": 8},
    "aravalli": {"no": "04", "area": 3068, "talukas": 7},
    "banaskantha": {"no": "05", "area": 12057, "talukas": 14},
    "bharuch": {"no": "06", "area": 5235, "talukas": 10},
    "bhavnagar": {"no": "07", "area": 10643, "talukas": 10},
    "botad": {"no": "08", "area": 2138, "talukas": 6},
    "chhotaudepur": {"no": "09", "area": 3868, "talukas": 7},
    "dahod": {"no": "10", "area": 3737, "talukas": 9},
    "dang": {"no": "11", "area": 1764, "talukas": 4},
    "devbhumi_dwarka": {"no": "12", "area": 4297, "talukas": 4},
    "gandhinagar": {"no": "13", "area": 2148, "talukas": 4},
    "gir_somnath": {"no": "14", "area": 5444, "talukas": 9},
    "jamnagar": {"no": "15", "area": 14184, "talukas": 10},
    "junagadh": {"no": "16", "area": 8827, "talukas": 10},
    "kutch": {"no": "17", "area": 45652, "talukas": 10},
    "kheda": {"no": "18", "area": 3988, "talukas": 11},
    "mahisagar": {"no": "19", "area": 2622, "talukas": 7},
    "mehsana": {"no": "20", "area": 5957, "talukas": 10},
    "morbi": {"no": "21", "area": 4976, "talukas": 5},
    "narmada": {"no": "22", "area": 2750, "talukas": 5},
    "navsari": {"no": "23", "area": 2248, "talukas": 5},
    "panchmahal": {"no": "24", "area": 6003, "talukas": 6},
    "patan": {"no": "25", "area": 5750, "talukas": 8},
    "porbandar": {"no": "26", "area": 2295, "talukas": 5},
    "rajkot": {"no": "27", "area": 11203, "talukas": 11},
    "sabarkantha": {"no": "28", "area": 7398, "talukas": 10},
    "surat": {"no": "29", "area": 4418, "talukas": 10},
    "surendranagar": {"no": "30", "area": 10486, "talukas": 10},
    "tapi": {"no": "31", "area": 2003, "talukas": 5},
    "vadodara": {"no": "32", "area": 7548, "talukas": 10},
    "valsad": {"no": "33", "area": 3035, "talukas": 6},
    "vav_tharad": {"no": "34", "area": 1779, "talukas": 5},
}

with open("src/lib/demo-data.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Update District type definition
if "officialNo: string;" not in content:
    content = content.replace(
        "export type District = {\n  id: string;\n  name: string;\n  gu: string;\n  code: string;",
        "export type District = {\n  officialNo: string;\n  id: string;\n  name: string;\n  gu: string;\n  code: string;\n  areaKm2: number;"
    )

# Replace all code: "GJ-xx" in demoDistricts with official numbers
for dist_id, spec in IMAGE2_SPECS.items():
    no = spec["no"]
    area = spec["area"]
    # Look for id: "dist_id"
    pattern = rf'(id:\s*"{dist_id}",\s*name:\s*"[^"]+",\s*gu:\s*"[^"]+",\s*)code:\s*"GJ-\d+",'
    replacement = rf'\1officialNo: "{no}",\n    code: "{no}",\n    areaKm2: {area},'
    content = re.sub(pattern, replacement, content)

with open("src/lib/demo-data.ts", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated src/lib/demo-data.ts with Image 2 official numbers and areas!")
