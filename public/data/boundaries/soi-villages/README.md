# Gujarat administrative boundaries

These district chunks contain only Survey of India village boundary geometry and the LGD village, subdistrict, and district codes needed to navigate the map. Census, household, population, water, and other source attributes are deliberately omitted.

- Source: [National Water Data Portal, Village Boundary of Gujarat](https://nwdp.nwic.gov.in/dataset/village-boundary)
- Publisher: Survey of India, served by the National Water Informatics Centre, Ministry of Jal Shakti
- Source GeoJSON date: 2025-05-01; source format uses EPSG:7755 (India NSF Lambert Conformal Conic)
- Resource license shown by the portal: “Other (Open)”
- Processing: converted to WGS84, simplified with 25 m tolerance, then joined to this project’s current LGD village and subdistrict codes
- Rebuild: `python scripts/build-village-boundaries.py [path-to-source-zip] [tolerance-in-metres]`

The current boundary release does not cover every current LGD village or revised taluka assignment. Missing or changed assignments are excluded rather than drawn against a potentially incorrect name/code. The map keeps the hierarchy list and OSM road basemap available for those units, and does not fabricate boundary shapes or village pins.
