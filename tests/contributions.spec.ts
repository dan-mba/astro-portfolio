// @ts-check
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pageString = './contributions/1/'

test.describe('Contributions Page Tests', () => {
  test('Page loads', async ({ page }) => {
    await page.goto(pageString);
  });
});

test.describe('Contributions accessibility tests (light)', () => {
  test.use({ colorScheme: 'light' });

  test('axe wcag tests (light)', async ({ page }) => {
    await page.goto(pageString);
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

test.describe('Contributions accessibility tests (dark)', () => {
  test.use({ colorScheme: 'dark' });

  test('axe wcag tests (dark)', async ({ page }) => {
    await page.goto(pageString);
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
