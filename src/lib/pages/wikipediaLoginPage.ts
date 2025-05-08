import { Page, Locator, expect } from '@playwright/test';
import fs from 'fs';

export class WikipediaLoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly logoutMenu: Locator;
  readonly logoutLink: Locator;
  readonly userMenuLink: (username: string) => Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByLabel('Username');
    this.passwordInput = page.getByLabel('Password');
    this.loginButton = page.getByRole('button', { name: 'Log in' });
    this.userMenuLink = (username: string) => page.getByRole('link', { name: process.env.WIKIPEDIA_USERNAME });
  }

  async gotoLoginPage() {
    await this.page.goto('https://en.wikipedia.org/w/index.php?title=Special:UserLogin');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async assertLoginSuccess(username: string) {
    await expect(this.userMenuLink(username)).toBeVisible();
  }

  async logout() {
    await this.page.goto('https://en.wikipedia.org/w/index.php?title=Special:UserLogout&returnto=Main+Page');
    await expect(this.page).toHaveURL(/Special:UserLogout/);
  }

  async saveLocalStorageToFile(page: Page) {
    // Extract localStorage from the browser
    const localStorage = await page.evaluate(() => {
      const store: Record<string, string | null> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key !== null) {
          store[key] = localStorage.getItem(key);
        }
      }
      return store;
    });

    // Format and log to file
    const formatted = JSON.stringify(localStorage, null, 2);
    const timestamp = new Date().toISOString();
    fs.appendFileSync('storage_state.txt', `[${timestamp}]\n${formatted}\n\n`);
  }

}
