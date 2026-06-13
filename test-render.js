const puppeteer = require('puppeteer');
const http = require('http');
const fs = require('fs');
const path = require('path');

const SERVE_PORT = 8767;
const BASE_DIR = __dirname;

process.env.LD_LIBRARY_PATH = [
  '/tmp/chromium-libs/usr/lib/x86_64-linux-gnu',
  '/tmp/chromium-libs/usr/lib',
  '/tmp/chromium-libs/lib/x86_64-linux-gnu',
  process.env.LD_LIBRARY_PATH || '',
].filter(Boolean).join(':');

(async () => {
  const server = http.createServer((req, res) => {
    const filePath = path.join(BASE_DIR, req.url.replace(/\?.*$/, ''));
    if (fs.existsSync(filePath)) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      fs.createReadStream(filePath).pipe(res);
    } else { res.writeHead(404); res.end(); }
  });
  await new Promise(r => server.listen(SERVE_PORT, '127.0.0.1', r));

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 816, height: 4000 });
  await page.emulateMediaType('screen');
  await page.goto(`http://127.0.0.1:${SERVE_PORT}/sng-strategy.html`, { waitUntil: 'networkidle0' });

  // Take a screenshot of the full page
  await page.screenshot({ path: '/mnt/c/Users/Shark/Downloads/test-render.png', fullPage: true });
  console.log('Screenshot saved to Downloads/test-render.png');

  await browser.close();
  server.close();
})().catch(console.error);
