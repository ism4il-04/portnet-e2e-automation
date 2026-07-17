import { expect, test } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage.js';
import { getRoleCredentials, hasRequiredCredentials, hasRequiredEnvironment } from '../../../utils/helpers.js';

test.describe('Importateur Authentication', () => {
  test('IMP-AUTH-001 | Login with valid importateur credentials', async ({ page }) => {
    const credentials = await getRoleCredentials('importateur');
    test.skip(!hasRequiredCredentials(credentials), 'Set E2E_IMPORTATEUR_USERNAME/E2E_IMPORTATEUR_PASSWORD or fallback E2E_USERNAME/E2E_PASSWORD.');
    test.skip(!hasRequiredEnvironment(), 'Set LOGIN_URL and HOME_URL in .env or CI secrets.');

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(credentials.username, credentials.password);

    await expect.poll(async () => loginPage.isLoginSuccessful()).toBe(true);
  });
});
