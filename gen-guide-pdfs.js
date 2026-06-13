const puppeteer = require('puppeteer');
const { PDFDocument } = require('pdf-lib');
const http = require('http');
const fs = require('fs');
const path = require('path');

const SERVE_PORT = 8767;
const BASE_DIR = __dirname;
const OUT_DIR = path.join(BASE_DIR, 'guides');

const GUIDES = [
  { html: 'guide-lbx-frameup',   out: 'guide-001' },
  { html: 'guide-270e-lightbee',  out: 'guide-002' },
  { html: 'guide-crf450-52kw',    out: 'guide-003' },
  { html: 'guide-jackshaft',      out: 'guide-004' },
  { html: 'guide-aplus-trike',    out: 'guide-005' },
  { html: 'guide-surron-bundle',  out: 'guide-bundle' },
  { html: 'sng-ebook',            out: 'sng-ebook' },
];

function mimeFor(p) {
  if (p.endsWith('.png'))  return 'image/png';
  if (p.endsWith('.jpg') || p.endsWith('.jpeg')) return 'image/jpeg';
  if (p.endsWith('.svg'))  return 'image/svg+xml';
  if (p.endsWith('.css'))  return 'text/css';
  if (p.endsWith('.js'))   return 'application/javascript';
  return 'text/html';
}

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const rawUrl = decodeURIComponent(req.url.replace(/\?.*$/, ''));
      const filePath = path.join(BASE_DIR, rawUrl);
      if (fs.existsSync(filePath)) {
        res.writeHead(200, { 'Content-Type': mimeFor(filePath) });
        fs.createReadStream(filePath).pipe(res);
      } else { res.writeHead(404); res.end(); }
    });
    server.listen(SERVE_PORT, '127.0.0.1', () => resolve(server));
  });
}

async function renderPage(browser, url, pageIndex, pageHeight, hasPageDivs) {
  const tab = await browser.newPage();
  await tab.setViewport({ width: 816, height: pageHeight + 10 });
  await tab.emulateMediaType('screen');
  await tab.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

  const smooth = `* { -webkit-font-smoothing: antialiased !important; text-rendering: geometricPrecision !important; }`;
  if (hasPageDivs) {
    await tab.addStyleTag({ content: `
      body { background: transparent !important; padding: 0 !important; margin: 0 !important; }
      .page { display: none !important; box-shadow: none !important; margin: 0 !important; }
      .page:nth-child(${pageIndex}) { display: block !important; }
      ${smooth}
    `});
  } else {
    await tab.addStyleTag({ content: `body { padding: 0 !important; margin: 0 !important; } ${smooth}` });
  }

  const buf = await tab.pdf({
    width: '816px',
    height: `${pageHeight}px`,
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });
  await tab.close();
  return buf;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const server = await startServer();
  console.log('Server ready. Launching browser...\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  });

  try {
    for (const { html, out } of GUIDES) {
      const htmlPath = path.join(BASE_DIR, `${html}.html`);
      if (!fs.existsSync(htmlPath)) {
        console.log(`SKIP — not found: ${html}.html`);
        continue;
      }

      const outPath = path.join(OUT_DIR, `${out}.pdf`);
      console.log(`Generating ${out}.pdf from ${html}.html ...`);

      const url = `http://127.0.0.1:${SERVE_PORT}/${html}.html`;

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

      const pagePdfs = [];
      for (let i = 0; i < pageHeights.length; i++) {
        const buf = await renderPage(browser, url, i + 1, pageHeights[i], hasPageDivs);
        pagePdfs.push(buf);
      }

      const merged = await PDFDocument.create();
      for (const buf of pagePdfs) {
        const src = await PDFDocument.load(buf);
        const pages = await merged.copyPages(src, src.getPageIndices());
        pages.forEach(p => merged.addPage(p));
      }
      const finalBytes = await merged.save();
      fs.writeFileSync(outPath, finalBytes);

      const kb = Math.round(finalBytes.length / 1024);
      console.log(`  -> guides/${out}.pdf  (${kb}KB, ${pageHeights.length} page${pageHeights.length > 1 ? 's' : ''})`);
    }

    console.log('\nDone. PDFs saved to ~/sng-cycles/guides/');
    console.log('Now run the Payhip uploader: cd payhip-uploader && node upload.js');
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
