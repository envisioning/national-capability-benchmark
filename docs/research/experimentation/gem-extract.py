#!/usr/bin/env python3
"""Extract TEA and fear of failure from the GEM Global Report appendix tables.

Research tool for D125, not part of the build. Reproduce with:

    python3 -m venv .venv && .venv/bin/pip install pymupdf
    for id in 51858 51621 51377 51147 50900 50691 50443; do
      curl -sSL -o gem-$id.pdf "https://www.gemconsortium.org/file/open?fileId=$id"
    done
    .venv/bin/python gem-extract.py <dir-with-pdfs>  > gem-extract.json

It reads words with their page coordinates, groups them into table rows by
vertical position, and takes the column named in TABLES below. Every value it
emits was checked by eye against a rendering of the same page (see
GEM-AND-DESIGNS.md). A row whose number of values differs from the expected
column count is reported under "skipped" rather than guessed.
"""
import json
import re
import sys

import pymupdf

NUM = re.compile(r'^(=?-?\d+(\.\d+)?[*=]?|—\*?|–|-)$')

ISO3 = {
    'Argentina': 'ARG', 'Brazil': 'BRA', 'Canada': 'CAN', 'Chile': 'CHL', 'China': 'CHN',
    'Colombia': 'COL', 'Costa Rica': 'CRI', 'Ecuador': 'ECU', 'El Salvador': 'SLV',
    'Estonia': 'EST', 'Finland': 'FIN', 'France': 'FRA', 'Germany': 'DEU', 'Guatemala': 'GTM',
    'India': 'IND', 'Indonesia': 'IDN', 'Israel': 'ISR', 'Japan': 'JPN', 'Mexico': 'MEX',
    'Netherlands': 'NLD', 'Panama': 'PAN', 'Peru': 'PER', 'Poland': 'POL',
    'Republic of Korea': 'KOR', 'South Africa': 'ZAF', 'Spain': 'ESP', 'Sweden': 'SWE',
    'Switzerland': 'CHE', 'Thailand': 'THA', 'United Arab Emirates': 'ARE',
    'United Kingdom': 'GBR', 'United States': 'USA', 'Uruguay': 'URY', 'Venezuela': 'VEN',
    # Benchmark countries never seen in the 2019-2025 tables, listed so a
    # future edition that carries them is picked up.
    'Singapore': 'SGP', 'Portugal': 'PRT', 'Ireland': 'IRL', 'Australia': 'AUS',
    'Viet Nam': 'VNM', 'Vietnam': 'VNM', 'Philippines': 'PHL', 'Malaysia': 'MYS',
    'Türkiye': 'TUR', 'Turkey': 'TUR', 'Nigeria': 'NGA', 'Kenya': 'KEN', 'Rwanda': 'RWA',
    'Ethiopia': 'ETH', 'Bolivia': 'BOL', 'Paraguay': 'PRY', 'Honduras': 'HND',
    'Nicaragua': 'NIC', 'Dominican Republic': 'DOM', 'Cuba': 'CUB', 'Haiti': 'HTI',
}

URL = 'https://www.gemconsortium.org/file/open?fileId={}'

