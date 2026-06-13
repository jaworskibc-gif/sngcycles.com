const puppeteer = require('puppeteer');
const http = require('http');
const fs = require('fs');
const path = require('path');

const OUT_DIR = '/home/shark/sng-cycles/diagrams';
const BASE_DIR = __dirname;
const PORT = 8767;

process.env.LD_LIBRARY_PATH = [
  '/tmp/chromium-libs/usr/lib/x86_64-linux-gnu',
  '/tmp/chromium-libs/usr/lib',
  '/tmp/chromium-libs/lib/x86_64-linux-gnu',
  process.env.LD_LIBRARY_PATH || '',
].filter(Boolean).join(':');

const sleep = ms => new Promise(r => setTimeout(r, ms));
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

function makeRendererHtml(pageNum) {
  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<style>* { margin:0; padding:0; } body { background:#fff; } canvas { display:block; }</style>
</head><body>
<canvas id="c"></canvas>
<script src="/node_modules/pdfjs-dist/legacy/build/pdf.js"></script>
<script>
pdfjsLib.GlobalWorkerOptions.workerSrc = '/node_modules/pdfjs-dist/legacy/build/pdf.worker.js';
const url = 'http://127.0.0.1:${PORT}/mnt/c/Users/Shark/Downloads/BUILD%20DIAGRAMS%20FOR%20E%20CHOPPER.pdf';
pdfjsLib.getDocument(url).promise.then(function(pdf) {
  return pdf.getPage(${pageNum});
}).then(function(page) {
  var viewport = page.getViewport({ scale: 2.0 });
  var canvas = document.getElementById('c');
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  var ctx = canvas.getContext('2d');
  return page.render({ canvasContext: ctx, viewport: viewport }).promise;
}).then(function() {
  document.title = 'READY';
}).catch(function(err) {
  document.title = 'ERROR:' + err.message;
});
</script>
</body></html>`;
}

function mimeFor(p) {
  if (p.endsWith('.png')) return 'image/png';
  if (p.endsWith('.jpg') || p.endsWith('.jpeg')) return 'image/jpeg';
  if (p.endsWith('.pdf')) return 'application/pdf';
  if (p.endsWith('.css')) return 'text/css';
  if (p.endsWith('.js')) return 'application/javascript';
  return 'text/html';
}

function startServer() {
  return new Promise(resolve => {
    const server = http.createServer((req, res) => {
      const rawUrl = decodeURIComponent(req.url.replace(/\?.*$/, ''));
      if (rawUrl.startsWith('/render/')) {
        const pageNum = parseInt(rawUrl.replace('/render/', ''));
        res.writeHead(200, { 'Content-Type': 'text/html' });
        return res.end(makeRendererHtml(pageNum));
      }
      const filePath = rawUrl.startsWith('/mnt/') ? rawUrl : path.join(BASE_DIR, rawUrl);
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        res.writeHead(200, {
          'Content-Type': mimeFor(filePath),
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache',
        });
        fs.createReadStream(filePath).pipe(res);
      } else {
        res.writeHead(404); res.end('Not found: ' + filePath);
      }
    });
    server.listen(PORT, '127.0.0.1', () => resolve(server));
  });
}

const PAGE_NAMES = [
  'p01-cradle-isometric',
  'p02-jackshaft-overhead',
  'p03-hv-power-text',
  'p04-handlebar-pinout-v1',
  'p05-lv-safety-text',
  'p06-cradle-isometric-2',
  'p07-drivetrain-blueprint',
  'p08-hv-power-map',
  'p09-handlebar-pinout',
  'p10-gas-tank-bay',
  'p11-lv-safety-scheme',
];

async function main() {
  const server = await startServer();
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage','--disable-gpu'],
  });

  // First check if legacy pdf.js exists
  const legacyPath = path.join(BASE_DIR, 'node_modules/pdfjs-dist/legacy/build/pdf.js');
  const buildPath = path.join(BASE_DIR, 'node_modules/pdfjs-dist/build/pdf.min.mjs');
  console.log('Legacy pdf.js exists:', fs.existsSync(legacyPath));
  console.log('Build pdf.mjs exists:', fs.existsSync(buildPath));

  for (let i = 0; i < PAGE_NAMES.length; i++) {
    const pageNum = i + 1;
    const name = PAGE_NAMES[i];
    const tab = await browser.newPage();
    await tab.setViewport({ width: 1800, height: 2600 });

    await tab.goto(`http://127.0.0.1:${PORT}/render/${pageNum}`, { waitUntil: 'networkidle0', timeout: 30000 });

    // Wait for render
    let title = '';
    for (let t = 0; t < 30; t++) {
      title = await tab.title();
      if (title.startsWith('READY') || title.startsWith('ERROR')) break;
      await sleep(300);
    }

    console.log(`Page ${pageNum} title: "${title}"`);

    const canvas = await tab.$('canvas#c');
    const outPath = path.join(OUT_DIR, name + '.png');
    if (canvas) {
      const box = await canvas.boundingBox();
      console.log(`  Canvas size: ${box.width}x${box.height}`);
      await canvas.screenshot({ path: outPath });
      console.log(`  Saved: ${name}.png`);
    } else {
      console.log(`  No canvas found for page ${pageNum}`);
    }
    await tab.close();
  }

  await browser.close();
  server.close();
  console.log('\nDone. Files in:', OUT_DIR);
}

main().catch(e => { console.error(e); process.exit(1); });
