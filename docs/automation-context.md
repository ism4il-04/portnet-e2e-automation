# PortNet QA Automation Context

## Purpose

This document explains the current automation scope, the planned scenarios, and the roadmap for multi-user testing in the PortNet workflow.

## Project Context

- Project: PortNet workflow automation with Playwright (TypeScript, POM)
- Current stage: First task setup and first end-to-end scenario implemented
- Main objective: Automate demande lifecycle across multiple user types

## User Types (Target)

The end goal is to automate tests with 4 user types.

Current progress:

- Importateur: in progress and already automated for demande submission

Planned later:

- Agent
- Agent auto affectant
- Superviseur

Role responsibility clarification:

- Agent: traite uniquement une demande deja affectee a lui.
- Agent auto affectant: peut s'auto-affecter une demande puis la traiter.

## Current Functional Scope (Implemented)

### Actor

- Importateur

### Action

- Create and submit demande

### Demande Nature Covered So Far

- Initiale
- Initiale (2 identifiers in suite: IMP-DEM-INIT-001 and IMP-DEM-INIT-002)

## Clarified Business Lifecycle

For one execution cycle, the importateur creates 2 initial demandes.

Treatment outcome by processing roles:

1. One demande stays Initiale.
2. One demande becomes Révision and receives a numero de revision.

Duplicata behavior:

- Duplicata scenarios keep the same behavior and are not changed by this rule.

## Planned Importateur Scenarios

The next scenarios for the same user (Importateur) are:

1. Initiale
1. Revision with 2 certificate variants
1. Using N deg certificat initial
1. Using autre N deg certificat
1. Renouvellement with 2 certificate variants
1. Using N deg certificat initial
1. Using autre N deg certificat

## Planned Multi-Role Treatment Scenarios

After submission, the treatment path will include:

1. Agent processing of the two initial demandes
1. One remains Initiale
1. One is switched to Revision with revision number
1. Agent auto affectant self-assignment then treatment actions
1. Superviseur validation/decision actions
1. Duplicata treatment paths remain unchanged

## Scenario Matrix

| User | Nature de demande | Variant | Status |
| --- | --- | --- | --- |
| Importateur | Initiale | Standard submission | Done |
| Importateur | Initiale (x2) | Two submitted demandes in same run with unique IDs (001/002) | In progress |
| Agent | Traitement | Traite une demande affectee a lui | Planned |
| Agent | Traitement | Keep one demande as Initiale | Planned |
| Agent | Traitement | Convert one demande to Revision + revision number | Planned |
| Agent auto affectant | Auto-affectation + traitement | S'auto-affecte une demande puis la traite | Planned |
| Superviseur | Validation | Validate/decide on treated demandes | Planned |
| Importateur | Revision | N deg de certificat initial | In progress |
| Importateur | Revision | Autre N deg de certificat | Planned |
| Importateur | Renouvellement | N deg de certificat initial | Planned |
| Importateur | Renouvellement | Autre N deg de certificat | Planned |
| All roles | Duplicata | Existing behavior unchanged | Planned |

## Workflow Phases

1. Phase 1: Importateur submits demandes (current phase)
2. Phase 2: Additional user types process demandes
3. Phase 3: Full end-to-end validation across all 4 user types

## Test Architecture Notes

- Framework: Playwright Test
- Language: TypeScript
- Pattern: Page Object Model (POM)
- Current suite split (role-based):
  - tests/importateur/authentication/
  - tests/importateur/demandes/initiale/
  - tests/importateur/demandes/revision/
  - tests/importateur/demandes/renouvellement/
- Naming convention reference:
  - docs/test-naming-convention.md

## Definition of Done for This First Task

- Login and submission flow for Importateur is automated
- Initiale demande path is executable in test suite
- Documentation of roadmap and scenario coverage is available

## Next Actions

1. Add importateur scenario that creates 2 initial demandes in one run
2. Add agent treatment scenario: keep one Initiale, convert one to Revision with revision number
3. Add agent auto affectant workflow scenario: self-assign then treat
4. Add superviseur workflow scenario
5. Keep duplicata flows as-is and link them to existing coverage
6. Link duplicata branching explicitly to IMP-DEM-INIT-001 vs IMP-DEM-INIT-002

## Notes

- Domain terms are preserved as used in PortNet: Initiale, Revision, Renouvellement, N deg certificat.
- Clarification applied: two Initiale demandes are created first, then diverge during treatment.
- This document should be updated each time a scenario moves from Planned to Done.
