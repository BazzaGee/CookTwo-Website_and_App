// Take screenshot of header-annotated HTML
const { chromium } = require('C:/Users/barry/OneDrive/Desktop/CookTwo _ Website & App/app/frontend/node_modules/playwright-core');

const HTML = 'file:///C:/Users/barry/OneDrive/Desktop/CookTwo%20_%20Website%20%26%20App/website/scripts/guide-images/header-annotated.html';
const OUT = 'C:/Users/barry/OneDrive/Desktop/CookTwo _ Website & App/website/scripts/guide-images/header-annotated.png';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 920, height: 360 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();
  await page.goto(HTML, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: OUT, fullPage: false });
  console.log('Saved', OUT);
  await browser.close();
})();
