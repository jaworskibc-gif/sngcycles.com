const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const MERCH = [
  { id: 'hoodie-habit', name: '"Stuntin Is A Habit"', type: 'Blue Tie-Dye Hoodie', price: '$60' },
  { id: 'hoodie-easy', name: '"Stuntin Aint Easy"', type: 'Blue Tie-Dye Hoodie', price: '$60' },
  { id: 'hoodie-white', name: '"Leave the School Behind"', type: 'White Hoodie', price: '$60' },
  { id: 'tee-core-3', name: 'Core 3-Pack Tees', type: 'White / Red / Black', price: '$30' },
  { id: 'tee-dark-3', name: 'Dark 3-Pack Tees', type: 'Black / Charcoal / Navy', price: '$30' },
  { id: 'tee-cutoff-3', name: 'Cut-Off 3-Pack', type: 'Black / Green / Burgundy', price: '$30' },
  { id: 'tee-light-5', name: 'Light 5-Pack Tees', type: '5 Colorways', price: '$25' },
  { id: 'tee-single', name: 'Single SNG Tee', type: 'Pick Color + Slogan', price: '$15' }
];

function generateSVG(m) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <rect width="800" height="800" fill="#0a0a0a"/>
  
  <!-- SNG Logo Top Left -->
  <g transform="translate(40 40) scale(0.6)">
    <style>.sw{fill:none;stroke:#e85d04;stroke-width:5.5;stroke-linecap:square;stroke-linejoin:miter;}.o{fill:#e85d04;}.sng{font-family:Impact,'Arial Black',Arial,sans-serif;font-size:39px;letter-spacing:1px;font-style:italic;font-weight:900;}</style>
    <path class="sw" d="M8 62 C30 34 62 14 94 3 L78 34 C73 45 78 55 103 70 L44 66 C32 65 20 64 8 62 Z"/>
    <path class="sw" d="M18 62 L101 62"/>
    <text class="o sng" x="18" y="101" transform="skewX(-12)">SNG</text>
    <rect class="o" x="17" y="104" width="112" height="4" transform="skewX(-12)"/>
  </g>

  <!-- Product Tag -->
  <text x="760" y="70" text-anchor="end" font-family="Impact, sans-serif" font-size="24" fill="#e85d04" letter-spacing="4" text-transform="uppercase">OFFICIAL MERCH</text>

  <!-- Main Title -->
  <text x="400" y="380" text-anchor="middle" font-family="Impact, sans-serif" font-size="60" fill="#fff" text-transform="uppercase">${m.name}</text>
  <text x="400" y="440" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="24" fill="#888" letter-spacing="2" text-transform="uppercase">${m.type}</text>

  <!-- Visual Placeholder (Graphic) -->
  <circle cx="400" cy="580" r="100" fill="none" stroke="#e85d04" stroke-width="2" stroke-dasharray="8 8"/>
  <text x="400" y="585" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#555">SNG4LIFE GRAPHIC</text>

  <!-- Bottom Bar -->
  <rect x="0" y="720" width="800" height="80" fill="#111"/>
  <rect x="0" y="720" width="800" height="4" fill="#e85d04"/>
  
  <text x="40" y="770" font-family="Arial, sans-serif" font-size="18" fill="#555" letter-spacing="1">SNG CYCLES · APPAREL COLLECTION</text>
  <text x="760" y="770" text-anchor="end" font-family="Impact, sans-serif" font-size="40" fill="#fff">${m.price}</text>
</svg>`;
}

const outDir = path.join('/home/shark/sng-cycles/assets/payhip');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

async function run() {
  for (const m of MERCH) {
    const svg = generateSVG(m);
    const fileName = `merch-${m.id}-payhip`;
    fs.writeFileSync(path.join(outDir, `${fileName}.svg`), svg);
    await sharp(Buffer.from(svg)).png().toFile(path.join(outDir, `${fileName}.png`));
    console.log(`Generated: ${fileName}.svg/png`);
  }
}

run().catch(console.error);
