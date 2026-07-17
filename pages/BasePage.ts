import type { Locator, Page } from '@playwright/test';

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async click(locator: Locator): Promise<void> {
    await locator.click();
  }

  async fill(locator: Locator, text: string): Promise<void> {
    await locator.fill(text);
  }

  async waitForVisible(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
  }

  async getText(locator: Locator): Promise<string | null> {
    return locator.textContent();
  }

  async goto(url: string): Promise<void> {
    await this.page.goto(url);
  }
}