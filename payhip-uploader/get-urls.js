require('dotenv').config();
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const EMAIL = process.env.PAYHIP_EMAIL;
const PASSWORD = process.env.PAYHIP_PASSWORD;

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
  await page.goto('https://payhip.com/auth/login', { waitUntil: 'networkidle2', timeout: 60000 });
  await page.waitForSelector('input[name="login"]', { timeout: 15000 });
  await page.type('input[name="login"]', EMAIL, { delay: 60 });
  await page.type('input[name="password"]', PASSWORD, { delay: 60 });
  await page.click('button[type="submit"]');
  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 20000 }).catch(() => {});

  const results = [];
  for (let p = 1; p <= 3; p++) {
    await page.goto(`https://payhip.com/products?page=${p}`, { waitUntil: 'networkidle2', timeout: 30000 });
    const items = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a[href*="/b/"]')).map(a => ({
        title: (a.innerText || a.textContent).trim().slice(0, 80),
        url: 'https://payhip.com' + a.getAttribute('href').replace(/^https:\/\/payhip\.com/, '')
      })).filter(x => x.url.includes('/b/') && x.title.length > 2);
    });
    results.push(...items);
    if (items.length === 0) break;
  }

  const seen = new Set();
  results.filter(r => { if (seen.has(r.url)) return false; seen.add(r.url); return true; })
         .forEach(r => console.log(`${r.url}  |  ${r.title}`));

  await browser.close();
})();
