const puppeteer = require('puppeteer');
const http = require('http');
const fs = require('fs');
const path = require('path');

const SERVE_PORT = 8768;
const BASE_DIR = __dirname;

process.env.LD_LIBRARY_PATH = [
  '/tmp/chromium-libs/usr/lib/x86_64-linux-gnu',
  '/tmp/chromium-libs/usr/lib',
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
  await page.setViewport({ width: 816, height: 2000 });
  await page.emulateMediaType('screen');
  await page.goto(`http://127.0.0.1:${SERVE_PORT}/sng-strategy.html`, { waitUntil: 'networkidle0' });

  const info = await page.evaluate(() => {
    const pages = document.querySelectorAll('.page');
    return {
      totalHeight: document.body.scrollHeight,
      bodyPadding: getComputedStyle(document.body).padding,
      pages: Array.from(pages).map((p, i) => ({
        index: i + 1,
        height: p.offsetHeight,
        offsetTop: p.offsetTop,
      }))
    };
  });

  console.log('Total doc height:', info.totalHeight, 'px');
  console.log('Body padding:', info.bodyPadding);
  info.pages.forEach(p => {
    console.log(`Page ${p.index}: height=${p.height}px offsetTop=${p.offsetTop}px`);
  });

  await browser.close();
  server.close();
})().catch(console.error);
