// Verify the app-guide page renders all the new images
const { chromium } = require('C:/Users/barry/OneDrive/Desktop/CookTwo _ Website & App/app/frontend/node_modules/playwright-core');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1243, height: 800 },
    deviceScaleFactor: 1
  });
  const page = await context.newPage();
  await page.goto('http://localhost:4321/app-guide/index.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const expected = [
    'guide-12-shopping-done.webp',
    'guide-14-pantry-populated.webp',
    'guide-16-meals-tonight-card.webp',
    'guide-17-meals-tonight-plating.webp',
    'guide-18-meals-saved.webp',
    'guide-20-profiles.webp',
    'guide-23-notifications.webp',
    'guide-26b-header-annotated.webp',
    'guide-28-activity-log.webp',
    'guide-29-link-kitchen.webp',
    'guide-31-plan-table.webp',
  ];

  for (const img of expected) {
    const found = await page.locator(`img[src*="${img}"]`).count();
    if (found === 0) {
      console.log('MISSING:', img);
    } else {
      const box = await page.locator(`img[src*="${img}"]`).first().boundingBox();
      const natural = await page.locator(`img[src*="${img}"]`).first().evaluate(el => ({ w: el.naturalWidth, h: el.naturalHeight }));
      console.log(`OK    : ${img}  rendered=${Math.round(box.width)}x${Math.round(box.height)}  source=${natural.w}x${natural.h}  y=${Math.round(box.y)}`);
    }
  }

  await browser.close();
})();
