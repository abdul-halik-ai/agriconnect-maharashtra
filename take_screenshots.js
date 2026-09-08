const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.join(__dirname, 'screenshots');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function capture() {
  console.log('Launching browser with chrome:', CHROME_PATH);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1400,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900, deviceScaleFactor: 2 });

  const targets = [
    { url: 'http://localhost:3000/farmer/prices', name: 'price_intelligence.png' },
    { url: 'http://localhost:3000/farmer/lots', name: 'lot_management.png' },
    { url: 'http://localhost:3000/farmer/deals/deal-1', name: 'escrow_deal.png' },
    { url: 'http://localhost:3000/fpo/dashboard', name: 'fpo_dashboard.png' },
    { url: 'http://localhost:3000/fpo/lots/aggregate', name: 'fpo_aggregate.png' },
    { url: 'http://localhost:3000/admin/dashboard', name: 'admin_dashboard.png' },
  ];

  for (const t of targets) {
    try {
      console.log(`Navigating to ${t.url}...`);
      await page.goto(t.url, { waitUntil: 'networkidle0', timeout: 15000 });
      // wait 1 second for any animations or chart rendering
      await new Promise(r => setTimeout(r, 1000));
      const dest = path.join(OUTPUT_DIR, t.name);
      await page.screenshot({ path: dest, fullPage: false });
      console.log(`Saved screenshot to ${dest}`);
    } catch (err) {
      console.error(`Failed to capture ${t.url}:`, err.message);
    }
  }

  // Also try capture lot passport specifically if lot id exists
  try {
    console.log('Navigating to passport modal or page...');
    await page.goto('http://localhost:3000/farmer/lots/cm4b002/passport', { waitUntil: 'networkidle0', timeout: 15000 }).catch(() => null);
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'lot_passport.png'), fullPage: false });
    console.log('Saved lot_passport.png');
  } catch (e) {
    console.log('Passport page error:', e.message);
  }

  await browser.close();
  console.log('Finished capturing all screenshots!');
}

capture().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
