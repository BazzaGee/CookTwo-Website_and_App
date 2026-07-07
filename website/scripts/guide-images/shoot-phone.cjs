// Take screenshot of a phone-mockup HTML at iPhone 14 Pro size
const { chromium } = require('C:/Users/barry/OneDrive/Desktop/CookTwo _ Website & App/app/frontend/node_modules/playwright-core');

(async () => {
  const html = process.argv[2];
  const out = process.argv[3];
  const fullPage = process.argv[4] === 'full';
  if (!html || !out) {
    console.error('Usage: node shoot-phone.cjs <input.html> <output.png> [full]');
    process.exit(1);
  }
  const url = 'file:///' + html.replace(/\\/g, '/').replace(/ /g, '%20').replace(/#/g, '%23');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 430, height: 932 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: out, fullPage });
  console.log('Saved', out);
  await browser.close();
})();
