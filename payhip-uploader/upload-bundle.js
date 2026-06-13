require('dotenv').config();
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');
puppeteer.use(StealthPlugin());

const sleep = ms => new Promise(r => setTimeout(r, ms));
const { GUIDES } = require('./listings');
const bundle = GUIDES.find(g => g.title.includes('Bundle'));

(async () => {
  console.log('Target:', bundle.title);
  console.log('PDF:', bundle.pdf, fs.existsSync(bundle.pdf) ? '(found)' : '(MISSING)');

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
    defaultViewport: { width: 1280, height: 900 },
    protocolTimeout: 300000,
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');
  page.setDefaultNavigationTimeout(120000);

  // Login with retries
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      console.log('Login attempt', attempt);
      await page.goto('https://payhip.com/auth/login', { waitUntil: 'domcontentloaded', timeout: 90000 });
      await page.waitForSelector('input[name="login"]', { timeout: 20000 });
      await page.type('input[name="login"]', process.env.PAYHIP_EMAIL, { delay: 80 });
      await page.type('input[name="password"]', process.env.PAYHIP_PASSWORD, { delay: 80 });
      await page.click('button[type="submit"]');
      await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {});
      if (!page.url().includes('/auth/login')) { console.log('Logged in.'); break; }
      if (attempt < 5) { console.log('  Not logged in, waiting 15s...'); await sleep(15000); }
    } catch(e) {
      console.log('  Login error:', e.message, '— waiting 15s...');
      if (attempt < 5) await sleep(15000);
    }
  }
  if (page.url().includes('/auth/login')) { console.error('Login failed'); await browser.close(); process.exit(1); }

  // Navigate to digital add page
  console.log('Opening new product page...');
  await page.goto('https://payhip.com/product/add/digital', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await sleep(3000);

  // Upload PDF
  console.log('Uploading PDF...');
  const fileInputs = await page.$$('input[type="file"]');
  if (!fileInputs.length) { console.error('No file input'); await browser.close(); process.exit(1); }
  await fileInputs[0].uploadFile(bundle.pdf);
  await sleep(30000);
  console.log('PDF uploaded, filling form...');

  // Title
  const titleSel = await page.$('input[name="p_name"]') ? 'input[name="p_name"]' : 'input[name="name"]';
  await page.$eval(titleSel, el => el.value = '');
  await page.type(titleSel, bundle.title, { delay: 20 });

  // Price
  const priceSel = await page.$('input[name="p_price"]') ? 'input[name="p_price"]' : 'input[name="price"]';
  await page.$eval(priceSel, el => el.value = '');
  await page.type(priceSel, bundle.price, { delay: 20 });

  // Cover image — second file input
  if (bundle.image && fs.existsSync(bundle.image)) {
    const allInputs = await page.$$('input[type="file"]');
    if (allInputs.length > 1) {
      await allInputs[1].uploadFile(bundle.image);
      await sleep(3000);
      console.log('Cover image uploaded');
    }
  }

  // Description
  await page.evaluate((text) => {
    const hidden = document.querySelector('input[name="description"]');
    if (hidden) hidden.value = text;
    if (window.tinyMCE) {
      const ed = window.tinyMCE.activeEditor || window.tinyMCE.editors[0];
      if (ed) ed.setContent(text.replace(/\n/g, '<br>'));
    }
  }, bundle.fullDesc);
  await sleep(500);

  // Submit
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await sleep(1000);
  const clicked = await page.evaluate(() => {
    const btn = document.querySelector('input[type="submit"], button[type="submit"], button.btn-primary');
    if (btn) { btn.click(); return true; }
    return false;
  });
  if (!clicked) { console.error('No submit button'); await browser.close(); process.exit(1); }

  console.log('Submitted, waiting for redirect...');
  await page.waitForFunction(
    () => !window.location.pathname.includes('/product/add'),
    { timeout: 180000 }
  ).catch(e => console.log('Redirect wait timed out:', e.message));

  console.log('Final URL:', page.url());
  await sleep(2000);
  await browser.close();
  console.log('DONE');
})();
