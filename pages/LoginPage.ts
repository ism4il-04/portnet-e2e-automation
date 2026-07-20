import type { Locator, Page } from '@playwright/test';
import { APP_URLS, LOGIN_PATH_PATTERN } from '../constants/urls.js';
import { BasePage } from './BasePage.js';

export class LoginPage extends BasePage {
  private usernameInput: Locator;
  private passwordInput: Locator;
  private loginButton: Locator;
  private postLoginIndicator: Locator;

  constructor(page: Page) {
    super(page);

    // Prefer PortNet labels first, then broad fallbacks for occasional UI rendering differences.
    this.usernameInput = page
      .getByRole('textbox', { name: /nom utilisateur/i })
      .or(page.getByRole('textbox', { name: /username|user name/i }))
      .or(page.locator('input[name="username"], input[type="email"], input[autocomplete="username"]').first())
      .or(page.locator('input[type="text"]').first());

    this.passwordInput = page
      .getByRole('textbox', { name: /mot de passe|password/i })
      .or(page.locator('input[name="password"], input[type="password"], input[autocomplete="current-password"]').first())
      .or(page.locator('input[type="password"]').first());

    this.loginButton = page.getByRole('button', { name: /se connecter|log in|login|sign in|signin/i }).first();
    this.postLoginIndicator = page.locator('[data-testid="dashboard"], [data-testid="app-shell"], [data-testid="home-page"]').first();
  }

  async goto(): Promise<void> {
    if (!APP_URLS.login) {
      throw new Error('LOGIN_URL is not configured. Set LOGIN_URL in your local .env or CI secret.');
    }

    await super.goto(APP_URLS.login);

    const blockedHeading = this.page.getByRole('heading', { name: /web page blocked!/i });
    if (await blockedHeading.count()) {
      throw new Error('Access blocked by security gateway (WAF). Login page is unavailable from current network/IP.');
    }
  }

  async login(username: string, password: string): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    await this.waitForVisible(this.usernameInput);
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    await this.loginButton.click({ noWaitAfter: true });
    await this.page.waitForTimeout(2000);

    if (APP_URLS.home) {
      await this.page.goto(APP_URLS.home, { waitUntil: 'domcontentloaded' });
    }
  }

  async isLoginSuccessful(timeout = 10000): Promise<boolean> {
    try {
      await Promise.race([
        this.page.waitForURL((url) => !LOGIN_PATH_PATTERN.test(url.pathname), { timeout }),
        this.postLoginIndicator.waitFor({ state: 'visible', timeout })
      ]);
      return true;
    } catch {
      return false;
    }
  }
}