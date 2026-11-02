import shutil
import os

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

base_dir = "yojana-drishti/public/images/districts"

for dist_id, rto_code in RTO_MAPPING.items():
    # Source might be named {dist_id}.jpg
    src1 = os.path.join(base_dir, f"{dist_id}.jpg")
    dst_rto = os.path.join(base_dir, f"{rto_code}.jpg")
    dst_clean = os.path.join(base_dir, f"{rto_code.replace('-', '')}.jpg")
    
    if os.path.exists(src1):
        shutil.copy(src1, dst_rto)
        shutil.copy(src1, dst_clean)
        print(f"Copied {dist_id} -> {dst_rto}")

print("RTO images configured!")
