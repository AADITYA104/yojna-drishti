# Yojana Drishti (યોજના દૃષ્ટિ)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FAADITYA104%2Fyojna-drishti)

Gujarati-first geographic intelligence dashboard for exploring women and child welfare scheme reach across Gujarat (District → Taluka → Village).

> **DEMO Notice:** This application operates in DEMO mode with synthetic sample metrics. Figures and coverage markers are illustrative fixtures and do not represent official government decisions, verified individual beneficiaries, or legal entitlements. Administrative boundaries are aligned with Local Government Directory (LGD) / Census hierarchies.

## Workspaces & Architecture

The application provides 6 primary workspaces in the spatial navigation dock, plus contextual deep-dive views:

1. **મુખ્ય ડેશબોર્ડ (Main Dashboard):** Executive KPIs, top schemes, district comparison, and direct access to spatial exploration.
2. **બધી યોજનાઓ (All Schemes):** Comprehensive catalogue of key Gujarat women schemes (Vahali Dikri, Ganga Swarupa, Mahila Swavlamban, Mukhyamantri Matrushakti, Ganga Swarupa Punarlagna, etc.) with eligibility criteria and benefits.
3. **ગુજરાત ભૌગોલિક નકશો (Gujarat Map):** Interactive multi-level GIS map drill-down from Gujarat (33 districts) to Taluka and Village levels with administrative boundary highlighting.
4. **સ્માર્ટ પાત્રતા નિર્ધારક (Smart Eligibility):** Step-by-step citizen eligibility checker matching user criteria with active welfare schemes.
5. **ડેટાસેટ વિશ્લેષણ (Dataset Analytics):** Deep-dive dataset inspection and scheme record viewer connected to local LGD village records.
6. **ડેટા ગવર્નન્સ (Data Governance):** Administrative provenance, pipeline audit logs, and data readiness metrics.

### Contextual Drill-Down Views
- **ગામ વિશ્લેષણ (Village Intelligence):** 18,818+ real Census/LGD village records, Bhavnagar Ghogha pilot data, and village-level scheme registers.
- **તાલુકા અને જિલ્લા વિશ્લેષણ (Taluka & District Intelligence):** Granular administrative comparisons and demographic breakdowns.

## Screenshots

Interface screenshots are archived in [`docs/screenshots/`](docs/screenshots/).

## Start Locally

1. **Prerequisites:** Node.js 20.9+ (PostgreSQL with PostGIS optional).
2. **Setup:**
   ```bash
   npm install
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Verification Commands:**
   ```bash
   npm test
   npm run typecheck
   npm run lint
   npm run build
   ```

4. **Optional Database Setup:**
   ```bash
   docker compose up -d db
   npm run db:migrate
   npm run db:seed:demo
   ```

## License

This project is licensed under the [MIT License](LICENSE).
