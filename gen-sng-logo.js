const sharp = require('sharp');
const fs = require('fs');

// True shark dorsal fin:
//   Leading edge (left)  = CONVEX outward, gentle slope
//   Trailing edge (right) = CONCAVE inward, steep hollow back
//   Peak at ~30% from left = strong backward lean
//   Narrow: 190w × 340h

const svg = `<svg xmlns="http://www.w3.org/2000/svg"
     viewBox="0 0 300 440"
     width="2400" height="3520">

  <path d="
    M 35, 355
    C 12, 268  52, 118  90, 15
    C 112, 68  170, 252  225, 355
    Z
  " fill="white"/>

  <text
    x="130" y="422"
    text-anchor="middle"
    font-family="Impact, 'Arial Narrow', 'Arial Black', sans-serif"
    font-weight="900"
    font-size="86"
    fill="white"
    letter-spacing="14"
  >SNG</text>

</svg>`;

const OUT_SVG = '/home/shark/sng-cycles/sng-fin-logo.svg';
const OUT_PNG = '/home/shark/sng-cycles/sng-fin-logo.png';
const OUT_WIN = '/mnt/c/Users/Shark/Downloads/sng-fin-logo.png';

fs.writeFileSync(OUT_SVG, svg);
console.log('SVG written:', OUT_SVG);

sharp(Buffer.from(svg)).png().toFile(OUT_PNG)
  .then(() => { console.log('PNG written:', OUT_PNG); return sharp(OUT_PNG).toFile(OUT_WIN); })
  .then(() => console.log('Copied to Downloads'))
  .catch(e => console.error(e));
