# Third-party content and licensing

The MIT license in `LICENSE` covers the code in this repository, and only the
code. Six other things in this
repository carry their own terms.

## Indicator data

`data/observations/worldbank.json` holds values fetched from the World Bank
Open Data API. World Bank datasets are published under Creative Commons
Attribution 4.0 International (CC BY 4.0), with the terms of use at
https://datacatalog.worldbank.org/public-licenses.

Every observation in that file records the series code, the year and the API
URL it came from, so any value can be traced back to the publisher. Some series
originate with other bodies and reach us through the World Bank, including
UNESCO Institute for Statistics, ILO, ITU and WIPO. The registry in
`packages/core/src/model/indicators.ts` names the publisher for each indicator.

If you redistribute the data, keep the attribution.

## Derived dataset

`data/out` holds the scored dataset this project derives from those
observations. It is published under Creative Commons Attribution 4.0
International (CC BY 4.0), the same license the World Bank source data carries.
Attribute it as "Envisioning, National Capability Benchmark" with a link to
this repository, and keep the World Bank attribution above alongside it.

The directory describes itself: `data/out/datapackage.json` is a Frictionless
Data Package naming every file, its schema and this license, and
`data/out/schema/` holds a JSON Schema for each published shape. Both
regenerate on `pnpm bench score`. The scores are a v0 prototype; read
`docs/KNOWN-ARTEFACTS.md` before building on any number.

## Icons

`apps/web/src/components/Icon.tsx` contains the path data for 36 icons copied
from Lucide, which is licensed under the ISC license and available at
https://lucide.dev. Only the icons this app uses are copied, so the app keeps
its three dependencies and an icon cannot change under it on a package update.
Keep the attribution if you reuse the file.

## Typefaces

`apps/web/src/app/fonts` contains two typefaces, both under the SIL Open Font
License 1.1. The license text travels with them in `apps/web/src/app/fonts/OFL.txt`.

- **Inter**, by Rasmus Andersson. https://rsms.me/inter
- **Envisioning Octa**, by Thomaz Rezende for Envisioning, with Reserved Font
  Name "Envisioning Octa". https://envisioning.com/about/brand/octa

The OFL permits use, study, modification and redistribution. It does not permit
selling the fonts on their own, and a modified version may not use the Reserved
Font Name.

## Brand

The visual system, the wordmark and the lime accent belong to Envisioning. The
code that applies them is MIT, the brand itself is not. If you fork this, change
the tokens in `apps/web/src/app/globals.css` and remove Envisioning Octa rather
than shipping something that looks like it came from us.

## Model-generated estimates

`data/delphi/` contains scores and written rationales produced by large language
models, not by people. Every run file declares its `provenance` and the viewer
and the report both refuse to present a `mock` run as evidence.

The run currently checked in is `in_session`: one model, one round, ninety
country and dimension cells. It is a single considered judgment against the
evidence briefs, not a panel, and it is published because it is the evidence
behind `docs/KNOWN-ARTEFACTS.md`. Read `docs/PANEL.md` before quoting any of it.

Nothing in `data/delphi/` is an Envisioning position on any country.
