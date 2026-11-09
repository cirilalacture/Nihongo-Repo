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
    const heroTitle = page.locator('main h1');
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
    await page.click('aside a[title="Keluar / Logout"]');
    await expect(page).toHaveURL(/\/admin\/login/);
  });

});

test.describe('Nihongo_repo Responsive & Mobile/Tablet UX Tests', () => {

  test('Mobile viewport (390x844 - iPhone) renders hamburger drawer and touch navigation', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    // Check hamburger button is visible on mobile
    const toggleBtn = page.locator('#mobile-nav-toggle');
    await expect(toggleBtn).toBeVisible();

    // Check desktop nav is hidden
    const desktopNav = page.locator('header nav');
    await expect(desktopNav).toBeHidden();

    // Open mobile menu
    await toggleBtn.click();
    const mobileMenu = page.locator('#mobile-nav-menu');
    await expect(mobileMenu).toBeVisible();
    await expect(mobileMenu.locator('text=Semua Buku & Materi')).toBeVisible();
    await expect(mobileMenu.locator('text=Level JLPT')).toBeVisible();
    await expect(mobileMenu.locator('text=Admin CMS Dashboard')).toBeVisible();

    // Close mobile menu
    await toggleBtn.click();
    await expect(mobileMenu).toBeHidden();
  });

  test('Mobile viewport has zero horizontal scroll overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    const isHorizontallyScrollable = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(isHorizontallyScrollable).toBeFalsy();
  });

  test('Admin panel on mobile shows sticky bottom navigation and hides desktop sidebar', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    
    // Login
    await page.goto('/admin/login');
    await page.fill('#username', 'admin');
    await page.fill('#password', 'admin123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/admin$/);

    // Bottom nav bar should be visible on mobile
    const bottomNav = page.locator('nav.md\\:hidden');
    await expect(bottomNav).toBeVisible();
    await expect(bottomNav.locator('text=Ringkasan')).toBeVisible();
    await expect(bottomNav.locator('text=Materi')).toBeVisible();
    await expect(bottomNav.locator('text=Tambah')).toBeVisible();
    await expect(bottomNav.locator('text=Kategori')).toBeVisible();

    // Desktop sidebar should be hidden
    const desktopSidebar = page.locator('aside');
    await expect(desktopSidebar).toBeHidden();
  });

  test('Tablet viewport (768x1024 - iPad) maintains fluid responsive layout', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    await expect(page.locator('#grid-container')).toBeVisible();
    const isHorizontallyScrollable = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(isHorizontallyScrollable).toBeFalsy();
  });

});
