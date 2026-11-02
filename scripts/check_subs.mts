import { MASTER_DISTRICTS, getSubdistrictsForDistrict } from "../src/lib/master-hierarchy";

for (const id of ["bhavnagar", "ahmedabad", "gandhinagar", "vadodara"]) {
  const subs = getSubdistrictsForDistrict(id);
  console.log(`=== ${id} (${subs.length} subdistricts) ===`);
  for (const s of subs) {
    console.log(`  code: ${s.code}, nameEn: "${s.nameEn}", nameGu: "${s.nameGu}"`);
  }
}
