const puppeteer = require('puppeteer');
const { PDFDocument } = require('pdf-lib');
const http = require('http');
const fs = require('fs');
const path = require('path');

const SERVE_PORT = 8766;
const BASE_DIR = __dirname;

const docs = [
  'sng-strategy',
  'sng-investor-onepager',
  'guide-catalog',
  'guide-270e-cover',
  'guide-270e-manual',
  'guide-hd-softail-manual',
  'guide-lbx-frameup',
  'guide-270e-lightbee',
  'guide-crf450-52kw',
  'guide-jackshaft',
  'guide-aplus-trike',
  'guide-surron-bundle',
  'guide-gas-build',
];

process.env.LD_LIBRARY_PATH = [
  '/tmp/chromium-libs/usr/lib/x86_64-linux-gnu',
  '/tmp/chromium-libs/usr/lib',
  '/tmp/chromium-libs/lib/x86_64-linux-gnu',
  process.env.LD_LIBRARY_PATH || '',
].filter(Boolean).join(':');

function mimeFor(p) {
  if (p.endsWith('.png')) return 'image/png';
  if (p.endsWith('.jpg') || p.endsWith('.jpeg')) return 'image/jpeg';
  if (p.endsWith('.gif')) return 'image/gif';
  if (p.endsWith('.svg')) return 'image/svg+xml';
  if (p.endsWith('.css')) return 'text/css';
  if (p.endsWith('.js')) return 'application/javascript';
  return 'text/html';
}

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const rawUrl = decodeURIComponent(req.url.replace(/\?.*$/, ''));
      // Allow serving absolute paths (e.g. /mnt/c/Users/Shark/Downloads/...)
      const filePath = rawUrl.startsWith('/mnt/') ? rawUrl : path.join(BASE_DIR, rawUrl);
      if (fs.existsSync(filePath)) {
        res.writeHead(200, { 'Content-Type': mimeFor(filePath) });
        fs.createReadStream(filePath).pipe(res);
      } else { res.writeHead(404); res.end(); }
    });
    server.listen(SERVE_PORT, '127.0.0.1', () => resolve(server));
  });
}

// Render one .page div (or full body if no .page divs) to a PDF buffer at its exact height
async function renderPageDiv(browser, url, pageIndex, pageHeight, hasPageDivs) {
  const tab = await browser.newPage();
  await tab.setViewport({ width: 816, height: pageHeight + 10 });
  await tab.emulateMediaType('screen');
  await tab.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

  const sharpText = `
    * { -webkit-font-smoothing: antialiased !important; -moz-osx-font-smoothing: grayscale !important; text-rendering: geometricPrecision !important; }
  `;
  if (hasPageDivs) {
    await tab.addStyleTag({ content: `
      body { background: transparent !important; padding: 0 !important; margin: 0 !important; }
      .page { display: none !important; box-shadow: none !important; margin: 0 !important; }
      .page:nth-child(${pageIndex}) { display: block !important; }
      ${sharpText}
    `});
  } else {
    await tab.addStyleTag({ content: `
      body { padding: 0 !important; margin: 0 !important; }
      ${sharpText}
    `});
  }

  const pdfBuf = await tab.pdf({
    width: '816px',
    height: `${pageHeight}px`,
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });

  await tab.close();
  return pdfBuf;
}

async function main() {
  const server = await startServer();
  console.log(`Server on port ${SERVE_PORT}`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  });
  console.log('Chrome ready.\n');

  try {
    for (const name of docs) {
      const htmlPath = path.join(BASE_DIR, `${name}.html`);
      if (!fs.existsSync(htmlPath)) {
        console.log(`SKIP — not found: ${name}.html`);
        continue;
      }
      console.log(`Generating ${name}.pdf ...`);

      const url = `http://127.0.0.1:${SERVE_PORT}/${name}.html`;

      // Get page heights
      const probe = await browser.newPage();
      await probe.setViewport({ width: 816, height: 2000 });
      await probe.emulateMediaType('screen');
      await probe.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
      const { pageHeights, hasPageDivs } = await probe.evaluate(() => {
        const divs = document.querySelectorAll('.page');
        if (divs.length === 0) return { pageHeights: [document.body.scrollHeight], hasPageDivs: false };
        return { pageHeights: Array.from(divs).map(d => d.offsetHeight), hasPageDivs: true };
      });
      await probe.close();

      // Render each page div to its own PDF
      const pagePdfs = [];
      for (let i = 0; i < pageHeights.length; i++) {
        const h = pageHeights[i];
        const buf = await renderPageDiv(browser, url, i + 1, h, hasPageDivs);
        pagePdfs.push(buf);
      }

      // Merge all page PDFs
      const merged = await PDFDocument.create();
      for (const buf of pagePdfs) {
        const src = await PDFDocument.load(buf);
        const pages = await merged.copyPages(src, src.getPageIndices());
        pages.forEach(p => merged.addPage(p));
      }
      const finalBytes = await merged.save();

      const outPath = `/mnt/c/Users/Shark/Downloads/${name}.pdf`;
      fs.writeFileSync(outPath, finalBytes);

      const kb = Math.round(finalBytes.length / 1024);
      console.log(`  -> ${kb}KB (${pageHeights.length} pages: ${pageHeights.join(', ')}px)`);
    }

    console.log('\nAll PDFs saved to C:\\Users\\Shark\\Downloads\\');
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch(e => { console.error(e); process.exit(1); });
