import pypdf
import re
import json
import os
import sys

PDF_PATH = r"C:\Users\devmu\Downloads\Gujarat_District_Taluka_Village_Master_Directory_01Nov2026.pdf"
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "data", "hierarchy")
VILLAGES_DIR = os.path.join(OUTPUT_DIR, "villages")

os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(VILLAGES_DIR, exist_ok=True)

reader = pypdf.PdfReader(PDF_PATH)
print(f"Loaded PDF with {len(reader.pages)} pages.")

districts_dict = {}
subdistricts_dict = {}
villages_by_subdistrict = {}

curr_district = None
curr_subdistrict = None

district_header_re = re.compile(r"District code:\s*(\d+)\s*\|\s*Sub-district records:\s*(\d+)\s*\|\s*Village records:\s*(\d+)")
subdistrict_header_re = re.compile(r"^(.*?)\s*\|\s*Sub-district code:\s*(\d+)\s*\|\s*Village records:\s*(\d+)")

categories = {"Rural", "Urban", "Both"}
statuses = {"Inhabitant", "Un-Inhabitant", "Forest"}

gu_district_names = {
    "Ahmedabad": "અમદાવાદ",
    "Amreli": "અમરેલી",
    "Anand": "આણંદ",
    "Arvalli": "અરવલ્લી",
    "Banas Kantha": "બનાસકાંઠા",
    "Bharuch": "ભરૂચ",
    "Bhavnagar": "ભાવનગર",
    "Botad": "બોટાદ",
    "Chhotaudepur": "છોટાઉદેપુર",
    "Dahod": "દાહોદ",
    "Dangs": "ડાંગ",
    "Devbhumi Dwarka": "દેવભૂમિ દ્વારકા",
    "Gandhinagar": "ગાંધીનગર",
    "Gir Somnath": "ગીર સોમનાથ",
    "Jamnagar": "જામનગર",
    "Junagadh": "જુનાગઢ",
    "Kachchh": "કચ્છ",
    "Kheda": "ખેડા",
    "Mahesana": "મહેસાણા",
    "Mahisagar": "મહીસાગર",
    "Morbi": "મોરબી",
    "Narmada": "નર્મદા",
    "Navsari": "નવસારી",
    "Panch Mahals": "પંચમહાલ",
    "Patan": "પાટણ",
    "Porbandar": "પોરબંદર",
    "Rajkot": "રાજકોટ",
    "Sabar Kantha": "સાબરકાંઠા",
    "Surat": "સુરત",
    "Surendranagar": "સુરેન્દ્રનગર",
    "Tapi": "તાપી",
    "Vadodara": "વડોદરા",
    "Valsad": "વલસાડ",
    "Vav-Tharad": "વાવ-થરાદ"
}

# Gujarati transliteration/names for common talukas
gu_subdistrict_names = {
    "Bhavnagar": "ભાવનગર",
    "Sihor": "સિહોર",
    "Umrala": "ઉમરાળા",
    "Gariadhar": "ગારીયાધાર",
    "Palitana": "પાલીતાણા",
    "Mahuva": "મહુવા",
    "Talaja": "તળાજા",
    "Ghogha": "ઘોઘા",
    "Jesar": "જેસર",
    "Vallabhipur": "વલ્લભીપુર",
    "Bhavnagar City": "ભાવનગર શહેર",
    "Asarva": "અસારવા",
    "Bavla": "બાવળા",
    "Daskroi": "દસક્રોઈ",
    "Detroj-Rampura": "દેત્રોજ-રામપુરા",
    "Dhandhuka": "ધંધુકા",
    "Dholera": "ધોલેરા",
    "Dholka": "ધોળકા",
    "Ghatlodiya": "ઘાટલોડિયા",
    "Mandal": "માંડલ",
    "Maninagar": "મણિનગર",
    "Sabarmati": "સાબરમતી",
    "Sanand": "સાણંદ",
    "Vatva": "વાટવા",
    "Vejalpur": "વેજલપુર",
    "Viramgam": "વિરમગામ",
    "Rajkot": "રાજકોટ",
    "Gondal": "ગોંડલ",
    "Jetpur": "જેતપુર",
    "Dhoraji": "ધોરાજી",
    "Upleta": "ઉપલેટા",
    "Morbi": "મોરબી",
    "Wankaner": "વાંકાનેર",
    "Halvad": "હળવદ",
    "Maliya": "માળિયા",
    "Tankara": "ટંકારા",
    "Surat City": "સુરત શહેર",
    "Chorasi": "ચોર્યાસી",
    "Olpad": "ઓલપાડ",
    "Kamrej": "કામરેજ",
    "Bardoli": "બારડોલી",
    "Mahuva": "મહુવા",
    "Mandvi": "માંડવી",
    "Mangrol": "માંગરોળ",
    "Umarpada": "ઉમરપાડા",
    "Palsana": "પલસાણા",
    "Vadodara": "વડોદરા",
    "Padra": "પાદરા",
    "Karjan": "કરજણ",
    "Dabhoi": "ડભોઇ",
    "Vaghodia": "વાઘોડિયા",
    "Savli": "સાવલી",
    "Sinor": "શિનોર",
    "Desar": "ડેસર",
    "Anand": "આણંદ",
    "Petlad": "પેટલાદ",
    "Khambhat": "ખંભાત",
    "Borsad": "બોરસદ",
    "Umreth": "ઉમરેઠ",
    "Anklav": "આંકલાવ",
    "Sojitra": "સોજિત્રા",
    "Tarapur": "તારાપુર"
}

