# Playwright QA Automation Framework

Production-ready Playwright test automation framework built with TypeScript, ES Modules, and the Page Object Model (POM).

## Prerequisites

- Node.js 20 or later
- npm 10 or later

## Installation

```bash
npm install
```

Create a local `.env` file from `.env.example` before running tests:

```bash
copy .env.example .env
```

Then fill in your local values in `.env`:

```dotenv
LOGIN_URL=https://internal-app.example.local/portnet/app/seguridad/user/login.jsp
HOME_URL=https://internal-app.example.local/portnet/faces/app/home.xhtml
E2E_IMPORTATEUR_USERNAME=your-importateur-username
E2E_IMPORTATEUR_PASSWORD=your-importateur-password
```

`.env` is ignored by Git, so secrets are not pushed. The tracked `fixtures/users.json` file remains a template only and is not used for live credentials.

## Running Tests

```bash
npm test
npm run ui
npm run headed
npm run debug
npm run report
npm run codegen
```

## Project Architecture

```text
.
├── auth/                   # Browser storage state and authentication artifacts
├── constants/              # Shared constants such as application routes
├── docs/                   # Project context and testing conventions
├── fixtures/               # Static test data (users, demandes, upload docs)
├── pages/                  # Page Object Model classes and UI selectors (.ts)
├── tests/                  # Role-based suites and scenario scaffolding
├── utils/                  # Reusable helpers (.ts)
├── playwright.config.ts    # Playwright runner configuration
└── README.md
```

### Page Object Model Rules

- Keep selectors inside page objects only.
- Reuse common browser interactions through `BasePage`.
- Keep assertions in tests unless a page object exposes a meaningful state helper.

## Current Scope

The active implementation currently targets the importateur role using:

- `tests/importateur/authentication/imp-auth-001-login.spec.ts`
- `tests/importateur/demandes/initiale/imp-dem-init-001-create-and-submit.spec.ts`
- `tests/importateur/demandes/revision/` (planned scaffold)
- `tests/importateur/demandes/renouvellement/` (planned scaffold)

Business flow implementation is encapsulated in:

- `pages/LoginPage.ts`
- `pages/DemandeApprobationPage.ts`

## Adding a New Page Object

1. Create a new class in `pages/` that extends `BasePage`.
2. Define all selectors inside the class constructor.
3. Add reusable page actions as descriptive methods.
4. Keep business flow methods in the page object and assertions in the test where possible.

## Adding a New Test Suite

1. Create or reuse a role folder inside `tests/`.
2. Create a scenario folder by business nature (initiale, revision, renouvellement, traitement, etc.).
3. Add a `*.spec.ts` file using the ID naming convention in `docs/test-naming-convention.md`.
4. Keep static scenario data under `fixtures/demandes/<role>/`.
5. Import the relevant page objects and fixtures.

## Useful Paths

- `docs/automation-context.md`
- `docs/test-naming-convention.md`
- `fixtures/demandes/importateur/initiale.json`
- `fixtures/users/importateur.json`

## Notes

- The framework runs Chromium only.
- Headless mode is enabled by default.
- Screenshots, video, and traces are retained on failure.
- `LOGIN_URL`, `HOME_URL`, and user credentials are loaded from local `.env` or CI secrets.
