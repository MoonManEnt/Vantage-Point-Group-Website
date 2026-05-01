import { test, expect } from '@playwright/test'

test.describe('ARM Routing Quiz', () => {
  test('quiz section is visible on scroll', async ({ page }) => {
    await page.goto('/')
    await page.locator('#arm-quiz').scrollIntoViewIfNeeded()
    await expect(page.locator('#arm-quiz')).toBeVisible()
  })

  test('shows question 1 with all 4 options', async ({ page }) => {
    await page.goto('/')
    await page.locator('#arm-quiz').scrollIntoViewIfNeeded()
    await expect(page.getByText('QUESTION 1 OF 4')).toBeVisible()
    await expect(page.getByText('Revenue + Sales')).toBeVisible()
    await expect(page.getByText('Credit + Capital Access')).toBeVisible()
    await expect(page.getByText('Brand + Visibility')).toBeVisible()
    await expect(page.getByText('Infrastructure + Scale')).toBeVisible()
  })

  test('advances through all 4 questions and shows result screen', async ({ page }) => {
    await page.goto('/')
    await page.locator('#arm-quiz').scrollIntoViewIfNeeded()

    await page.getByText('Brand + Visibility').click()
    await expect(page.getByText('QUESTION 2 OF 4')).toBeVisible()

    await page.getByText('Scaling ($500K–$5M)').click()
    await expect(page.getByText('QUESTION 3 OF 4')).toBeVisible()

    await page.getByText('Land more clients').click()
    await expect(page.getByText('QUESTION 4 OF 4')).toBeVisible()

    await page.getByText('DIY with tools').click()

    // Brand + Visibility → ARM 1 (Vantage Point Media)
    const quizSection = page.getByLabel('ARM Routing Quiz')
    await expect(quizSection.getByRole('heading', { name: 'Vantage Point Media' })).toBeVisible()
    await expect(page.getByPlaceholder('your@email.com')).toBeVisible()
  })

  test('result screen shows the correct ARM for Credit + Capital Access', async ({ page }) => {
    await page.goto('/')
    await page.locator('#arm-quiz').scrollIntoViewIfNeeded()

    await page.getByText('Credit + Capital Access').click()
    await page.getByText('Just starting ($0–$50K)').click()
    await page.getByText('Fix credit / access capital').click()
    await page.getByText('Full delegation').click()

    // Credit + Capital Access → ARM 2 (Dispute2Go)
    const quizSection = page.getByLabel('ARM Routing Quiz')
    await expect(quizSection.getByRole('heading', { name: 'Dispute2Go' })).toBeVisible()
  })
})