for p_num in range(4, len(reader.pages)):
    text = reader.pages[p_num].extract_text()
    if not text:
        continue
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    
    i = 0
    while i < len(lines):
        line = lines[i]
        
        # Check district code line
        d_match = district_header_re.search(line)
        if d_match:
            d_code = int(d_match.group(1))
            d_sub_cnt = int(d_match.group(2))
            d_vil_cnt = int(d_match.group(3))
            prev_line = lines[i-1] if i > 0 else ""
            d_name = prev_line.replace(" District", "").strip()
            if d_code not in districts_dict:
                districts_dict[d_code] = {
                    "code": d_code,
                    "nameEn": d_name,
                    "nameGu": gu_district_names.get(d_name, d_name),
                    "subDistrictCount": d_sub_cnt,
                    "villageCount": d_vil_cnt
                }
            curr_district = d_code
            i += 1
            continue
            
        # Check subdistrict line
        s_match = subdistrict_header_re.search(line)
        if s_match:
            s_name = s_match.group(1).strip()
            s_code = int(s_match.group(2))
            s_vil_cnt = int(s_match.group(3))
            curr_subdistrict = s_code
            if s_code not in subdistricts_dict:
                d_info = districts_dict.get(curr_district, {})
                subdistricts_dict[s_code] = {
                    "code": s_code,
                    "nameEn": s_name,
                    "nameGu": gu_subdistrict_names.get(s_name, s_name),
                    "districtCode": curr_district,
                    "districtNameEn": d_info.get("nameEn", ""),
                    "districtNameGu": d_info.get("nameGu", ""),
                    "villageCount": s_vil_cnt
                }
            if s_code not in villages_by_subdistrict:
                villages_by_subdistrict[s_code] = []
            i += 1
            continue
            
        # Check if line is a 6-digit village code
        if re.match(r"^\d{6}$", line):
            v_code = line
            if i + 1 < len(lines):
                v_name = lines[i+1]
                cat = "Rural"
                stat = "Inhabitant"
                jump = 2
                for k in range(2, 6):
                    if i + k < len(lines):
                        token = lines[i+k]
                        if token in categories:
                            cat = token
                        elif token in statuses:
                            stat = token
                            jump = k + 1
                            break
                        elif re.match(r"^\d{6}$", token) or "Sub-district code:" in token or "District code:" in token:
                            jump = k
                            break
                if curr_subdistrict:
                    villages_by_subdistrict[curr_subdistrict].append({
                        "code": v_code,
                        "nameEn": v_name,
                        "subDistrictCode": curr_subdistrict,
                        "districtCode": curr_district,
                        "category": cat,
                        "status": stat
                    })
                i += jump
                continue

        i += 1

print(f"Extracted {len(districts_dict)} districts, {len(subdistricts_dict)} subdistricts.")
total_vils = sum(len(v) for v in villages_by_subdistrict.values())
print(f"Extracted {total_vils} villages.")

# Save districts.json
districts_list = sorted(districts_dict.values(), key=lambda d: d["code"])
with open(os.path.join(OUTPUT_DIR, "districts.json"), "w", encoding="utf-8") as f:
    json.dump(districts_list, f, ensure_ascii=False, indent=2)

# Save subdistricts.json
subdistricts_list = sorted(subdistricts_dict.values(), key=lambda s: (s["districtCode"], s["nameEn"]))
with open(os.path.join(OUTPUT_DIR, "subdistricts.json"), "w", encoding="utf-8") as f:
    json.dump(subdistricts_list, f, ensure_ascii=False, indent=2)

# Save per-subdistrict village files
for s_code, v_list in villages_by_subdistrict.items():
    file_path = os.path.join(VILLAGES_DIR, f"{s_code}.json")
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(v_list, f, ensure_ascii=False, indent=2)

print("Saved all JSON files to public/data/hierarchy/")