# (fileId, data year, report, table, names page, values page, column index, expected columns)
# Pages are 1-based PDF page indices. Printed page numbers are recorded per value.
TABLES = {
    'early_stage_entrepreneurial_activity': [
        (51858, 2025, 'GEM 2025/2026 Global Report', 'Table A1', 225, 225, 0, 4),
        (51858, 2025, 'GEM 2025/2026 Global Report', 'Table A1 (continued)', 227, 227, 0, 4),
        (51621, 2024, 'GEM 2024/2025 Global Report', 'Table A3', 224, 224, 0, 5),
        (51621, 2024, 'GEM 2024/2025 Global Report', 'Table A3 (continued)', 226, 226, 0, 5),
        (51377, 2023, 'GEM 2023/2024 Global Report', 'Table A2', 214, 214, 0, 6),
        (51377, 2023, 'GEM 2023/2024 Global Report', 'Table A2', 215, 215, 0, 6),
        (51147, 2022, 'GEM 2022/2023 Global Report', 'Table A2', 226, 226, 0, 6),
        (51147, 2022, 'GEM 2022/2023 Global Report', 'Table A2', 227, 227, 0, 6),
        (50900, 2021, 'GEM 2021/2022 Global Report', 'Table A2', 202, 202, 0, 6),
        (50900, 2021, 'GEM 2021/2022 Global Report', 'Table A2', 203, 203, 0, 6),
        (50691, 2020, 'GEM 2020/2021 Global Report', 'Table A2', 184, 185, 2, 8),
        (50691, 2020, 'GEM 2020/2021 Global Report', 'Table A2 (continued)', 186, 187, 2, 8),
        (50443, 2019, 'GEM 2019/2020 Global Report', 'Table A1', 196, 197, 2, 8),
        (50443, 2019, 'GEM 2019/2020 Global Report', 'Table A1 (continued)', 198, 199, 2, 8),
    ],
    'fear_of_failure': [
        (51858, 2025, 'GEM 2025/2026 Global Report', 'Table A2', 228, 228, 1, 4),
        (51858, 2025, 'GEM 2025/2026 Global Report', 'Table A2 (continued)', 230, 230, 1, 4),
        (51621, 2024, 'GEM 2024/2025 Global Report', 'Table A2', 220, 221, 1, 4),
        (51621, 2024, 'GEM 2024/2025 Global Report', 'Table A2 (continued)', 222, 223, 1, 4),
        (51377, 2023, 'GEM 2023/2024 Global Report', 'Table A3', 216, 217, 1, 3),
        (51377, 2023, 'GEM 2023/2024 Global Report', 'Table A3 (continued)', 218, 219, 1, 3),
        (51147, 2022, 'GEM 2022/2023 Global Report', 'Table A3', 228, 229, 1, 3),
        (51147, 2022, 'GEM 2022/2023 Global Report', 'Table A3 (continued)', 230, 231, 1, 3),
        (50900, 2021, 'GEM 2021/2022 Global Report', 'Table A3', 205, 205, 0, 3),
        (50900, 2021, 'GEM 2021/2022 Global Report', 'Table A3 (continued)', 207, 207, 0, 3),
        (50691, 2020, 'GEM 2020/2021 Global Report', 'Table A3', 188, 188, 8, 10),
        (50691, 2020, 'GEM 2020/2021 Global Report', 'Table A3 (continued)', 190, 190, 8, 10),
        (50443, 2019, 'GEM 2019/2020 Global Report', 'Table A2', 200, 201, 0, 10),
        (50443, 2019, 'GEM 2019/2020 Global Report', 'Table A2 (continued)', 202, 203, 0, 10),
    ],
}


def lines(page):
    """Group words into rows by vertical centre (3pt tolerance)."""
    rows = {}
    for x0, y0, x1, y1, w, *_ in page.get_text('words'):
        yc = (y0 + y1) / 2
        key = next((k for k in rows if abs(k - yc) < 3), None)
        if key is None:
            key = yc
            rows[key] = []
        rows[key].append((x0, w))
    out = []
    for y in sorted(rows):
        items = sorted(rows[y])
        name = ' '.join(w for _, w in items if not NUM.match(w)).strip().rstrip('.')
        nums = [w for _, w in items if NUM.match(w)]
        out.append([y, name, nums])
    # Two-line country names ("Republic of / Korea") sit above and below a
    # numbers-only row: fold them into it.
    for i, row in enumerate(out):
        if row[2] and not row[1]:
            above = out[i - 1] if i > 0 and not out[i - 1][2] and row[0] - out[i - 1][0] < 10 else None
            below = out[i + 1] if i + 1 < len(out) and not out[i + 1][2] and out[i + 1][0] - row[0] < 10 else None
            if above and below:
                row[1] = f'{above[1]} {below[1]}'
    return out


def country(name):
    """The registry country a row label names. The 2019 and 2020 tables put
    region and income words after the name, so match the longest name the
    label starts with."""
    hits = [k for k in ISO3 if name == k or name.startswith(k + ' ')]
    return max(hits, key=len) if hits else None


def names_by_y(page):
    return [(y, country(n)) for y, n, _ in lines(page) if country(n)]


def values_by_y(page):
    return [(y, v) for y, _, v in lines(page) if v]


def main(folder):
    result = {'values': {}, 'skipped': []}
    for indicator, specs in TABLES.items():
        found = result['values'].setdefault(indicator, {})
        for file_id, year, report, table, names_pn, values_pn, col, ncols in specs:
            doc = pymupdf.open(f'{folder}/gem-{file_id}.pdf')
            vpage = doc[values_pn - 1]
            printed = vpage.get_text().split('\n')[0].strip()
            vals = values_by_y(vpage)
            for y, name in names_by_y(doc[names_pn - 1]):
                match = [v for vy, v in vals if abs(vy - y) < 3]
                iso = ISO3[name]
                if not match or len(match[0]) != ncols:
                    result['skipped'].append({'indicator': indicator, 'iso3': iso, 'year': year,
                                              'reason': f'{len(match[0]) if match else 0} values, expected {ncols}'})
                    continue
                raw = match[0][col]
                if not re.match(r'^\d+(\.\d+)?$', raw):
                    result['skipped'].append({'indicator': indicator, 'iso3': iso, 'year': year,
                                              'reason': f'cell reads {raw!r}'})
                    continue
                found.setdefault(iso, []).append({
                    'value': float(raw), 'year': year, 'report': report, 'table': table,
                    'printedPage': printed, 'pdfPage': values_pn, 'sourceUrl': URL.format(file_id),
                })
    print(json.dumps(result, indent=1))


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else '.')
