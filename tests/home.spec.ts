// @ts-check
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Homepage Common Tests', () => {
  test('Page loads', async ({ page }) => {
    await page.goto('/');
  });
});

test.describe('accessibility tests (light)', () => {
  test.use({ colorScheme: 'light' });

  test('axe wcag tests (light)', async ({ page }) => {
    await page.goto('/');
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

test.describe('accessibility tests (dark)', () => {
  test.use({ colorScheme: 'dark' });

  test('axe wcag tests (dark)', async ({ page }) => {
    await page.goto('/');
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

// test.describe('Homepage Desktop Tests',() => {
//   test.skip(({isMobile}) => isMobile, 'Desktop only tests');

//   test('shows 4 nav elements', async ({ page }) => {
//     await page.goto('/');
//     const list = page.locator('#desktop-links > *');
//     await expect(list).toHaveCount(6);
//   });
// });

test.describe('Homepage Mobile Tests', () => {
  test.skip(({isMobile}) => !isMobile, 'Mobile only tests');

  test('shows menu drawer', async({ page }) => {
    await page.goto('/');
    const menuButton = page.locator('#menu-button');
    await menuButton.waitFor();
    await menuButton.click();
    const drawer = page.locator('.react-aria-Popover');
    await expect(drawer).toBeVisible();
  });

  test('axe wcag menu test', async({ page }) => {
    await page.goto('/');
    const menuButton = page.locator('#menu-button');
    await menuButton.waitFor();
    await menuButton.click();
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
