#!/usr/bin/env python3
"""Read the frame's WID wealth rows from the bulk zip with range requests.

Usage: fetch.py <ncb repo> <empty output dir outside the repo>

Writes per-country files that hold wealth rows only, plus iso_map.json. WID
values stay out of this repository: the source fails D154 (a). See PREFLIGHT.md.
"""
import csv, glob, json, os, struct, sys, urllib.request, zlib
from concurrent.futures import ThreadPoolExecutor

REPO, OUT = sys.argv[1], sys.argv[2]
URL = 'https://wid.world/bulk_download/wid_all_data.zip'


def get_range(start, end):
    req = urllib.request.Request(URL, headers={'Range': f'bytes={start}-{end}', 'User-Agent': 'ncb-research'})
    return urllib.request.urlopen(req, timeout=180).read()


size = int(urllib.request.urlopen(urllib.request.Request(URL, method='HEAD'), timeout=60).headers['Content-Length'])
tail = get_range(size - 70000, size - 1)
at = tail.rfind(b'PK\x05\x06')
_, cd_size, cd_off = struct.unpack('<HII', tail[at + 10:at + 20])
cd = get_range(cd_off, cd_off + cd_size - 1)
entries, p = {}, 0
while cd[p:p + 4] == b'PK\x01\x02':
    method, = struct.unpack('<H', cd[p + 10:p + 12])
    csize, = struct.unpack('<I', cd[p + 20:p + 24])
    nlen, elen, clen = struct.unpack('<HHH', cd[p + 28:p + 34])
    local, = struct.unpack('<I', cd[p + 42:p + 46])
    entries[cd[p + 46:p + 46 + nlen].decode()] = (method, csize, local)
    p += 46 + nlen + elen + clen


def read_entry(name):
    method, csize, local = entries[name]
    head = get_range(local, local + 29)
    nlen, elen = struct.unpack('<HH', head[26:30])
    raw = get_range(local + 30 + nlen + elen, local + 30 + nlen + elen + csize - 1)
    return zlib.decompress(raw, -15) if method == 8 else raw


isos = [os.path.basename(f)[:3] for f in glob.glob(f'{REPO}/data/out/countries/*.json')]
wb = json.load(urllib.request.urlopen('https://api.worldbank.org/v2/country?format=json&per_page=400', timeout=60))[1]
iso2 = {c['id']: {'XK': 'KS'}.get(c['iso2Code'], c['iso2Code']) for c in wb}
iso_map = {i: iso2[i] for i in isos}
json.dump(iso_map, open(f'{OUT}/iso_map.json', 'w'))


def save(name):
    lines = read_entry(name).decode('utf8', 'replace').splitlines()
    keep = [l for n, l in enumerate(lines) if n == 0 or 'hweal' in l]
    open(os.path.join(OUT, name), 'w').write('\n'.join(keep))


names = [f'WID_{kind}_{a}.csv' for a in iso_map.values() for kind in ('data', 'metadata')]
print('missing from zip:', [n for n in names if n not in entries])
with ThreadPoolExecutor(6) as ex:
    list(ex.map(save, [n for n in names if n in entries]))
print('files', len(names))
