"use client";

import React, { useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Database,
  RefreshCw,
  ShieldCheck,
  UploadCloud,
} from "lucide-react";

type HierarchyCheck = {
  districts: number;
  talukas: number;
  ghoghaVillages: number;
  checkedAt: string;
};

type FileCheck = { name: string; rows: number; message: string };

function parseCsv(text: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (character === '"') {
      if (quoted && text[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === "," && !quoted) {
      row.push(cell.trim());
      cell = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && text[index + 1] === "\n") index += 1;
      row.push(cell.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += character;
    }
  }
  row.push(cell.trim());
  if (row.some(Boolean)) rows.push(row);
  if (quoted) throw new Error("CSV contains an unclosed quoted field.");
  return rows;
}

async function validateDataset(file: File): Promise<FileCheck> {
  if (file.size > 50 * 1024 * 1024) throw new Error("File exceeds the 50 MB limit.");
  const extension = file.name.split(".").pop()?.toLowerCase();
  const text = await file.text();

  if (extension === "csv") {
    const rows = parseCsv(text);
    const headers = rows[0]?.map((header) => header.toLocaleLowerCase().replace(/[^a-z0-9\u0a80-\u0aff]/g, "")) || [];
    if (headers.length < 2 || headers.some((header) => !header)) {
      throw new Error("CSV needs a header row with at least two named columns.");
    }
    if (new Set(headers).size !== headers.length) throw new Error("CSV header contains duplicate columns.");
    const identityHeaders = new Set([
      "district", "districtid", "districtcode", "lgdcode", "unitcode",
      "subdistrictcode", "talukacode", "villagecode", "schemeid",
      "જિલ્લો", "જિલ્લાકોડ", "lgdકોડ", "એલજીડીકોડ", "તાલુકાકોડ", "ગામકોડ", "યોજનાકોડ",
    ]);
    if (!headers.some((header) => identityHeaders.has(header))) {
      throw new Error("Add a geography or scheme key column (for example lgd_code, village_code, or scheme_id).");
    }
    const records = rows.slice(1);
    const malformed = records.findIndex((record) => record.length !== headers.length);
    if (malformed >= 0) throw new Error(`CSV row ${malformed + 2} has ${records[malformed].length} values; expected ${headers.length}.`);
    if (records.length === 0) throw new Error("CSV has headers but no data rows.");
    return { name: file.name, rows: records.length, message: "CSV structure and row widths are valid." };
  }

  if (extension === "geojson") {
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new Error("GeoJSON is not valid JSON.");
    }
    if (!parsed || typeof parsed !== "object") throw new Error("GeoJSON must be a FeatureCollection.");
    const collection = parsed as { type?: string; features?: unknown[] };
    if (collection.type !== "FeatureCollection" || !Array.isArray(collection.features) || collection.features.length === 0) {
      throw new Error("GeoJSON must contain a non-empty FeatureCollection.");
    }
    const invalidIndex = collection.features.findIndex((item) => {
      if (!item || typeof item !== "object") return true;
      const feature = item as { type?: string; geometry?: { type?: string; coordinates?: unknown }; properties?: unknown };
      return feature.type !== "Feature" || !feature.geometry?.type || !Array.isArray(feature.geometry.coordinates) || !feature.properties || typeof feature.properties !== "object";
    });
    if (invalidIndex >= 0) throw new Error(`Feature ${invalidIndex + 1} needs a geometry and properties object.`);
    return { name: file.name, rows: collection.features.length, message: "GeoJSON FeatureCollection structure is valid." };
  }

  throw new Error("Choose a .csv or .geojson file. Shapefile archives are not supported in this browser preview.");
}

