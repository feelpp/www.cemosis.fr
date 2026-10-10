# Research topics

The shared bilingual labels are defined in `src/lib/topics.ts` and validated by the Astro content schema. Both current projects (`src/content/funding`) and archived projects (`src/content/projects`) accept a `topics` array.

| ID | English label |
| --- | --- |
| modeling | Modelling |
| simulation | Simulation |
| optimization | Optimisation |
| ai | Artificial intelligence (AI) |
| machine-learning | Machine learning |
| sciml | Scientific machine learning (SciML) |
| signal-image | Signal and image processing |
| data-processing | Data processing |
| hpc | High-performance computing (HPC) |
| digital-twin | Digital twin |
| uncertainty-quantification | Uncertainty quantification |

Use identical topic IDs in the English and French versions. Example:

```yaml
topics: [modeling, simulation, hpc]
```

Project tags link to the corresponding research topic. Research topic sections automatically list associated projects. Empty arrays indicate assignments still to be made. Ktirio Urban Building covers all topics, as confirmed by Christophe.

## Application domains

Application domains describe where methods are applied and are kept separate from research topics. Shared bilingual labels are defined in `src/lib/domains.ts`: `health`, `cities-buildings`, `environment`, `energy`, `industry`. Use `domains: [health]` in project frontmatter, with identical IDs in both languages. The bilingual `/en/domains/` and `/fr/domains/` pages automatically list illustrated project cards for each domain. Brain Organ-on-Chip is assigned to health; KUB and HiDALGO2 to cities/buildings, environment and energy; FLOOD to cities/buildings and environment; CIFRE to industry; JNL-G to industry and energy. General methods projects such as Exa-MA remain unassigned.
