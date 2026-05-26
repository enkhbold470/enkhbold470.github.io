import { test, expect } from '@playwright/test';

test.describe('founder-bio SvelteKit migration', () => {
  test('home page renders bio, contacts, updates, and theme toggle', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Inky Ganbold/);
    await expect(page.getByRole('heading', { name: /Hi, I'm Inky Ganbold/i })).toBeVisible();

    await expect(page.getByRole('link', { name: 'Twitter' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Github' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'LinkedIn' })).toBeVisible();

    await expect(page.getByRole('link', { name: 'medium' })).toHaveAttribute(
      'href',
      'https://enkhy.medium.com/'
    );
    await expect(page.getByRole('link', { name: 'blogs' })).toHaveAttribute('href', '/blog');

    await expect(page.getByRole('heading', { name: 'Updates' })).toBeVisible();
    await expect(
      page.getByRole('link', { name: /Student hackers compete at DAHacks 3\.0/i })
    ).toBeVisible();

    await expect(page.getByRole('button', { name: 'Toggle theme' })).toBeVisible();
  });

  test('theme toggle flips the .dark class on <html>', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');
    const before = await html.evaluate((el) => el.classList.contains('dark'));
    await page.getByRole('button', { name: 'Toggle theme' }).click();
    const after = await html.evaluate((el) => el.classList.contains('dark'));
    expect(after).toBe(!before);
  });

  test('blog list loads Medium posts', async ({ page }) => {
    await page.goto('/blog');
    await expect(page).toHaveTitle(/Blog/);
    await expect(page.getByRole('heading', { name: 'Blog', exact: true })).toBeVisible();
    const postLinks = page.locator('a[href^="/blog/"]');
    await expect(postLinks.first()).toBeVisible();
    expect(await postLinks.count()).toBeGreaterThan(0);
    await expect(page.getByRole('link', { name: /Read more on Medium/i })).toBeVisible();
  });

  test('a blog post page renders its title and body', async ({ page }) => {
    await page.goto('/blog');
    const firstPost = page.locator('a[href^="/blog/"]:not([href="/blog"])').first();
    const href = await firstPost.getAttribute('href');
    expect(href).toBeTruthy();
    await page.goto(href!);
    await expect(page.locator('h1.name')).toBeVisible();
    await expect(page.getByRole('link', { name: /View on Medium/i })).toBeVisible();
  });

  test('unknown route renders 404', async ({ page }) => {
    const response = await page.goto('/this-route-does-not-exist');
    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { name: /404/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /Return to home page/i })).toBeVisible();
    await expect(page.getByText('Back to Home')).toBeVisible();
  });

  test('robots.txt is served', async ({ request }) => {
    const res = await request.get('/robots.txt');
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain('User-agent: *');
    expect(body).toContain('Sitemap: https://enk.icu/sitemap.xml');
  });

  test('sitemap.xml is well-formed and includes blog posts', async ({ request }) => {
    const res = await request.get('/sitemap.xml');
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body.startsWith('<?xml')).toBe(true);
    expect(body).toContain('<loc>https://enk.icu/</loc>');
    expect(body).toContain('<loc>https://enk.icu/blog</loc>');
    expect((body.match(/<url>/g) ?? []).length).toBeGreaterThanOrEqual(3);
  });
});