export function DataManagementView({ gu }: { gu: boolean }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [checking, setChecking] = useState(false);
  const [hierarchy, setHierarchy] = useState<HierarchyCheck | null>(null);
  const [hierarchyError, setHierarchyError] = useState("");
  const [fileCheck, setFileCheck] = useState<FileCheck | null>(null);
  const [fileError, setFileError] = useState("");
  const [fileBusy, setFileBusy] = useState(false);

  const checkLocalHierarchy = async () => {
    setChecking(true);
    setHierarchyError("");
    try {
      const [districtResponse, talukaResponse, villageResponse] = await Promise.all([
        fetch("/api/v1/geo/hierarchy?level=districts", { cache: "no-store" }),
        fetch("/api/v1/geo/hierarchy?level=subdistricts", { cache: "no-store" }),
        fetch("/api/v1/geo/hierarchy?subdistrictCode=3855", { cache: "no-store" }),
      ]);
      if (![districtResponse, talukaResponse, villageResponse].every((response) => response.ok)) {
        throw new Error("One or more local hierarchy endpoints could not be reached.");
      }
      const [districts, talukas, villages] = await Promise.all([
        districtResponse.json(), talukaResponse.json(), villageResponse.json(),
      ]);
      if (districts.status !== "success" || talukas.status !== "success" || villages.status !== "success") {
        throw new Error("A local hierarchy response did not pass its status check.");
      }
      setHierarchy({
        districts: districts.count,
        talukas: talukas.count,
        ghoghaVillages: villages.count,
        checkedAt: new Date().toLocaleString(gu ? "gu-IN" : "en-IN"),
      });
    } catch (error) {
      setHierarchyError(error instanceof Error ? error.message : "Local hierarchy check failed.");
    } finally {
      setChecking(false);
    }
  };

  const checkFile = async (file?: File) => {
    if (!file) return;
    setFileBusy(true);
    setFileCheck(null);
    setFileError("");
    try {
      setFileCheck(await validateDataset(file));
    } catch (error) {
      setFileError(error instanceof Error ? error.message : "File validation failed.");
    } finally {
      setFileBusy(false);
    }
  };

  const checkedValues = hierarchy || { districts: 34, talukas: 309, ghoghaVillages: 48 };

  return (
    <div className="data-management-page">
      <div className="page-hero-gov">
        <div>
          <span className="hero-kicker-tag">{gu ? "સ્થાનિક ડેટા પાઇપલાઇન" : "LOCAL DATA PIPELINE"}</span>
          <h1>{gu ? "ભૌગોલિક ડેટા અને ફાઇલ માન્યતા" : "Geography Data & File Validation"}</h1>
          <p>
            {gu
              ? "સ્થાનિક પ્રોજેક્ટ ફાઇલો તપાસો અને CSV / GeoJSONનું માળખું ચકાસો. આ ચકાસણી સત્તાવાર સરકારી સિંક કે મંજૂરી નથી."
              : "Check local project hierarchy files and validate CSV / GeoJSON structure. This is not an official government sync or approval."}
          </p>
        </div>
        <div className="hero-actions-wrap">
          <button className="btn-primary-gov" onClick={checkLocalHierarchy} disabled={checking}>
            <RefreshCw size={15} className={checking ? "animate-spin" : ""} />
            <span>{checking ? (gu ? "સ્થાનિક ફાઇલો તપાસાઈ રહી છે..." : "Checking local files…") : (gu ? "સ્થાનિક માળખું તપાસો" : "Check Local Hierarchy")}</span>
          </button>
        </div>
      </div>

      <div className="data-security-alert-bar">
        <ShieldCheck size={18} className="text-teal" />
        <div>
          <strong>{gu ? "ડેમો અને સ્થાનિક ડેટા:" : "Demo and local data:"}</strong>{" "}
          <span>{gu ? "હાલના આંકડા આ પ્રોજેક્ટના પૂર્વદર્શન માટે છે; કોઈ ફાઇલ અપલોડ, મંજૂર કે પ્રકાશિત થતી નથી." : "Current figures are project preview data. Selected files stay in this browser and are not uploaded, approved, or published."}</span>
        </div>
      </div>

      {hierarchy && (
        <div className="alert-success-gov" role="status">
          <CheckCircle2 size={18} />
          <div>
            <strong>{gu ? "સ્થાનિક hierarchy endpoints પહોંચમાં છે" : "Local hierarchy endpoints are reachable"}</strong>
            <span>{hierarchy.districts} districts · {hierarchy.talukas} subdistrict records · {hierarchy.ghoghaVillages} Ghogha villages · {gu ? "છેલ્લી તપાસ" : "checked"} {hierarchy.checkedAt}. {gu ? "આ official verification નથી." : "This is not official verification."}</span>
          </div>
        </div>
      )}
      {hierarchyError && <div className="data-validation-error" role="alert"><AlertCircle size={17} />{hierarchyError}</div>}

      <div className="stats-strip-4">
        <div className="stat-card-compact">
          <span className="stat-label">{gu ? "સ્થાનિક જિલ્લા નિર્દેશિકા" : "Local district directory"}</span>
          <strong className="text-navy">{checkedValues.districts} {gu ? "જિલ્લા" : "districts"}</strong>
          <small>{gu ? "પ્રોજેક્ટની hierarchy" : "Project hierarchy files"}</small>
        </div>
        <div className="stat-card-compact">
          <span className="stat-label">{gu ? "સ્થાનિક તાલુકા નિર્દેશિકા" : "Local subdistrict directory"}</span>
          <strong className="text-navy">{checkedValues.talukas} {gu ? "નોંધ" : "records"}</strong>
          <small>{gu ? "પ્રોજેક્ટની hierarchy" : "Project hierarchy files"}</small>
        </div>
        <div className="stat-card-compact">
          <span className="stat-label">{gu ? "ઘોઘાની ગામ યાદી" : "Ghogha village list"}</span>
          <strong className="text-navy">{checkedValues.ghoghaVillages} {gu ? "ગામ" : "villages"}</strong>
          <small>{gu ? "સ્થાનિક pilot યાદી" : "Local pilot list"}</small>
        </div>
        <div className="stat-card-compact">
          <span className="stat-label">{gu ? "ડેટાનો સ્ત્રોત" : "Data source"}</span>
          <strong className="text-amber">{gu ? "ડેમો / સ્થાનિક" : "DEMO / LOCAL"}</strong>
          <small>{gu ? "સરકારી API જોડાયેલ નથી" : "No government API connected"}</small>
        </div>
      </div>

      <section className="panel-gov">
        <div className="panel-gov-head">
          <div>
            <h3>{gu ? "CSV / GeoJSON ફાઇલની માળખાકીય તપાસ" : "CSV / GeoJSON Structural Validation"}</h3>
            <small>{gu ? "ફાઇલ આ બ્રાઉઝરમાં જ વાંચવામાં આવશે; કોઈ ડેટાબેઝમાં સંગ્રહ નહીં થાય." : "The file is read in this browser only; nothing is saved to a database."}</small>
          </div>
          <Database size={19} className="text-teal" />
        </div>

        <div
          className="gov-dropzone"
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            void checkFile(event.dataTransfer.files[0]);
          }}
        >
          <UploadCloud size={40} className="dropzone-icon" />
          <h4>{gu ? "CSV અથવા GeoJSON ફાઇલ અહીં મૂકો" : "Drop a CSV or GeoJSON file here"}</h4>
          <p>{gu ? "આધારભૂત: .csv, .geojson · મહત્તમ 50 MB · Shapefile આ previewમાં ચાલતું નથી." : "Supported: .csv, .geojson · 50 MB max · Shapefiles are not supported in this preview."}</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.geojson, text/csv, application/geo+json, application/json"
            hidden
            onChange={(event) => void checkFile(event.target.files?.[0])}
          />
          <button className="btn-secondary-gov" onClick={() => fileInputRef.current?.click()} disabled={fileBusy}>
            {fileBusy ? (gu ? "ફાઇલ ચકાસાય છે..." : "Validating…") : (gu ? "ફાઇલ પસંદ કરો" : "Choose File")}
          </button>
        </div>

        {fileCheck && (
          <div className="alert-success-gov" role="status">
            <CheckCircle2 size={18} />
            <div><strong>{fileCheck.name} · {fileCheck.rows} {gu ? "રેકોર્ડ" : "records"}</strong><span>{fileCheck.message} {gu ? "ફાઇલ સ્થાનિક રીતે જ ચકાસાઈ છે; publish થઈ નથી." : "Validated locally only; not published."}</span></div>
          </div>
        )}
        {fileError && <div className="data-validation-error" role="alert"><AlertCircle size={17} />{fileError}</div>}
      </section>
    </div>
  );
}
