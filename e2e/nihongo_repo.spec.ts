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

  test('Detail modal opens, switches tabs to preview, and displays book metadata', async ({ page }) => {
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

    // Switch to Preview Tab
    const previewTab = page.locator('#modal-tab-preview');
    await previewTab.click();
    await expect(page.locator('#modal-content-preview')).toBeVisible();
    await expect(page.locator('#modal-content-info')).toBeHidden();

    // Switch back to Info Tab
    const infoTab = page.locator('#modal-tab-info');
    await infoTab.click();
    await expect(page.locator('#modal-content-info')).toBeVisible();

    // Close modal
    const closeBtn = page.locator('#modal-close-btn');
    await closeBtn.click();
    await expect(modal).toBeHidden();
  });

  test('Learner can bookmark a material into favorites', async ({ page }) => {
    await page.goto('/');

    // Check initial badge is hidden
    const badge = page.locator('#bookmarks-count-badge');
    await expect(badge).toBeHidden();

    // Click bookmark button on first card
    const firstBookmarkBtn = page.locator('.btn-bookmark').first();
    await firstBookmarkBtn.click();

    // Badge should now show 1
    await expect(badge).toBeVisible();
    await expect(badge).toHaveText('1');

    // Click "Tersimpan" filter button
    const filterSavedBtn = page.locator('#filter-bookmarks-btn');
    await filterSavedBtn.click();

    // Only 1 book should be visible
    const visibleCards = page.locator('.material-item:visible');
    await expect(visibleCards).toHaveCount(1);

    // Unclick bookmark button
    await firstBookmarkBtn.click();
    await expect(badge).toBeHidden();
  });

  test('Dark mode toggle switches between Washi and Sumi-e themes', async ({ page }) => {
    await page.goto('/');

    const htmlEl = page.locator('html');
    const themeBtn = page.locator('#theme-toggle-btn');
    await expect(themeBtn).toBeVisible();

    // Initially light mode
    await expect(htmlEl).not.toHaveClass(/dark/);

    // Click to toggle to dark mode
    await themeBtn.click();
    await expect(htmlEl).toHaveClass(/dark/);

    // Verify Hero action button "Jelajahi Repository" text is visible and legible in dark mode
    const heroExploreBtn = page.locator('a[href="/#katalog"]:has-text("Jelajahi Repository")');
    await expect(heroExploreBtn).toBeVisible();

    // Click again to toggle back to light mode
    await themeBtn.click();
    await expect(htmlEl).not.toHaveClass(/dark/);
  });

  test('Standalone material page loads with OpenGraph metadata and Google Drive preview', async ({ page }) => {
    await page.goto('/materi/mat_minna1');

    // Verify H1 title
    await expect(page.locator('main h1')).toContainText('Minna no Nihongo');

    // Verify breadcrumb
    await expect(page.locator('nav[aria-label="Breadcrumb"]')).toContainText('Beranda');

    // Verify Drive button
    const driveLink = page.locator('a:has-text("Buka di Google Drive")').first();
    await expect(driveLink).toBeVisible();
    await expect(driveLink).toHaveAttribute('href', /drive\.google\.com/);

    // Verify iframe preview exists
    await expect(page.locator('iframe')).toBeVisible();

    // Test Navigation: Clicking navbar "Semua Buku" returns to homepage catalog
    const navSemuaBuku = page.locator('header nav a:has-text("Semua Buku")');
    await navSemuaBuku.click();
    await expect(page).toHaveURL(/\/#katalog$/);
    await expect(page.locator('#katalog')).toBeVisible();
  });

  test('Sitemap.xml and RSS.xml endpoints return valid XML feeds', async ({ request }) => {
    const sitemapRes = await request.get('/sitemap.xml');
    expect(sitemapRes.status()).toBe(200);
    const sitemapText = await sitemapRes.text();
    expect(sitemapText).toContain('<urlset');
    expect(sitemapText).toContain('/materi/');

    const rssRes = await request.get('/rss.xml');
    expect(rssRes.status()).toBe(200);
    const rssText = await rssRes.text();
    expect(rssText).toContain('<rss');
    expect(rssText).toContain('Nihongo_repo');
  });

  test('About page loads correctly with creator profile, avatar, story, and social links', async ({ page }) => {
    await page.goto('/');

    // Click "Tentang" from desktop navbar
    const aboutLink = page.locator('header nav a[href="/about"]');
    await expect(aboutLink).toBeVisible();
    await aboutLink.click();

    // Verify URL is /about
    await expect(page).toHaveURL(/\/about$/);

    // Verify creator name and headline
    const creatorName = page.locator('main h1');
    await expect(creatorName).toContainText('Ciril Alacture');

    // Verify avatar image is visible and starts at pose 1
    const avatarImg = page.locator('#avatar-image');
    await expect(avatarImg).toBeVisible();
    await expect(avatarImg).toHaveAttribute('src', '/avatar/1.png');

    const poseBadge = page.locator('#avatar-pose-label');
    await expect(poseBadge).toHaveText('Pose 1/7');

    // Click avatar button to switch pose to 2.png
    const avatarBtn = page.locator('#avatar-pose-btn');
    await avatarBtn.click();
    await expect(avatarImg).toHaveAttribute('src', '/avatar/2.png');
    await expect(poseBadge).toHaveText('Pose 2/7');

    // Click again to switch pose to 3.png
    await avatarBtn.click();
    await expect(avatarImg).toHaveAttribute('src', '/avatar/3.png');
    await expect(poseBadge).toHaveText('Pose 3/7');

    // Verify story section
    await expect(page.locator('text=Cerita di Balik Nihongo_repo')).toBeVisible();

    // Verify GitHub profile button
    const githubBtn = page.locator('a[href*="github.com/cirilalacture"]').first();
    await expect(githubBtn).toBeVisible();
  });

  test('Sensei companion (Avatar #7) in bottom-right corner displays speech bubble with encouraging quotes on click', async ({ page }) => {
    await page.goto('/');

    // Sensei container and avatar #7 should be visible in bottom-right
    const senseiContainer = page.locator('#sensei-companion-container');
    await expect(senseiContainer).toBeVisible();

    const senseiImg = page.locator('#sensei-avatar-img');
    await expect(senseiImg).toBeVisible();
    await expect(senseiImg).toHaveAttribute('src', '/avatar/7.png');

    // Speech bubble is initially hidden
    const speechBubble = page.locator('#sensei-speech-bubble');
    await expect(speechBubble).toBeHidden();

    // Click Sensei trigger to open encouragement chat
    const triggerBtn = page.locator('#sensei-trigger-btn');
    await triggerBtn.click();
    await expect(speechBubble).toBeVisible();

    // Verify speech bubble displays Japanese quote and meaning
    const jpText = page.locator('#sensei-quote-japanese');
    await expect(jpText).toBeVisible();
    const jpContent = await jpText.textContent();
    expect(jpContent?.length).toBeGreaterThan(0);

    const meaningText = page.locator('#sensei-quote-meaning');
    await expect(meaningText).toBeVisible();

    // Close button dismisses speech bubble
    const closeBtn = page.locator('#sensei-close-btn');
    await closeBtn.click();
    await expect(speechBubble).toBeHidden();
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
    await expect(page.locator('main h2')).toContainText('Selamat Datang, Sensei Admin!');
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
    await expect(page.locator('main h2')).toContainText('Daftar Materi & Buku Pembelajaran');
    await expect(page.locator('table')).toBeVisible();

    // Navigate to Categories Management
    await page.click('a[href="/admin/categories"]');
    await expect(page).toHaveURL(/\/admin\/categories/);
    await expect(page.locator('main h2')).toContainText('Kelola Kategori Materi');
    await expect(page.locator('text=Tambah Kategori Baru')).toBeVisible();

    // Logout
    await page.click('aside a[title="Keluar / Logout"]');
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test('Admin can access Settings and CSV Import/Export tools', async ({ page, request }) => {
    // Login
    await page.goto('/admin/login');
    await page.fill('#username', 'admin');
    await page.fill('#password', 'admin123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/admin$/);

    // Navigate to Settings
    await page.click('a[href="/admin/settings"]');
    await expect(page).toHaveURL(/\/admin\/settings/);
    await expect(page.locator('main h2')).toContainText('Pengaturan Akun & Keamanan');
    await expect(page.locator('#currentPassword')).toBeVisible();
    await expect(page.locator('#newPassword')).toBeVisible();

    // Navigate to Materials and check CSV buttons
    await page.click('a[href="/admin/materials"]');
    await expect(page.locator('a[href="/api/admin/materials/export"]')).toBeVisible();
    await expect(page.locator('a[href="/admin/materials/import"]')).toBeVisible();

    // Visit Import CSV page
    await page.click('a[href="/admin/materials/import"]');
    await expect(page).toHaveURL(/\/admin\/materials\/import/);
    await expect(page.locator('main h2')).toContainText('Impor Koleksi Materi dari Berkas CSV');

    // Test CSV Export endpoint directly
    const exportRes = await request.get('/api/admin/materials/export');
    expect(exportRes.status()).toBe(200);
    const exportText = await exportRes.text();
    expect(exportText).toContain('id,title,romajiTitle,originalTitle');
    expect(exportText).toContain('driveUrl');
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
    await expect(mobileMenu.locator('text=Tentang Pembuat')).toBeVisible();
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
