process.env.LD_LIBRARY_PATH = [
  '/tmp/chromium-libs/usr/lib/x86_64-linux-gnu',
  '/tmp/chromium-libs/usr/lib',
  '/tmp/chromium-libs/lib/x86_64-linux-gnu',
  process.env.LD_LIBRARY_PATH || '',
].join(':');

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/home/shark/.cache/puppeteer/chrome/linux-149.0.7827.22/chrome-linux64/chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  const filePath = 'file://' + path.resolve('/home/shark/sng-cycles/sng-demo-budget.html');
  await page.goto(filePath, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));

  await page.pdf({
    path: '/mnt/c/Users/Shark/Downloads/SNG-Demo-Build-Budget.pdf',
    format: 'Letter',
    printBackground: true,
    landscape: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });

  console.log('PDF saved: SNG-Demo-Build-Budget.pdf');
  await browser.close();
})();
