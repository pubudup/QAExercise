import { Page, expect } from '@playwright/test';

/**
 * This test was generated using Ranger's test recording tool. The test is supposed to:
 * 1. Navigate to Wikipedia's homepage
 * 2. Assert there are less than 7,000,000 articles in English
 * 3. Assert the page's text gets smaller when the 'Small' text size option is selected
 * 4. Assert the page's text gets larger when the 'Large' text size option is selected
 * 5. Assert the page's text goes back to the default size when the 'Standard' text size option is selected
 *
 * Instructions: Run the test and ensure it performs all steps described above
 *
 * Good luck!
 */
export async function run(page: Page, params: {}) {
       /** STEP: Navigate to URL */
        await page.goto('https://en.wikipedia.org/wiki/Main_Page');

        /** STEP: Click the link to view the total number of articles in English */
        const articlesCount = page.locator('xpath=//*[@id="articlecount"]/ul/li[2]');
        const text = await articlesCount.innerText();

        /** Cleans text output to get number of articles */
        const count = text.trim().split(/\s+/)[0].replace(/,/g, '');
        console.log('Article Count:', count);
        const value = parseInt(count);
        expect(value).toBeLessThan(7000000)

        /** STEP: Select the 'Small' text size option in the appearance settings */
        const smallTextSizeOption = page.getByRole('radio', { name: 'Small' });
        await smallTextSizeOption.click();
        await expect(smallTextSizeOption).toBeChecked();

        /** STEP: Click the 'Large' text size option to change the display size */
        const largeTextSizeOption = page.getByRole('radio', { name: 'Large' });
        await largeTextSizeOption.click();
        await expect(largeTextSizeOption).toBeChecked();

        /** STEP: Click the 'Standard' text size option in the appearance settings */
        const standardTextSizeButton = page.getByLabel('Standard').first();
        await standardTextSizeButton.click();
        await expect(standardTextSizeButton).toBeChecked();
}
