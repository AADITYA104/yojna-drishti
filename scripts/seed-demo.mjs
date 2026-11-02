import { pool } from "../src/server/db/client.mjs";
const sourceId = "d0000000-0000-4000-8000-000000000001";
const stateId = "d0000000-0000-4000-8000-000000000002";
const districts = [
  ["DEMO-01", "Ahmedabad", "અમદાવાદ"], ["DEMO-02", "Surat", "સુરત"],
  ["DEMO-03", "Vadodara", "વડોદરા"], ["DEMO-04", "Bhavnagar", "ભાવનગર"],
  ["DEMO-05", "Rajkot", "રાજકોટ"], ["DEMO-06", "Kutch", "કચ્છ"],
  ["DEMO-07", "Junagadh", "જૂનાગઢ"], ["DEMO-08", "Banaskantha", "બનાસકાંઠા"],
];
const schemes = [
  ["YD-CAND-01", "Vahali Dikri Yojana", "વ્હાલી દીકરી યોજના"],
  ["YD-CAND-02", "Ganga Swarupa Arthik Sahay Yojana", "ગંગા સ્વરૂપા આર્થિક સહાય યોજના"],
  ["YD-CAND-03", "Mahila Swavlamban Yojana", "મહિલા સ્વાવલંબન યોજના"],
  ["YD-CAND-04", "Mukhyamantri Matrushakti Yojana", "મુખ્યમંત્રી માતૃશક્તિ યોજના"],
  ["YD-CAND-05", "Ganga Swarupa Punarlagna Arthik Sahay Yojana", "ગંગા સ્વરૂપા પુનર્લગ્ન આર્થિક સહાય યોજના"],
];

try {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(`INSERT INTO data_sources(id, name, licence, verification_status, retrieved_at)
      VALUES ($1, 'Synthetic UI fixtures', 'Not a real dataset; local demo only', 'DEMO', now())
      ON CONFLICT (id) DO NOTHING`, [sourceId]);
    await client.query(`INSERT INTO geographic_units(id, lgd_code, level, name_en, name_gu, source_id)
      VALUES ($1, 'DEMO-GJ', 'STATE', 'Gujarat (Demo)', 'ગુજરાત (ડેમો)', $2)
      ON CONFLICT (lgd_code) DO NOTHING`, [stateId, sourceId]);
    for (let i = 0; i < districts.length; i++) {
      const [code, name, gu] = districts[i];
      const id = `d0000000-0000-4000-8000-${String(i + 10).padStart(12, "0")}`;
      await client.query(`INSERT INTO geographic_units(id, lgd_code, level, parent_id, name_en, name_gu, source_id)
        VALUES ($1, $2, 'DISTRICT', $3, $4, $5, $6)
        ON CONFLICT (lgd_code) DO NOTHING`, [id, code, stateId, name, gu, sourceId]);
    }
    for (const [code, name, gu] of schemes) {
      await client.query(`INSERT INTO schemes(code, name_en, name_gu, verification_status, active, source_id)
        VALUES ($1, $2, $3, 'UNVERIFIED', false, $4)
        ON CONFLICT (code) DO NOTHING`, [code, name, gu, sourceId]);
    }
    await client.query("COMMIT");
    process.stdout.write("Loaded synthetic DEMO geography labels and unverified candidate scheme names. No statistics or official boundaries were seeded.\n");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally { client.release(); }
} finally { await pool.end(); }
