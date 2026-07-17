# Role-Based Test Scaffolding

This folder tracks future non-importateur role flows that will process submitted demandes.

Suggested approach:
- Create one top-level folder per role under tests.
- Keep scenario folders by business step (authentication, traitement, validation, decision).
- Use test IDs in names from day one.

Example naming:
- ROLE-AUTH-001 | Login
- ROLE-TRT-001 | Open assigned demande
- ROLE-TRT-002 | Validate dossier

Current active role implemented:
- importateur
