import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { test } from '@playwright/test';
import type { RequiredDocuments, RevisionWithOtherCertificateData } from '../../../../pages/DemandeApprobationPage.js';
import { DemandeApprobationPage } from '../../../../pages/DemandeApprobationPage.js';
import { LoginPage } from '../../../../pages/LoginPage.js';
import { getRoleCredentials, hasRequiredCredentials, hasRequiredEnvironment } from '../../../../utils/helpers.js';

type RevisionOtherFixture = {
  modelDescription: RevisionWithOtherCertificateData;
  documents: Record<keyof RequiredDocuments, string>;
};

async function loadRevisionOtherFixture(): Promise<RevisionOtherFixture> {
  const fixturePath = fileURLToPath(new URL('../../../../fixtures/demandes/importateur/revision-autre-certificat.json', import.meta.url));
  const payload = await readFile(fixturePath, 'utf-8');
  return JSON.parse(payload) as RevisionOtherFixture;
}

function resolveDocumentPath(fileName: string): string {
  return fileURLToPath(new URL(`../../../../fixtures/uploads/${fileName}`, import.meta.url));
}

test.describe('Importateur Demande Revision', () => {
  test('IMP-DEM-REV-002 | Revision with autre numero certificat', async ({ page }) => {
    test.setTimeout(120000);

    const credentials = await getRoleCredentials('importateur');
    test.skip(!hasRequiredCredentials(credentials), 'Set E2E_IMPORTATEUR_USERNAME/E2E_IMPORTATEUR_PASSWORD or fallback E2E_USERNAME/E2E_PASSWORD.');
    test.skip(!hasRequiredEnvironment(), 'Set LOGIN_URL and HOME_URL in .env or CI secrets.');

    const fixture = await loadRevisionOtherFixture();

    const requiredDocuments: RequiredDocuments = {
      mandatFile: resolveDocumentPath(fixture.documents.mandatFile),
      noteDescriptiveFile: resolveDocumentPath(fixture.documents.noteDescriptiveFile),
      drawingsFile: resolveDocumentPath(fixture.documents.drawingsFile),
      userDocsFile: resolveDocumentPath(fixture.documents.userDocsFile),
      testReportsFile: resolveDocumentPath(fixture.documents.testReportsFile),
      oimlCertificateFile: resolveDocumentPath(fixture.documents.oimlCertificateFile),
      approvalRequestFile: resolveDocumentPath(fixture.documents.approvalRequestFile)
    };

    const loginPage = new LoginPage(page);
    const demandePage = new DemandeApprobationPage(page);

    await loginPage.goto();
    await loginPage.login(credentials.username, credentials.password);

    await demandePage.continueFromHome();
    await demandePage.openDemandeApprobationFromSidebar();
    await demandePage.startNewDemande();
    await demandePage.fillRevisionWithOtherCertificate(fixture.modelDescription);
    await demandePage.uploadRequiredDocuments(requiredDocuments);
    await demandePage.logPotentialEmptyVisibleFields();
    await demandePage.submit();
  });
});
