# SICONFI budget-execution fidelity

Task: SUBNATIONAL-1

Track: source-backed measurement, subnational diagnostic layer

Status: candidate; source and coverage preflight complete, construct treatment
still unresolved

## Question

Can Brazilian state budget execution show whether approved public plans survive
implementation? The candidate is useful because it addresses Coordination's
delivery problem rather than adding another national outcome measure. It would
be published beside the benchmark as a state diagnostic, never as a state
capability score and never as an input to the national score or confidence.

## Proposed source

The publisher is Brazil's Secretaria do Tesouro Nacional. The proposed source
is SICONFI's open-data API, using the Relatório Resumido da Execução
Orçamentária (RREO) for the 27 federative units. The official documentation
describes the API as open, JSON-based data from SICONFI, and the RREO reference
page describes the report as covering states, the Federal District and
municipalities. The RREO metadata identifies Anexo 01, Balanço Orçamentário,
as the relevant budget-execution table.

- [SICONFI open-data API](https://www.tesourotransparente.gov.br/consultas/consultas-siconfi/siconfi-api-de-dados-abertos)
- [SICONFI API documentation](https://apidatalake.tesouro.gov.br/docs/siconfi/)
- [SICONFI OpenAPI specification](https://apidatalake.tesouro.gov.br/docs/siconfi.yaml)
- [RREO reports for states, the Federal District and municipalities](https://www.tesourotransparente.gov.br/temas/contabilidade-e-custos/relatorios-contabeis-e-fiscais-de-estados-df-e-municipios)
- [RREO metadata](https://www.tesourotransparente.gov.br/ckan/dataset/b74a4483-54f5-4625-8d23-e65515b075ef/resource/a387c7ae-6993-4710-9054-9e9be549b66d/download/metadadosrreo.pdf)

The catalog is inspectable and the official CKAN resources identify an ODbL
licence link. The first implementation should retain only the permitted
derived series and source metadata, not raw licensed bulk extracts.

The OpenAPI specification identifies the request as `GET /rreo` with
`an_exercicio`, `nr_periodo`, `co_tipo_demonstrativo`, optional `no_anexo` and
`id_ente`. The entity catalogue identifies the 27 state and Federal District
codes used below: 11, 12, 13, 14, 15, 16, 17, 21, 22, 23, 24, 25, 26, 27,
28, 29, 31, 32, 33, 35, 41, 42, 43, 50, 51, 52 and 53.

## Preflight result (2026-08-31)

The read-only preflight requested `RREO`, `RREO-Anexo 01`, period 6 and the
`TotalDespesas` row for each state. It found 27 of 27 states in each sampled
year, with all five candidate fields present. The response contains 9 or 10
rows for that account, depending on the state and year.

| Sample year | State coverage | Initial budget | Updated budget | Committed | Liquidated | Paid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 2020 | 27 / 27 | 27 / 27 | 27 / 27 | 27 / 27 | 27 / 27 | 27 / 27 |
| 2022 | 27 / 27 | 27 / 27 | 27 / 27 | 27 / 27 | 27 / 27 | 27 / 27 |
| 2024 | 27 / 27 | 27 / 27 | 27 / 27 | 27 / 27 | 27 / 27 | 27 / 27 |

Using original budget as the denominator, the committed-expenditure ratio
ranged from 77.4% to 118.2% in 2020, 84.8% to 134.9% in 2022, and 95.9% to
125.3% in 2024. The paid ratio ranged from 70.4% to 111.2%, 77.3% to 131.2%,
and 86.3% to 118.0%, respectively.

The updated budget exceeded the original budget in every sampled state-year.
The mean revision was 12.9% in 2020, 27.8% in 2022 and 21.0% in 2024; the
state-level ranges were 2.3–27.1%, 8.5–49.7% and 6.2–34.3%. This is the central
measurement warning: a ratio against original budget mixes initial planning,
later appropriations and execution. A ratio against updated budget measures
current-budget execution instead, and answers a different question.

The source therefore passes the availability and inspectability screen but not
the promotion gate. The candidate is valuable precisely because it exposes a
real choice the national layer cannot settle: plan fidelity, budget
reallocation, or execution against the latest authorised plan.

## Construct and proposed treatment

Proposed indicator: `budget_execution_fidelity`, a Coordination candidate.

The intended construct is the distance between the original approved budget
and what was actually executed. A first operationalisation would use the
annual RREO Anexo 01 values for original approved budget and expenditure
executed, with the exact field names and scope confirmed from the API response
before any code is written. A possible raw ratio is:

```text
execution ratio = expenditure executed / original approved budget
```

The final published measure could be a distance from 100% (`lower_better`) so
both underspending and overspending are visible. This is deliberately
provisional: an amended budget, a commitment, a liquidation and a payment are
different quantities, and choosing among them changes the construct. No
transform, denominator, tolerance or national recomposition rule is promoted
until the API fields and accounting scope are verified.

## Coverage and quality gate

The official RREO material indicates that the report series exists from 2015,
but that does not establish complete state-by-year coverage for the candidate.
The preflight must report, for every intended year:

- coverage for all 27 federative units and the exact SICONFI entity mapping;
- the reference period and whether period 6 is an annual cumulative value;
- original versus updated budget fields and the treatment of retifications;
- whether the figures cover all powers or only the executive branch;
- whether execution means empenhado, liquidado or pago;
- zero, missing and non-reporting cases without imputation;
- value spread, outliers and repeated observations across years.

The candidate is not tested or promoted by the existence of an official page.
It passes the research gate only when those checks are reproducible and the
result is comparable across the 27 states for multiple years.

## Promotion decision still open

Until the construct treatment is settled, this remains a research candidate rather than
an `indicator`, `check` or `manual` observation. Promotion requires:

1. exact API endpoint, table and field identifiers;
2. a deterministic adapter with explicit missingness and revision handling;
3. 27-state mapping and repeated-year coverage report;
4. a documented transform and direction that match the Coordination construct;
5. a GDP-attribution and redundancy review against the national rows; and
6. a decision entry if the series changes the subnational contract or its
   relationship to the national layer.

The next preflight should compare original and updated denominators, test the
same state/account definition across additional years, inspect retifications,
and determine whether a meaningful national counterpart can be recomposed from
state values. If it cannot, the series remains `independent`, as the current
Gini pilot does. “Budget” alone is not evidence that an `aggregate` rule is
valid.

## Next action

Resolve the construct choice with the coverage report above, inspect
retifications and additional years, and only then decide whether to add a row
to `SUBNATIONAL_SERIES`. If the source fails that gate, record it as a gap or
evidence-only source and move to the next Coordination candidate; do not fill
the layer with a convenient but weak proxy.
