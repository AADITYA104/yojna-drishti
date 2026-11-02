import re

# 1. Update demo-data.ts
with open('yojana-drishti/src/lib/demo-data.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace Bhavnagar villageCount 662 -> 526, talukaCount 11 -> 10
text = re.sub(
    r'(id:\s*"bhavnagar",[\s\S]*?talukaCount:\s*)\d+([\s\S]*?villageCount:\s*)\d+',
    r'\g<1>10\g<2>526',
    text
)

# Replace Ahmedabad villageCount 548 -> 832, talukaCount 10 -> 21
text = re.sub(
    r'(id:\s*"ahmedabad",[\s\S]*?talukaCount:\s*)\d+([\s\S]*?villageCount:\s*)\d+',
    r'\g<1>21\g<2>832',
    text
)

with open('yojana-drishti/src/lib/demo-data.ts', 'w', encoding='utf-8') as f:
    f.write(text)
print("Updated demo-data.ts!")

# 2. Update master-hierarchy.ts
with open('yojana-drishti/src/lib/master-hierarchy.ts', 'r', encoding='utf-8') as f:
    mtext = f.read()

# Ahmedabad subDistrictCount -> 21, villageCount -> 832
mtext = re.sub(
    r'("id":\s*"ahmedabad",[\s\S]*?"subDistrictCount":\s*)\d+([\s\S]*?"villageCount":\s*)\d+',
    r'\g<1>21\g<2>832',
    mtext
)

# Bhavnagar subDistrictCount -> 10, villageCount -> 526
mtext = re.sub(
    r'("id":\s*"bhavnagar",[\s\S]*?"subDistrictCount":\s*)\d+([\s\S]*?"villageCount":\s*)\d+',
    r'\g<1>10\g<2>526',
    mtext
)

with open('yojana-drishti/src/lib/master-hierarchy.ts', 'w', encoding='utf-8') as f:
    f.write(mtext)
print("Updated master-hierarchy.ts!")
