require('dotenv').config();
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const sleep = ms => new Promise(r => setTimeout(r, ms));
const BASE = '/home/shark/sng-cycles';

// Map listing title keywords to the real product photo
const IMAGE_MAP = [
  { match: 'Stuntin Is A Habit',        image: `${BASE}/hoodie-gw-stuntin-habit.png` },
  { match: 'Stuntin Aint Easy',         image: `${BASE}/hoodie-gw-stuntin-easy.png` },
  { match: 'Leave the School Behind',   image: `${BASE}/hoodie-gw-white.png` },
  { match: 'Core 3-Pack',               image: `${BASE}/sng-tee-collection.png` },
  { match: 'Dark 3-Pack',               image: `${BASE}/apparel-meg-collection.png` },
  { match: 'Cut-Off 3-Pack',            image: `${BASE}/apparel-meg-collection.png` },
  { match: 'Light 5-Pack',              image: `${BASE}/apparel-leave-collection.png` },
  { match: 'Single Tee',                image: `${BASE}/apparel-meg-tee.png` },
  { match: 'Rider Hat',                 image: `${BASE}/sng-hat-collection.png` },
];

async function login(page) {
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');
  await page.goto('https://payhip.com/auth/login', { waitUntil: 'networkidle2' });
  await page.type('input[name="login"]', process.env.PAYHIP_EMAIL, { delay: 60 });
  await page.type('input[name="password"]', process.env.PAYHIP_PASSWORD, { delay: 60 });
  await page.click('button[type="submit"]');
  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 20000 }).catch(() => {});
  console.log('Logged in.\n');
}

async function getProducts(page) {
  const results = [];
  let pageNum = 1;
  while (true) {
    await page.goto(`https://payhip.com/products?page=${pageNum}`, { waitUntil: 'networkidle2' });
    await sleep(2000);
    const batch = await page.evaluate(() => {
      const titles = Array.from(document.querySelectorAll('a[href*="/b/"]'))
        .filter(a => a.textContent.trim() && a.textContent.trim() !== 'View')
        .map(a => ({ title: a.textContent.trim(), code: a.href.split('/b/')[1] }));
      const editLinks = Array.from(document.querySelectorAll('a[href*="/product/edit/"]'))
        .map(a => a.href.split('/product/edit/')[1]);
      return { titles, editLinks };
    });
    if (!batch.editLinks.length) break;
    batch.editLinks.forEach((code, i) => {
      const match = batch.titles.find(t => t.code === code);
      if (match) results.push({ title: match.title, href: `https://payhip.com/product/edit/${code}` });
    });
    // Check if there's a next page
    const hasNext = await page.$('a[rel="next"], .pagination .next');
    if (!hasNext) break;
    pageNum++;
  }
  return results;
}

async function updateCover(page, editUrl, imagePath) {
  await page.goto(editUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await sleep(2000);

  // Find cover image file input
  const fileInputs = await page.$$('input[type="file"]');
  if (!fileInputs.length) { console.log('  No file input found'); return false; }
  await fileInputs[0].uploadFile(imagePath);
  await sleep(3000);
  console.log(`  Uploaded: ${imagePath.split('/').pop()}`);

  // Save
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await sleep(500);
  await page.evaluate(() => {
    const btn = document.querySelector('input[type="submit"], button[type="submit"], button.btn-primary');
    if (btn) btn.click();
  });
  await page.waitForFunction(
    () => !window.location.pathname.includes('/edit'),
    { timeout: 30000 }
  ).catch(() => {});
  await sleep(2000);
  return true;
}

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
    defaultViewport: { width: 1280, height: 900 },
  });
  const page = await browser.newPage();

  try {
    await login(page);

    // Get all products from Payhip
    console.log('Fetching product list...');
    const products = await getProducts(page);
    console.log(`Found ${products.length} products\n`);

    for (const { match, image } of IMAGE_MAP) {
      const product = products.find(p => p.title.includes(match));
      if (!product) {
        console.log(`NOT FOUND: ${match}`);
        continue;
      }
      console.log(`Updating: ${product.title}`);
      await updateCover(page, product.href, image);
      console.log(`  DONE\n`);
    }

    console.log('=== All cover images updated ===');
  } catch (err) {
    console.error('ERROR:', err.message);
    await page.screenshot({ path: 'error-screenshot.png' }).catch(() => {});
  } finally {
    await browser.close();
  }
}

main();
