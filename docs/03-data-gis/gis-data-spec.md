# GIS Data Specification

## Principles
Real boundaries only. An AI-generated or hand-drawn map is never used as a selectable boundary. Prototype boundaries from community sources (for example OpenStreetMap-derived) may be used only if flagged `verification_status = unverified`, shown with a "prototype boundary" notice, and replaced before production.

<a id="state-level"></a>
## Boundary levels and sources
| Level | Needed | Source status |
|---|---|---|
| District (34) | Yes | To be identified, class F |
| Taluka | Yes | To be identified, class F |
| Village (Bhavnagar) | Yes | Highest risk; may need permission (class D/E) |
Boundary licence determines whether the data can be redistributed through a public API. If redistribution is forbidden, the options are: obtain permission, show boundaries only to authorised users, or use points (village centroids) with taluka polygons.

## Technical requirements
- CRS stored as EPSG:4326; source CRS recorded and transformed with PostGIS, never by hand.
- Each feature must carry lgd_code (or a mapping table matches by name + parent and a human reviews every match).
- Geometry type MultiPolygon.
- Validity: ST_IsValid true; repairs with ST_MakeValid recorded in the import log, never silent.
- Containment: village within its taluka and taluka within its district, tolerance 0.5 percent of area (provisional) to allow generalisation; failures listed.
- Overlap: sibling polygons may not overlap beyond tolerance; gaps reported.
- Coordinates inside Gujarat's bounding box (approx 20.1 to 24.7 N, 68.1 to 74.5 E; confirm) else flagged.
- Simplification: geom_low for state/district zoom, geom_mid for taluka zoom, full geom for village. Tolerances chosen by measured payload (ADR-0004).
- Area recorded for sanity checks against official areas where published.

## Delivery to the browser
Per-level GeoJSON endpoints (state, children of unit) with ETag and gzip/brotli, upgrade to vector tiles from PostGIS if budgets in performance.md are exceeded. Feature properties limited to: lgd_code, level, name_en, name_gu. Statistics are joined client-side from a separate stats call keyed by lgd_code so boundary payloads stay cacheable.

## Basemap
Provider configured by environment variables; must permit the usage. Without a key a plain background with only the administrative boundaries is used. Satellite imagery only from a licensed provider. Attribution is mandatory and visible.

## Attribution
Boundary source name, version and date, and basemap credits appear in the map footer and exports.

## Boundary change handling
New boundary version = new row with valid_from; old row gets valid_to. Statistics keep pointing at admin_units, so history remains. Changing a geographic source triggers review of data-sources.md, data-quality.md, import-pipeline.md and an ADR.

## Validation report (output of TASK-031)
Counts per level; invalid geometries; containment failures; overlaps; unmatched lgd codes both ways; features outside bbox; area outliers; simplification size table.
