// gen-mvp-print-art.js
// Generates print-ready PNG art files for Printful DTG upload
// Output: /home/shark/sng-cycles/assets/printful-ready/

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const OUT = '/home/shark/sng-cycles/assets/printful-ready';
fs.mkdirSync(OUT, { recursive: true });

// ── SVG GENERATORS ──────────────────────────────────────────────────────────

// Shared SNG fin + SNG text logo (white on transparent)
function sngLogoSVG(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 300 440">
  <path d="M 35,355 C 12,268 52,118 90,15 C 112,68 170,252 225,355 Z" fill="#ffffff"/>
  <text x="130" y="422" text-anchor="middle"
        font-family="Impact,'Arial Black',Arial,sans-serif"
        font-weight="900" font-size="86" fill="#ffffff" letter-spacing="14">SNG</text>
</svg>`;
}

// Back print: "I USE TA HAVE GAS. / NOW I JUST HAUL ASS."
// White text on transparent — Printful places on black garment
function backPrintSVG(w, h) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <text x="${w/2}" y="${h*0.38}" text-anchor="middle"
        font-family="Impact,'Arial Black',Arial,sans-serif"
        font-weight="900" font-size="${Math.round(w*0.088)}" fill="#ffffff" letter-spacing="4">I USE TA HAVE GAS.</text>
  <text x="${w/2}" y="${h*0.62}" text-anchor="middle"
        font-family="Impact,'Arial Black',Arial,sans-serif"
        font-weight="900" font-size="${Math.round(w*0.088)}" fill="#ffffff" letter-spacing="4">NOW I JUST HAUL ASS.</text>
</svg>`;
}

// Small front chest logo for tee (white on transparent)
function frontLogoSmallSVG() {
  return sngLogoSVG(600);
}

// Large front logo for hoodie (white on transparent)
function frontLogoBigSVG() {
  return sngLogoSVG(900);
}

// ── WRITE FUNCTION ───────────────────────────────────────────────────────────

async function writePNG(svg, outPath) {
  await sharp(Buffer.from(svg)).png().toFile(outPath);
  console.log('✓', path.basename(outPath));
}

// ── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Generating Printful print-ready art...\n');

  // TEE — front: small chest logo (4" wide @ 300dpi = 1200px)
  await writePNG(frontLogoSmallSVG(), path.join(OUT, 'tee-front-logo-chest.png'));

  // TEE — back: full back print (12"x14" @ 300dpi = 3600x4200px — Printful max print area)
  await writePNG(backPrintSVG(3600, 4200), path.join(OUT, 'tee-back-gas-print.png'));

  // HOODIE — front: large center logo (8" wide @ 300dpi = 2400px)
  await writePNG(frontLogoBigSVG(), path.join(OUT, 'hoodie-front-logo-center.png'));

  // HOODIE — back: same back print as tee
  await writePNG(backPrintSVG(3600, 4200), path.join(OUT, 'hoodie-back-gas-print.png'));

  // HAT — already done in builder-series-hats/printful/
  console.log('✓ hat-front-embroidery-sng-classic.png (already in builder-series-hats/printful/embroidery/)');

  console.log('\nAll files saved to:', OUT);
  console.log('\nPrintful upload map:');
  console.log('  HAT    → builder-series-hats/printful/embroidery/front-embroidery-sng-classic.png');
  console.log('  TEE    front → assets/printful-ready/tee-front-logo-chest.png');
  console.log('  TEE    back  → assets/printful-ready/tee-back-gas-print.png');
  console.log('  HOODIE front → assets/printful-ready/hoodie-front-logo-center.png');
  console.log('  HOODIE back  → assets/printful-ready/hoodie-back-gas-print.png');
}

main().catch(e => { console.error(e); process.exit(1); });
