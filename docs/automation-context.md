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
- 3 additional user types that treat/process submitted demandes

## Current Functional Scope (Implemented)
### Actor
- Importateur

### Action
- Create and submit demande

### Demande Nature Covered So Far
- Initiale

## Planned Importateur Scenarios
The next scenarios for the same user (Importateur) are:

1. Initiale
2. Révision with 2 certificate variants:
   - Using N° de certificat initial
   - Using autre N° de certificat
3. Renouvellement with 2 certificate variants:
   - Using N° de certificat initial
   - Using autre N° de certificat

## Scenario Matrix
| User | Nature de demande | Variant | Status |
|---|---|---|---|
| Importateur | Initiale | Standard submission | Done |
| Importateur | Révision | N° de certificat initial | Planned |
| Importateur | Révision | Autre N° de certificat | Planned |
| Importateur | Renouvellement | N° de certificat initial | Planned |
| Importateur | Renouvellement | Autre N° de certificat | Planned |

## Workflow Phases
1. Phase 1: Importateur submits demandes (current phase)
2. Phase 2: Additional user types process/traitent demandes
3. Phase 3: Full end-to-end validation across all 4 user types

## Test Architecture Notes
- Framework: Playwright Test
- Language: TypeScript
- Pattern: Page Object Model (POM)
- Current suite split (role-based):
   - `tests/importateur/authentication/`
   - `tests/importateur/demandes/initiale/`
   - `tests/importateur/demandes/revision/` (planned)
   - `tests/importateur/demandes/renouvellement/` (planned)
- Naming convention reference:
   - `docs/test-naming-convention.md`

## Definition of Done for This First Task
- Login and submission flow for Importateur is automated
- Initiale demande path is executable in test suite
- Documentation of roadmap and scenario coverage is available

## Next Actions
1. Add Révision scenarios (2 variants)
2. Add Renouvellement scenarios (2 variants)
3. Introduce role-based test data strategy for all 4 user types
4. Automate treatment workflow for the remaining user roles
5. Add traceability table: scenario -> user -> expected outcome

## Notes
- Domain terms are preserved as used in PortNet: Initiale, Révision, Renouvellement, N° de certificat.
- This document should be updated each time a scenario moves from Planned to Done.
