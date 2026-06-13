const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const GUIDES = [
  { id: '001', title: 'Sur-Ron LBX', subtitle: 'Frame-Up Super Build', color: '#e85d04', price: '$149' },
  { id: '002', title: 'SNG 270-E', subtitle: 'Performance Build', color: '#e85d04', price: '$149' },
  { id: '003', title: 'CRF450', subtitle: '52kW Electric Full Build', color: '#e85d04', price: '$249' },
  { id: '004', title: 'E-520 Jackshaft', subtitle: 'Fab & Assembly', color: '#e85d04', price: '$49' },
  { id: '005', title: 'A+ Concept', subtitle: 'Trike Manufacturing Pkg', color: '#e85d04', price: '$299' },
  { id: 'bundle', title: 'The Complete', subtitle: 'Build Guide Bundle', color: '#e85d04', price: '$699' }
];

function generateSVG(g) {
  const safeSubtitle = g.subtitle.replace(/&/g, '&amp;');
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

  <!-- Guide Number Badge -->
  <rect x="620" y="40" width="140" height="40" fill="#e85d04" rx="4"/>
  <text x="690" y="68" text-anchor="middle" font-family="Impact, sans-serif" font-size="20" fill="#fff" letter-spacing="2">GUIDE ${g.id.toUpperCase()}</text>

  <!-- Main Title -->
  <text x="40" y="400" font-family="Impact, sans-serif" font-size="80" fill="#fff" text-transform="uppercase">${g.title.split(' ')[0]}</text>
  <text x="40" y="480" font-family="Impact, sans-serif" font-size="80" fill="#e85d04" text-transform="uppercase">${g.title.split(' ').slice(1).join(' ')}</text>
  
  <text x="40" y="540" font-family="Arial, sans-serif" font-weight="700" font-size="24" fill="#888" letter-spacing="2" text-transform="uppercase">${safeSubtitle}</text>

  <!-- Bottom Bar -->
  <rect x="0" y="720" width="800" height="80" fill="#111"/>
  <rect x="0" y="720" width="800" height="4" fill="#e85d04"/>
  
  <text x="40" y="770" font-family="Arial, sans-serif" font-size="18" fill="#555" letter-spacing="1">SNG CYCLES · BUILD GUIDE SERIES</text>
  <text x="760" y="770" text-anchor="end" font-family="Impact, sans-serif" font-size="40" fill="#fff">${g.price}</text>
</svg>`;
}

const outDir = path.join('/home/shark/sng-cycles/assets/payhip');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

async function run() {
  for (const g of GUIDES) {
    const svg = generateSVG(g);
    const fileName = `guide-${g.id}-payhip`;
    fs.writeFileSync(path.join(outDir, `${fileName}.svg`), svg);
    await sharp(Buffer.from(svg)).png().toFile(path.join(outDir, `${fileName}.png`));
    console.log(`Generated: ${fileName}.svg/png`);
  }
}

run().catch(console.error);
