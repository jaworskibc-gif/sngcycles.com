process.env.LD_LIBRARY_PATH = [
  '/tmp/chromium-libs/usr/lib/x86_64-linux-gnu',
  '/tmp/chromium-libs/usr/lib',
  '/tmp/chromium-libs/lib/x86_64-linux-gnu',
  process.env.LD_LIBRARY_PATH || '',
].join(':');

const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/home/shark/.cache/puppeteer/chrome/linux-149.0.7827.22/chrome-linux64/chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.goto('file:///home/shark/sng-cycles/sng-letterhead.html', { waitUntil: 'networkidle0' });
  await page.pdf({
    path: '/mnt/c/Users/Shark/Downloads/SNG-ASI-Letter.pdf',
    format: 'Letter',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' }
  });
  await browser.close();
  const stat = fs.statSync('/mnt/c/Users/Shark/Downloads/SNG-ASI-Letter.pdf');
  console.log('Done:', Math.round(stat.size/1024) + 'KB');
})();
