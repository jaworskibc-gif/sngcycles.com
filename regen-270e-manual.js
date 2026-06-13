const puppeteer = require('puppeteer');
const { PDFDocument } = require('pdf-lib');
const http = require('http');
const fs = require('fs');
const path = require('path');

process.env.LD_LIBRARY_PATH = [
  '/tmp/chromium-libs/usr/lib/x86_64-linux-gnu',
  '/tmp/chromium-libs/usr/lib',
  '/tmp/chromium-libs/lib/x86_64-linux-gnu',
  process.env.LD_LIBRARY_PATH || '',
].filter(Boolean).join(':');

const SERVE_PORT = 8770;
const BASE_DIR = '/home/shark/sng-cycles';

function mimeFor(p) {
  if (p.endsWith('.png')) return 'image/png';
  if (p.endsWith('.jpg') || p.endsWith('.jpeg')) return 'image/jpeg';
  if (p.endsWith('.svg')) return 'image/svg+xml';
  if (p.endsWith('.css')) return 'text/css';
  if (p.endsWith('.js')) return 'application/javascript';
  return 'text/html';
}

async function main() {
  const server = await new Promise(resolve => {
    const s = http.createServer((req, res) => {
      const rawUrl = decodeURIComponent(req.url.replace(/\?.*$/, ''));
      const filePath = rawUrl.startsWith('/mnt/') ? rawUrl : path.join(BASE_DIR, rawUrl);
      if (fs.existsSync(filePath)) {
        res.writeHead(200, { 'Content-Type': mimeFor(filePath) });
        fs.createReadStream(filePath).pipe(res);
      } else { res.writeHead(404); res.end(); }
    });
    s.listen(SERVE_PORT, '127.0.0.1', () => resolve(s));
  });

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  });

  try {
    const docs = ['guide-270e-cover', 'guide-270e-manual'];
    const allPageBuffers = [];

    for (const name of docs) {
      console.log(`Processing ${name}...`);
      const url = `http://127.0.0.1:${SERVE_PORT}/${name}.html`;
      const tab = await browser.newPage();
      await tab.setViewport({ width: 816, height: 2000, deviceScaleFactor: 1 });
      await tab.emulateMediaType('screen');
      await tab.goto(url, { waitUntil: 'domcontentloaded', timeout: 120000 });
      await tab.waitForFunction(() => Array.from(document.images).every(i => i.complete), { timeout: 60000 }).catch(() => {});
      await new Promise(r => setTimeout(r, 4000));

      const pageHeights = await tab.evaluate(() => {
        const divs = document.querySelectorAll('.page');
        if (!divs.length) return [document.body.scrollHeight];
        return Array.from(divs).map(d => Math.max(d.scrollHeight, d.offsetHeight));
      });

      console.log(`  ${pageHeights.length} pages: ${pageHeights.join(', ')}px`);

      for (let i = 0; i < pageHeights.length; i++) {
        const h = Math.max(pageHeights[i], 200);
        await tab.setViewport({ width: 816, height: h, deviceScaleFactor: 1 });
        await tab.evaluate((n) => {
          document.querySelectorAll('.page').forEach((el, idx) => {
            el.style.display = idx === (n - 1) ? 'block' : 'none';
          });
        }, i + 1);
        await new Promise(r => setTimeout(r, 300));
        const jpeg = await tab.screenshot({ type: 'jpeg', quality: 90, clip: { x: 0, y: 0, width: 816, height: h } });
        if (jpeg.length > 100) allPageBuffers.push({ jpeg, w: 816, h });
        process.stdout.write(`  page ${i+1}/${pageHeights.length}\r`);
      }
      console.log();
      await tab.close();
    }

    const merged = await PDFDocument.create();
    for (const { jpeg, w, h } of allPageBuffers) {
      try {
        const img = await merged.embedJpg(jpeg);
        const page = merged.addPage([w, h]);
        page.drawImage(img, { x: 0, y: 0, width: w, height: h });
      } catch(e) { console.log('  skip corrupted page'); }
    }
    const bytes = await merged.save();
    fs.writeFileSync('/mnt/c/Users/Shark/Downloads/SNG-270E-Build-Guide.pdf', bytes);
    console.log(`\nSaved: ${Math.round(bytes.length/1024)}KB, ${allPageBuffers.length} pages`);
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch(e => { console.error(e); process.exit(1); });
