# Role-Based Test Scaffolding

This folder tracks future non-importateur role flows that will process submitted demandes.

Target roles:

- agent
- agent-auto-affectant
- superviseur

Role behavior clarification:

- agent traite une demande deja affectee a lui.
- agent-auto-affectant peut s'auto-affecter une demande et la traiter.

Suggested approach:

- Create one top-level folder per role under tests.
- Keep scenario folders by business step (authentication, traitement, validation, decision).
- Use test IDs in names from day one.

Business rule to model in treatment tests:

- Importateur submits 2 demandes as Initiale.
- During treatment, one demande stays Initiale.
- The other demande is switched to Revision and gets a revision number.
- Duplicata behavior stays unchanged.

Example naming:

- ROLE-AUTH-001 | Login
- ROLE-TRT-001 | Open assigned demande
- ROLE-TRT-002 | Validate dossier

Current active role implemented:

- importateur
