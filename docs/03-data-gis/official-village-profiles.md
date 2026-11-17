# Gujarat village and town baseline

## Data sources and dates

- Village boundaries and source attributes: Survey of India village-boundary GeoJSON distributed through the Government of India National Water Data Portal (NWIC). The portal lists the resource as published 1 May 2025.
- Population, household, sex, and village-directory attributes are a **historical 2011 Census baseline**. They are not current population estimates, present-day facility status, or scheme beneficiary/coverage data.
- Scheme-specific rows in `location-analytics.json.gz` and `location-record-index.json.gz` remain synthetic demonstrations. They must never be combined with Census values or labeled as official implementation.

## Location matching

`scripts/build_official_village_profiles.py` matches `Location_Master.Location_Code` only to the official `vlcode` field. Ambiguous codes stop the build. Current district/taluka assignment is taken from the supplied location master only after the exact location-code match; old source district codes are retained in the profile fields for audit. The generated Census profile includes the source fields and exact-match metadata.

The first verified join matched 18,110 of 18,818 inhabited locations. The other 708 locations do not get an inferred Census profile. The merged map boundary set contains 18,110 exact official code matches plus previously bundled fallback geometry; fallback features carry an explicit `boundarySource` label. Locations without a polygon remain selectable from the administrative list and are not given a made-up shape.

## Rebuild

Download the Gujarat GeoJSON ZIP from the [NWIC village-boundary dataset](https://nwdp.nwic.gov.in/dataset/village-boundary), then run:

```powershell
python scripts/build_official_village_profiles.py `
  --dataset-dir "C:\path\to\Gujarat_10_Schemes_Demo_Dataset" `
  --soi-zip "C:\path\to\vb_soi_gj_geojson.zip"
```

This writes:

- `data/processed/village-census-2011.json.gz` for the location profile API.
- `public/data/boundaries/gujarat-villages/` with per-district merged village polygons.

The existing scheme sample dashboard and raw row table remain separate. The 2011 profile's full source fields are inspectable in a separate table, while the profile banner identifies the old reference period.

## Limits

There is no official all-scheme, all-village beneficiary and payment feed in the supplied dataset. A complete current village-level welfare database requires current feeds from each responsible department and verified common location IDs. The current public profile therefore combines an exact-code historical Census baseline with a separately labeled synthetic scheme demo; it does not imply that any listed scheme operates in a settlement.
