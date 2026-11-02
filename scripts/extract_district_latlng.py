import json

with open('public/data/gujarat.geojson', 'r', encoding='utf-8') as f:
    gj = json.load(f)

districts_geo = {}
for feat in gj['features']:
    props = feat['properties']
    name = props.get('district', '')
    dt_code = props.get('dt_code', '')
    geom = feat['geometry']
    coords = geom['coordinates']
    
    all_pts = []
    def extract_pts(c):
        if isinstance(c[0], (int, float)):
            all_pts.append(c)
        else:
            for sub in c:
                extract_pts(sub)
    extract_pts(coords)
    
    lons = [p[0] for p in all_pts]
    lats = [p[1] for p in all_pts]
    min_lon, max_lon = min(lons), max(lons)
    min_lat, max_lat = min(lats), max(lats)
    center_lon = sum(lons) / len(lons)
    center_lat = sum(lats) / len(lats)
    
    districts_geo[name] = {
        'dt_code': dt_code,
        'lat': round(center_lat, 4),
        'lng': round(center_lon, 4),
        'bbox': [round(min_lat, 4), round(min_lon, 4), round(max_lat, 4), round(max_lon, 4)],
        'point_count': len(all_pts)
    }

with open('public/data/district_latlng.json', 'w', encoding='utf-8') as f:
    json.dump(districts_geo, f, indent=2)

print('Successfully computed and saved coordinates for', len(districts_geo), 'districts.')
