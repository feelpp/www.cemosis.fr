# People, contracts and doctoral research

`src/data/people.yaml` is the shared source for the French and English About
pages and the “Associated people” section on project pages. It replaces
`src/data/team.json`. The update date and source statement describe the roster
evidence, not contract start/end dates.

Each person has one stable `id`, one name, optional bilingual role text, explicit
`status` (`current`, `former` or `unspecified`), and `contractBased`. Christophe
Prud'homme and Vincent Chabannes are the two core staff entries with
`contractBased: false`; the others are contract-funded as confirmed by the owner.
This records the funding arrangement, not a legal CDD/CDI classification.

The original five current members retain their owner-confirmed names and roles.
Additional contributors include Luca Berti, Maryam Maslek, Patrick Lemoine,
Abdoulaye Diallo, Zohra Djatouti and Céline Van Landeghem. Their current/former
membership is left `unspecified` unless confirmed. Internal `notes` and evidence
`sources` are not printed as public biographical copy.

Javier Cladellas is listed as a former member, as confirmed by the owner on
12 November 2026, with data analysis, modelling and simulation work on Ktirio
Urban Building documented in the project discussions. His 2024–2026 contract
years are owner-confirmed; specific funding remains unspecified.

## Contracts and project history

`contracts` can contain any number of separate contracts, including concurrent
ones. Use numeric years or `null` when unknown. An empty list means contract
details have not yet been supplied; it does not mean that the person had no
contracts. A duration can be recorded independently of calendar dates.

```yaml
- id: person-id
  name: Prénom Nom
  status: current
  contractBased: true
  projects:
    - project: ktirio-urban-building
      role: { fr: Modélisation, en: Modelling }
  contracts:
    - startYear: 2022
      endYear: 2024
      funding: [{ source: iti-irmia-plus-plus }]
    - startYear: 2025
      endYear: null
      ongoing: true
      projects: [ktirio-urban-building]
      funding: [{ project: hidalgo2 }]
```

This is an illustrative schema example, not an actual person's contract history.
`ongoing: true` requires an open end year. A start year alone is labelled
“Started”, not silently interpreted as continuing to the present. Contract dates
do not automatically change a person's explicit membership status.

Person-level `projects` describe the research/project history independently of
the number of contracts. Their YAML order is preserved: Luca Berti's PhD on
micro-swimming precedes his later work on Ktirio Urban Building. That sequence
does not establish how many later contracts he had. Per-contract `projects` can
be supplied when those assignments are known. Former project slugs resolve to
canonical projects using `project-funding.yaml` aliases.

Funding entries reuse the existing project/source IDs in
`src/data/project-funding.yaml`. Patrick Lemoine has a confirmed **two-year**
ITI IRMiA++ contract with unknown start/end years. Abdoulaye Diallo has confirmed
HiDALGO2 funding with unknown years. Céline Van Landeghem's ITI funding ended
around November–December 2025; this is retained as a funding note, not treated as
a confirmed employment-contract end date.

Project links and contract project funding produce reciprocal links between
About-page person anchors (`#person-ID`) and the relevant project pages.

## Doctoral section since 2012

The separate `doctorate` object stores academic records: bilingual thesis title,
university, `status` (`defended`, `ongoing` or `announced`), optional `startYear`,
`defenseDate`, source URL and supervisors. Academic dates are kept separate from
employment-contract dates. `doctoralSince: 2012` controls the displayed history.

The initial history contains 17 defended theses, one registered ongoing PhD
(Pierre-Antoine Senger) and one announced CIFRE PhD (Hanna Chetouane). This is a
documented starting cohort, not a guarantee that every Cemosis-related doctorate
has been identified. Selection uses:

- Theses directed/co-directed by Christophe Prud'homme, verified against
  https://theses.fr/api/v1/personnes/personne/162551118 (the director category,
  not examination or jury membership).
- Additional doctoral work already in the CEMOSIS HAL collection: Bruno Weber,
  Michel Massaro and Nhung Pham, with matching thesis topics checked to avoid
  homonyms.
- The existing JNL-G and CIFRE announcements for current/announced doctoral work.

Individual metadata was checked on 10 November 2026 using
`https://theses.fr/api/v1/theses/these/ID`; public source links point to the
corresponding `https://theses.fr/ID` record. Original scientific titles are
retained. These academic associations do not establish employment contracts.

Luca Berti's record **2021STRAD021** confirms *Numerical methods and optimization
for micro-swimming*, Strasbourg, defense on **13 December 2021**, directed by
Christophe Prud'homme. The completed-thesis record does not supply his first
registration date. His **2018–2021** doctoral period is corroborated by Laëtitia
Giraldi's public supervisor CV (`periodSource`). The same CV gives Céline's
2022–2025 doctoral period. Those periods are not copied into `contracts`.

`showInTeam: false` places doctoral-history entries only in the dedicated section;
people already on the main roster are linked without duplicating person anchors.
Their contracts can still be displayed in the doctoral section when supplied.

## Checks

With the Node toolchain activated as described in AGENTS.md:

```sh
node scripts/test-people.mjs
corepack pnpm check
corepack pnpm build
corepack pnpm verify:links
```

The schema rejects duplicate people IDs, reversed year ranges, invalid calendar
dates and ambiguous funding targets. Link verification checks the rendered
person/project links in both languages.
