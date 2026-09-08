const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function render() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1300, height: 720, deviceScaleFactor: 2 });

  const tasks = [
    { html: 'system_architecture.html', out: 'architecture_flowchart.png' },
    { html: 'escrow_flowchart.html', out: 'escrow_flowchart.png' }
  ];

  for (const t of tasks) {
    const htmlPath = 'file:///' + path.join(__dirname, 'flowcharts', t.html).replace(/\\/g, '/');
    console.log('Loading:', htmlPath);
    await page.goto(htmlPath, { waitUntil: 'load' });
    const outPath = path.join(__dirname, 'screenshots', t.out);
    await page.screenshot({ path: outPath });
    console.log('Saved to:', outPath);
  }

  await browser.close();

}

render().catch(err => {
  console.error('Error rendering flowchart:', err);
  process.exit(1);
});
