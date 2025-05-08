import { test, expect } from '@playwright/test';
import { WikipediaLoginPage } from './pages/wikipediaLoginPage';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const wikipediaUsername = process.env.WIKIPEDIA_USERNAME;
const wikipediaPassword = process.env.WIKIPEDIA_PASSWORD;

const authFile = 'src/auth/login.json';

/**
 * Manually create a Wikipedia account and then finish this test
 * so that it signs into Wikipedia and captures the logged-in
 * session to src/auth/login.json, so that the tests in all.test.ts
 * run as a signed in user.
 */
test('Sign in to Wikipedia', async ({ page }) => {
    if (!wikipediaUsername || !wikipediaPassword) {
        throw new Error(`Need a username and password to sign in!`);
    }
    const loginPage = new WikipediaLoginPage(page);

    // Go to login and perform login
    await loginPage.gotoLoginPage();
    await loginPage.login(wikipediaUsername, wikipediaPassword);
    await loginPage.assertLoginSuccess(wikipediaUsername);

    // Capturing storage state
    await loginPage.saveLocalStorageToFile(page);

    // Perform logout and assert
    await loginPage.logout();

});
