require('dotenv').config();
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function login(page) {
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');
  await page.goto('https://payhip.com/auth/login', { waitUntil: 'networkidle2' });
  await page.type('input[name="login"]', process.env.PAYHIP_EMAIL, { delay: 60 });
  await page.type('input[name="password"]', process.env.PAYHIP_PASSWORD, { delay: 60 });
  await page.click('button[type="submit"]');
  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 20000 }).catch(() => {});
  console.log('Logged in.');
}

async function updateHoodiePrice(page) {
  console.log('Finding hoodie listing...');
  await page.goto('https://payhip.com/account/products', { waitUntil: 'networkidle2' });
  await sleep(2000);

  // Find the hoodie product link
  const editUrl = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a'));
    const match = links.find(a => a.textContent.includes('SNG Black Hoodie - I Use Ta Have Gas'));
    if (match) {
      // Find edit link nearby
      const row = match.closest('tr') || match.closest('li') || match.closest('div');
      if (row) {
        const editLink = row.querySelector('a[href*="/product/edit"]') || row.querySelector('a[href*="edit"]');
        if (editLink) return editLink.href;
      }
      // Try to extract product ID from product link
      const href = match.href || '';
      const idMatch = href.match(/\/b\/([a-zA-Z0-9]+)/);
      if (idMatch) return `https://payhip.com/product/edit/${idMatch[1]}`;
    }
    return null;
  });

  if (!editUrl) {
    // Try searching the page text for the product
    const allText = await page.evaluate(() => document.body.innerText);
    if (allText.includes('SNG Black Hoodie')) {
      console.log('Found hoodie on page but could not get edit URL. Please update price manually on Payhip to $50.');
    } else {
      console.log('Hoodie listing not found on products page. Please update price manually on Payhip to $50.');
    }
    return;
  }

  console.log('Opening edit page:', editUrl);
  await page.goto(editUrl, { waitUntil: 'networkidle2' });
  await sleep(2000);

  // Update price field
  const priceSel = 'input[name="price"]';
  await page.waitForSelector(priceSel, { timeout: 10000 });
  await page.$eval(priceSel, el => el.value = '');
  await page.type(priceSel, '50.00', { delay: 30 });

  // Submit
  await page.evaluate(() => {
    const btn = document.querySelector('input[type="submit"], button[type="submit"], button.btn-primary');
    if (btn) btn.click();
  });
  await sleep(3000);
  console.log('✓ Hoodie price updated to $50.00');
}

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    defaultViewport: { width: 1280, height: 900 },
  });
  const page = await browser.newPage();
  try {
    await login(page);
    await updateHoodiePrice(page);
  } catch (e) {
    console.error('Error:', e.message);
    console.log('Please update the hoodie price manually on Payhip to $50.');
  } finally {
    await browser.close();
  }
}

main();
