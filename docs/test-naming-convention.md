# Test Naming Convention

## Goal
Keep test names readable and traceable across business, QA, and reporting.

## Format
`<DOMAIN>-<FLOW>-<NUMBER> | <Business action>`

## Domain Prefixes
- `IMP` : Importateur
- `TRT` : Traitement roles (future)
- `AUTH` : Authentication focus
- `DEM` : Demande flow

## Flow Prefixes (Current)
- `AUTH`
- `DEM-INIT`
- `DEM-REV`
- `DEM-REN`

## Examples
- `IMP-AUTH-001 | Login with valid importateur credentials`
- `IMP-DEM-INIT-001 | Create and submit initiale demande`
- `IMP-DEM-REV-001 | Revision with numero certificat initial`
- `IMP-DEM-REN-002 | Renouvellement with autre numero certificat`

## File Naming
Use kebab-case and keep IDs in filenames:
- `imp-auth-001-login.spec.ts`
- `imp-dem-init-001-create-and-submit.spec.ts`

## Status Strategy
For planned but not implemented scenarios:
- Keep scaffold test with `test.skip(true, 'Planned scenario scaffold...')`
- Replace skip only when scenario and data are ready
