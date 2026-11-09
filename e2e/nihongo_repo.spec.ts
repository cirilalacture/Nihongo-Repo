import { test, expect } from '@playwright/test';

test.describe('Nihongo_repo Public Catalog E2E Tests', () => {

  test('Homepage loads correctly with Japanese Washi branding', async ({ page }) => {
    await page.goto('/');

    // Check Page Title
    await expect(page).toHaveTitle(/Nihongo_repo/);

    // Check Header Brand
    const brand = page.locator('header a.group');
    await expect(brand).toContainText('Nihongo_repo');
    await expect(brand).toContainText('日');

    // Check Hero Section Headline
    const heroTitle = page.locator('h1');
    await expect(heroTitle).toContainText('Koleksi Terkurasi Materi & Buku');

    // Check that materials exist
    const cards = page.locator('.material-item');
    await expect(cards).not.toHaveCount(0);
  });

  test('Interactive search filters materials by keyword', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.locator('#search-input');
    await expect(searchInput).toBeVisible();

    // Type search query "Kanji"
    await searchInput.fill('Kanji');

    // Verify only matching cards are visible
    const visibleCards = page.locator('.material-item:visible');
    const count = await visibleCards.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const text = await visibleCards.nth(i).textContent();
      expect(text?.toLowerCase()).toContain('kanji');
    }
  });

  test('JLPT level filter chips correctly filter items', async ({ page }) => {
    await page.goto('/');

    // Click N5 filter button
    const n5Button = page.locator('button[data-filter-level="N5"]');
    await n5Button.click();

    // All visible cards should be N5
    const visibleCards = page.locator('.material-item:visible');
    const count = await visibleCards.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const levelBadge = visibleCards.nth(i).locator('span:has-text("N5")');
      await expect(levelBadge).toBeVisible();
    }
  });

  test('View switcher toggles between Grid View and Table View', async ({ page }) => {
    await page.goto('/');

    const gridContainer = page.locator('#grid-container');
    const tableContainer = page.locator('#table-container');
    const viewListBtn = page.locator('#view-list-btn');
    const viewGridBtn = page.locator('#view-grid-btn');

    // Default: grid visible, table hidden
    await expect(gridContainer).toBeVisible();
    await expect(tableContainer).toBeHidden();

    // Switch to Table View
    await viewListBtn.click();
    await expect(tableContainer).toBeVisible();
    await expect(gridContainer).toBeHidden();

    // Switch back to Grid View
    await viewGridBtn.click();
    await expect(gridContainer).toBeVisible();
    await expect(tableContainer).toBeHidden();
  });

  test('Detail modal opens and displays book metadata', async ({ page }) => {
    await page.goto('/');

    const firstDetailBtn = page.locator('.btn-open-detail').first();
    await firstDetailBtn.click();

    const modal = page.locator('#detail-modal');
    await expect(modal).toBeVisible();

    // Check modal contents
    const modalTitle = page.locator('#modal-title');
    await expect(modalTitle).not.toBeEmpty();

    const driveBtn = page.locator('#modal-drive-btn');
    await expect(driveBtn).toHaveAttribute('href', /drive\.google\.com/);

    // Close modal
    const closeBtn = page.locator('#modal-close-btn');
    await closeBtn.click();
    await expect(modal).toBeHidden();
  });

});

test.describe('Nihongo_repo Admin CMS E2E Tests', () => {

  test('Unauthenticated access to /admin redirects to /admin/login', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/admin\/login/);

    const loginTitle = page.locator('h1');
    await expect(loginTitle).toContainText('Admin CMS Login');
  });

  test('Admin login with valid credentials opens dashboard overview', async ({ page }) => {
    await page.goto('/admin/login');

    await page.fill('#username', 'admin');
    await page.fill('#password', 'admin123');
    await page.click('button[type="submit"]');

    // Should be redirected to /admin dashboard
    await expect(page).toHaveURL(/\/admin$/);

    // Verify Dashboard metrics
    await expect(page.locator('h2')).toContainText('Selamat Datang, Sensei Admin!');
    await expect(page.locator('text=Total Materi')).toBeVisible();
    await expect(page.locator('text=Kategori Topik')).toBeVisible();
    await expect(page.locator('text=Akses Google Drive')).toBeVisible();
  });

  test('Admin navigation across Materials and Categories', async ({ page }) => {
    // Login first
    await page.goto('/admin/login');
    await page.fill('#username', 'admin');
    await page.fill('#password', 'admin123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/admin$/);

    // Navigate to Materials Management
    await page.click('a[href="/admin/materials"]');
    await expect(page).toHaveURL(/\/admin\/materials/);
    await expect(page.locator('h2')).toContainText('Daftar Materi & Buku Pembelajaran');
    await expect(page.locator('table')).toBeVisible();

    // Navigate to Categories Management
    await page.click('a[href="/admin/categories"]');
    await expect(page).toHaveURL(/\/admin\/categories/);
    await expect(page.locator('h2')).toContainText('Kelola Kategori Materi');
    await expect(page.locator('text=Tambah Kategori Baru')).toBeVisible();

    // Logout
    await page.click('a[title="Keluar / Logout"]');
    await expect(page).toHaveURL(/\/admin\/login/);
  });

});
