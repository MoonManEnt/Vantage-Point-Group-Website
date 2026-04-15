import { test, expect } from '@playwright/test'

test.describe('Hero section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('hero section is visible on page load', async ({ page }) => {
    const hero = page.locator('#hero')
    await expect(hero).toBeVisible()
  })

  test('headline text is present in the DOM', async ({ page }) => {
    await expect(page.getByText('Serious Builders.')).toBeVisible()
    await expect(page.getByText('Ten Movements Forward.')).toBeVisible()
  })

  test('CTA button is visible and points to #arm-quiz', async ({ page }) => {
    const cta = page.getByRole('link', { name: /find your arm/i })
    await expect(cta).toBeVisible()
    await expect(cta).toHaveAttribute('href', '#arm-quiz')
  })

  test('Mosaic V image is present', async ({ page }) => {
    const img = page.getByAltText('Mosaic V — VPG brand mark')
    await expect(img).toBeInTheDocument()
  })
})
