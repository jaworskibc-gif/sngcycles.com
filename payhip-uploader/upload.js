require('dotenv').config();
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');
const path = require('path');
const { MERCH, GUIDES } = require('./listings');

puppeteer.use(StealthPlugin());

const sleep = ms => new Promise(r => setTimeout(r, ms));

const EMAIL = process.env.PAYHIP_EMAIL;
const PASSWORD = process.env.PAYHIP_PASSWORD;
const PROGRESS_FILE = path.join(__dirname, 'progress.json');

if (!EMAIL || !PASSWORD) {
  console.error('ERROR: Set PAYHIP_EMAIL and PAYHIP_PASSWORD in .env');
  process.exit(1);
}

function loadProgress() {
  if (fs.existsSync(PROGRESS_FILE)) return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
  return { completed: [] };
}
function saveProgress(p) { fs.writeFileSync(PROGRESS_FILE, JSON.stringify(p, null, 2)); }
function slug(t) { return t.slice(0, 60).replace(/[^a-z0-9]+/gi, '-').toLowerCase(); }

async function launch() {
  return puppeteer.launch({
    headless: true,
    executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
    defaultViewport: { width: 1280, height: 900 },
    protocolTimeout: 300000,
  });
}

async function login(page) {
  console.log('Logging in...');
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');
  await page.goto('https://payhip.com/auth/login', { waitUntil: 'networkidle2', timeout: 60000 });
  await page.waitForSelector('input[name="login"]', { timeout: 15000 });
  await page.type('input[name="login"]', EMAIL, { delay: 60 });
  await page.type('input[name="password"]', PASSWORD, { delay: 60 });
  await page.click('button[type="submit"]');
  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 20000 }).catch(() => {});
  if (page.url().includes('/auth/login')) throw new Error('Login failed');
  console.log('Logged in.\n');
}

async function fillForm(page, listing) {
  // Title — physical uses name="name", digital uses name="p_name"
  const titleSel = await page.$('input[name="name"]') ? 'input[name="name"]' : 'input[name="p_name"]';
  await page.waitForSelector(titleSel, { timeout: 10000 });
  await page.$eval(titleSel, el => el.value = '');
  await page.type(titleSel, listing.title, { delay: 20 });

  // Price — physical uses name="price", digital uses name="p_price"
  const priceSel = await page.$('input[name="price"]') ? 'input[name="price"]' : 'input[name="p_price"]';
  await page.$eval(priceSel, el => el.value = '');
  await page.type(priceSel, listing.price, { delay: 20 });

  // Cover image — set directly on the file input
  if (listing.image && fs.existsSync(listing.image)) {
    const fileInputs = await page.$$('input[type="file"]');
    if (fileInputs.length > 0) {
      await fileInputs[0].uploadFile(listing.image);
      await sleep(2000);
      console.log(`  Uploaded cover image`);
    }
  }

  // Description via TinyMCE hidden input + editor
  await page.evaluate((text) => {
    // Set hidden input
    const hidden = document.querySelector('input[name="description"]');
    if (hidden) hidden.value = text;
    // Set TinyMCE if loaded
    if (window.tinyMCE) {
      const ed = window.tinyMCE.activeEditor || window.tinyMCE.editors[0];
      if (ed) ed.setContent(text.replace(/\n/g, '<br>'));
    }
  }, listing.fullDesc);
  await sleep(500);

  // SKU — use our item code
  const skuInput = await page.$('input[name="sku"]');
  if (skuInput) {
    await skuInput.click({ clickCount: 3 });
    await page.type('input[name="sku"]', listing.sku || '', { delay: 20 });
  }

  // Submit — scroll to bottom and click
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await sleep(500);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await sleep(500);
  const clicked = await page.evaluate(() => {
    const btn = document.querySelector('input[type="submit"], button[type="submit"], button.btn-primary');
    if (btn) { btn.click(); return true; }
    return false;
  });
  if (!clicked) throw new Error('No submit button found');
  // Wait for redirect away from the add-product page
  await page.waitForFunction(
    () => !window.location.pathname.includes('/product/add'),
    { timeout: 120000 }
  ).catch(() => {});
  await sleep(2000);
}

async function createPhysical(page, listing, progress) {
  const id = slug(listing.title);
  if (progress.completed.includes(id)) { console.log(`  SKIP: ${listing.title}`); return; }
  console.log(`Creating physical: ${listing.title}`);
  await page.goto('https://payhip.com/product/add/physical', { waitUntil: 'networkidle2', timeout: 30000 });
  await fillForm(page, listing);
  progress.completed.push(id);
  saveProgress(progress);
  console.log(`  DONE\n`);
}

async function createDigital(page, listing, progress) {
  const id = slug(listing.title);
  if (progress.completed.includes(id)) { console.log(`  SKIP: ${listing.title}`); return; }
  if (!listing.pdf || !fs.existsSync(listing.pdf)) {
    console.log(`  SKIP (no PDF): ${listing.title}`);
    return;
  }
  console.log(`Creating digital: ${listing.title}`);
  await page.goto('https://payhip.com/product/add/digital', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await sleep(2000);

  // Upload PDF — first file input on the digital page
  const fileInputs = await page.$$('input[type="file"]');
  if (fileInputs.length > 0) {
    await fileInputs[0].uploadFile(listing.pdf);
    await sleep(25000);
    console.log(`  Uploaded PDF`);
  }

  await fillForm(page, listing);
  progress.completed.push(id);
  saveProgress(progress);
  console.log(`  DONE\n`);
}

async function main() {
  const progress = loadProgress();
  const all = [...MERCH, ...GUIDES];
  console.log('=== SNG Cycles Payhip Uploader ===');
  console.log(`Total: ${all.length} | Done: ${progress.completed.length} | Remaining: ${all.length - progress.completed.length}\n`);

  const browser = await launch();
  const page = await browser.newPage();

  try {
    await login(page);
    for (const listing of MERCH) await createPhysical(page, listing, progress);
    for (const listing of GUIDES) await createDigital(page, listing, progress);
    console.log(`\n=== Done! ${progress.completed.length} listings created ===`);
  } catch (err) {
    console.error('\nERROR:', err.message);
  } finally {
    await browser.close();
  }
}

main();
