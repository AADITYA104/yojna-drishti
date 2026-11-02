with open("src/lib/demo-data.ts", "r", encoding="utf-8") as f:
    text = f.read()

old_str = '''    id: "chhota_udepur",
    name: "Chhota Udaipur",
    gu: "છોટા ઉદેપુર",
    code: "GJ-23",'''

new_str = '''    id: "chhota_udepur",
    name: "Chhota Udaipur",
    gu: "છોટા ઉદેપુર",
    officialNo: "09",
    code: "09",
    areaKm2: 3868,'''

if old_str in text:
    text = text.replace(old_str, new_str)
    with open("src/lib/demo-data.ts", "w", encoding="utf-8") as f:
        f.write(text)
    print("Replaced successfully!")
else:
    print("old_str not found")
