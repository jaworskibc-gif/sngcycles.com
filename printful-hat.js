require('dotenv').config({ path: '/home/shark/sng-cycles/payhip-uploader/.env' });
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const readline = require('readline');
puppeteer.use(StealthPlugin());

const sleep = ms => new Promise(r => setTimeout(r, ms));

const HAT_FILE = '/home/shark/sng-cycles/builder-series-hats/printful/embroidery/front-embroidery-sng-classic.png';
const HAT_TITLE = 'SNG Builder\'s Series Hat - I Use Ta Have Gas (Black)';
const HAT_PRICE = '36.99';

async function waitForEnter(msg) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(msg, () => { rl.close(); resolve(); }));
}

async function main() {
  console.log('\n=== SNG Printful Hat Setup ===\n');

  const browser = await puppeteer.launch({
    headless: false,
    executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--start-maximized'],
    defaultViewport: null,
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');

  console.log('Opening Printful login page...');
  await page.goto('https://www.printful.com/auth/login', { waitUntil: 'networkidle2', timeout: 60000 });

  await waitForEnter('\n>> Sign into Printful in the browser window, then press ENTER here to continue...\n');

  console.log('Navigating to add product...');
  await page.goto('https://www.printful.com/dashboard/default/products/add', { waitUntil: 'networkidle2', timeout: 60000 });
  await sleep(3000);

  // Search for snapback / embroidered hat
  console.log('Searching for embroidered snapback...');
  const searchSel = 'input[placeholder*="search"], input[type="search"], input[name="search"]';
  const hasSearch = await page.$(searchSel);
  if (hasSearch) {
    await page.type(searchSel, 'snapback', { delay: 80 });
    await sleep(2000);
  }

  // Take a screenshot to see current state
  await page.screenshot({ path: '/home/shark/sng-cycles/printful-step1.png' });
  console.log('Screenshot saved: printful-step1.png');

  await waitForEnter('\n>> In the browser: click on the Embroidered Snapback hat product, then press ENTER here...\n');
  await sleep(2000);
  await page.screenshot({ path: '/home/shark/sng-cycles/printful-step2.png' });

  await waitForEnter('\n>> Select the BLACK colorway in the browser, then press ENTER here...\n');
  await sleep(2000);

  // Click "Start designing" or "Proceed to mockup generator"
  const startBtn = await page.$('button[data-testid*="start"], a[data-testid*="start"], button::-p-text(Start designing)');
  if (startBtn) {
    await startBtn.click();
    await sleep(3000);
  }

  await page.screenshot({ path: '/home/shark/sng-cycles/printful-step3.png' });
  await waitForEnter('\n>> Press ENTER when you are on the mockup/design editor page (where you upload the embroidery file)...\n');

  // Try to find and click upload button
  console.log('Looking for upload button...');
  const uploadBtn = await page.$('input[type="file"]');
  if (uploadBtn) {
    await uploadBtn.uploadFile(HAT_FILE);
    console.log('✓ Embroidery file uploaded');
    await sleep(4000);
    await page.screenshot({ path: '/home/shark/sng-cycles/printful-step4.png' });
    console.log('Screenshot: printful-step4.png — check the design placement');
  } else {
    console.log('Could not find file input automatically.');
    await waitForEnter('\n>> Upload the embroidery file manually from:\n   \\\\wsl$\\Ubuntu\\home\\shark\\sng-cycles\\builder-series-hats\\printful\\embroidery\\front-embroidery-sng-classic.png\n\nThen press ENTER...\n');
  }

  await waitForEnter('\n>> When the design looks good, click "Proceed" in the browser, then press ENTER here...\n');
  await sleep(2000);

  // Try to fill in product title and price
  console.log('Looking for product details fields...');
  await page.screenshot({ path: '/home/shark/sng-cycles/printful-step5.png' });

  const titleInput = await page.$('input[name="name"], input[placeholder*="name"], input[placeholder*="title"]');
  if (titleInput) {
    await titleInput.click({ clickCount: 3 });
    await titleInput.type(HAT_TITLE, { delay: 30 });
    console.log('✓ Title set');
  }

  const priceInput = await page.$('input[name="retail_price"], input[placeholder*="price"], input[name="price"]');
  if (priceInput) {
    await priceInput.click({ clickCount: 3 });
    await priceInput.type(HAT_PRICE, { delay: 30 });
    console.log('✓ Price set to $36.99');
  }

  await page.screenshot({ path: '/home/shark/sng-cycles/printful-step6.png' });
  console.log('\nScreenshots saved in /home/shark/sng-cycles/ — check each one if anything looks off.');
  await waitForEnter('\n>> Review the product details in the browser. When ready to submit, press ENTER and I\'ll click Save...\n');

  // Try to click save/submit
  const saveBtn = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.find(b => /save|submit|confirm|add to store/i.test(b.textContent));
  });
  if (saveBtn) {
    await saveBtn.click();
    await sleep(4000);
    console.log('✓ Save clicked');
  }

  await page.screenshot({ path: '/home/shark/sng-cycles/printful-final.png' });
  console.log('\n✓ Done! Check printful-final.png to confirm the hat was saved.');
  console.log('Check your Printful dashboard to verify the product is live.\n');

  await waitForEnter('Press ENTER to close the browser...');
  await browser.close();
}

main().catch(e => {
  console.error('\nError:', e.message);
  console.log('Check the screenshots in /home/shark/sng-cycles/ to see where it stopped.');
  process.exit(1);
});
