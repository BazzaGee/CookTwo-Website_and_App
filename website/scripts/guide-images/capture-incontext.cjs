// Screenshot each new image in context
const { chromium } = require('C:/Users/barry/OneDrive/Desktop/CookTwo _ Website & App/app/frontend/node_modules/playwright-core');

const targetImages = [
  'guide-26b-header-annotated.webp',
  'guide-12-shopping-done.webp',
  'guide-14-pantry-populated.webp',
  'guide-16-meals-tonight-card.webp',
  'guide-17-meals-tonight-plating.webp',
  'guide-18-meals-saved.webp',
  'guide-20-profiles.webp',
  'guide-29-link-kitchen.webp',
  'guide-28-activity-log.webp',
  'guide-31-plan-table.webp',
  'guide-23-notifications.webp',
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1243, height: 1000 },
    deviceScaleFactor: 1
  });
  const page = await context.newPage();
  await page.goto('http://localhost:4321/app-guide/index.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  for (const img of targetImages) {
    const el = page.locator(`img[src*="${img}"]`).first();
    if (await el.count() === 0) {
      console.log('MISSING:', img);
      continue;
    }
    const fig = el.locator('xpath=ancestor::figure').first();
    await fig.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    const out = 'C:/Users/barry/OneDrive/Desktop/CookTwo _ Website & App/website/scripts/guide-images/incontext-' + img.replace('.webp', '.png');
    await fig.screenshot({ path: out });
    console.log('Captured', img, '→', out);
  }

  await browser.close();
})();
