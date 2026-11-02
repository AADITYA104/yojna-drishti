import re

# 1. Update demo-data.ts
with open('yojana-drishti/src/lib/demo-data.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Gandhinagar: villageCount -> 168
text = re.sub(
    r'(id:\s*"gandhinagar",[\s\S]*?villageCount:\s*)\d+',
    r'\g<1>168',
    text
)

# Vadodara: areaKm2 -> 7550, talukaCount -> 8, villageCount -> 358
text = re.sub(
    r'(id:\s*"vadodara",[\s\S]*?areaKm2:\s*)\d+([\s\S]*?talukaCount:\s*)\d+([\s\S]*?villageCount:\s*)\d+',
    r'\g<1>7550\g<2>8\g<3>358',
    text
)

with open('yojana-drishti/src/lib/demo-data.ts', 'w', encoding='utf-8') as f:
    f.write(text)
print("Updated demo-data.ts!")

# 2. Update master-hierarchy.ts
with open('yojana-drishti/src/lib/master-hierarchy.ts', 'r', encoding='utf-8') as f:
    mtext = f.read()

# Gandhinagar
mtext = re.sub(
    r'("id":\s*"gandhinagar",[\s\S]*?"villageCount":\s*)\d+',
    r'\g<1>168',
    mtext
)

# Vadodara
mtext = re.sub(
    r'("id":\s*"vadodara",[\s\S]*?"subDistrictCount":\s*)\d+([\s\S]*?"villageCount":\s*)\d+',
    r'\g<1>8\g<2>358',
    mtext
)

with open('yojana-drishti/src/lib/master-hierarchy.ts', 'w', encoding='utf-8') as f:
    f.write(mtext)
print("Updated master-hierarchy.ts!")
