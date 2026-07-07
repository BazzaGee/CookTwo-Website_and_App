// Take screenshot of a plan table HTML at a specific viewport size
const { chromium } = require('C:/Users/barry/OneDrive/Desktop/CookTwo _ Website & App/app/frontend/node_modules/playwright-core');
const path = require('path');

const HTML = 'file:///C:/Users/barry/OneDrive/Desktop/CookTwo%20_%20Website%20%26%20App/website/scripts/guide-images/plan-table.html';
const OUT = 'C:/Users/barry/OneDrive/Desktop/CookTwo _ Website & App/website/scripts/guide-images/plan-table-shot.png';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1200, height: 900 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();
  await page.goto(HTML, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: OUT, fullPage: true });
  console.log('Saved', OUT);
  await browser.close();
})();
