import re

with open("src/lib/demo-data.ts", "r", encoding="utf-8") as f:
    lines = f.readlines()

in_districts = False
missing = []
for i, line in enumerate(lines):
    if "export const demoDistricts: District[] = [" in line:
        in_districts = True
        continue
    if in_districts and "export const demoTalukas" in line:
        in_districts = False
        break
    if in_districts and re.match(r'^\s*\{\s*$', line):
        # Scan next 15 lines for officialNo
        block = "".join(lines[i:i+15])
        if "officialNo:" not in block:
            m_id = re.search(r'id:\s*"([^"]+)"', block)
            if m_id:
                missing.append((i+1, m_id.group(1)))

print("Missing officialNo in demo-data.ts:", missing)
