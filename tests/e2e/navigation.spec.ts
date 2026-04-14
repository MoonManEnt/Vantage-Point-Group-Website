import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('nav is transparent on load', async ({ page }) => {
    await page.goto('/')
    const header = page.locator('header')
    // On load, header should NOT have the scrolled background classes
    const classes = await header.getAttribute('class') ?? ''
    expect(classes).not.toMatch(/bg-\[var\(--color-navy\)\]/)
  })

  test('Portfolio button opens mega menu', async ({ page }) => {
    await page.goto('/')
    await page.click('button[aria-label="Portfolio"]')
    const menu = page.getByRole('menu')
    await expect(menu).toHaveAttribute('aria-hidden', 'false')
    await expect(menu.getByText('Dispute2Go').first()).toBeVisible()
  })

  test('mobile hamburger opens full-screen overlay', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await page.click('button[aria-label="Open menu"]')
    const overlay = page.getByRole('dialog')
    await expect(overlay).not.toHaveClass(/translate-x-full/)
    await expect(overlay.getByText('VPG Global Expansion').first()).toBeVisible()
  })

  test('skip link is first focusable element', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Tab')
    const focused = page.locator(':focus')
    await expect(focused).toContainText(/skip to main content/i)
  })
})
