// gen-printful.js — v2
// Outputs:
//   printful/embroidery/   — front embroidery PNGs (1800x1800, transparent bg) for Printful upload
//   printful/mockups/      — hat mockup product photos (900x900) for Payhip listings
//   printful/side-options/ — side embroidery options (1800x400)

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'printful');
['embroidery', 'mockups', 'side-options'].forEach(d =>
  fs.mkdirSync(path.join(OUT, d), { recursive: true })
);

const COLORWAYS = [
  { id:'sng-classic',    name:'SNG Classic',    shell:'#111316', thread:'#ffffff', match:'HOUSE' },
  { id:'black-orange',   name:'Black / Orange', shell:'#111316', thread:'#ff6a00', match:'KTM' },
  { id:'blue-white',     name:'Blue / White',   shell:'#1c5fb4', thread:'#ffffff', match:'YAMAHA' },
  { id:'red-white',      name:'Red / White',    shell:'#c8202b', thread:'#ffffff', match:'HONDA' },
  { id:'navy-hiviz',     name:'Navy / Hi-Vis',  shell:'#1a2742', thread:'#d8ff00', match:'HI-VIZ' },
  { id:'black-green',    name:'Black / Green',  shell:'#111316', thread:'#2ecc40', match:'KAWASAKI' },
  { id:'black-yellow',   name:'Black / Yellow', shell:'#111316', thread:'#ffd400', match:'ACCENT' },
];

const SIDE_OPTIONS = [
  { id:'shark-not-goldfish', text:'SHARK NOT GOLDFISH' },
  { id:'leave-the-school',   text:'LEAVE THE SCHOOL BEHIND' },
  { id:'haul-ass',           lines:['I USE TA HAVE GAS.', 'NOW I JUST HAUL ASS.'] },
];

function hexToRgb(hex) {
  const h = hex.replace('#','');
  return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
}
function rgbToHex(r,g,b) {
  return '#'+[r,g,b].map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('');
}
function darken(hex, amt) {
  const [r,g,b] = hexToRgb(hex);
  return rgbToHex(r*(1-amt), g*(1-amt), b*(1-amt));
}
function lighten(hex, amt) {
  const [r,g,b] = hexToRgb(hex);
  return rgbToHex(r+(255-r)*amt, g+(255-g)*amt, b+(255-b)*amt);
}

// Front embroidery design for Printful upload
// SNG shark fin + "SNG" text, thread color on transparent bg, 1800x1800
function embroideryDesignSVG(thread) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1800" height="1800" viewBox="0 0 300 440">
  <path d="M 35,355 C 12,268 52,118 90,15 C 112,68 170,252 225,355 Z" fill="${thread}"/>
  <text x="130" y="422" text-anchor="middle"
        font-family="Impact, 'Arial Narrow', sans-serif"
        font-weight="900" font-size="86" fill="${thread}" letter-spacing="14">SNG</text>
</svg>`;
}

// Hat mockup — product listing photo, 900x900
// Matches the real product: flat brim FlexFit, SNG logo on front panel
function mockupSVG(c) {
  const shellD1 = darken(c.shell, 0.20);
  const shellD2 = darken(c.shell, 0.48);
  const shellL1 = lighten(c.shell, 0.13);
  const [sr,sg,sb] = hexToRgb(c.shell);
  const isVeryDark = (sr+sg+sb) < 105;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="0 0 900 900">
  <defs>
    <!-- Crown: top highlight fading to slightly darker bottom (structured hat shading) -->
    <linearGradient id="cg_${c.id}" x1="450" y1="162" x2="450" y2="538" gradientUnits="userSpaceOnUse">
      <stop offset="0%"   stop-color="${shellL1}"/>
      <stop offset="40%"  stop-color="${c.shell}"/>
      <stop offset="100%" stop-color="${shellD1}"/>
    </linearGradient>
    <!-- Brim top-surface: dark at back (crown seam), shell color at front edge -->
    <linearGradient id="bg_${c.id}" x1="450" y1="538" x2="450" y2="625" gradientUnits="userSpaceOnUse">
      <stop offset="0%"   stop-color="${shellD1}"/>
      <stop offset="100%" stop-color="${lighten(c.shell, 0.06)}"/>
    </linearGradient>
    <!-- Left-side sliver panel (in shadow) -->
    <linearGradient id="sp_${c.id}" x1="172" y1="400" x2="228" y2="400" gradientUnits="userSpaceOnUse">
      <stop offset="0%"   stop-color="${shellD2}"/>
      <stop offset="100%" stop-color="${shellD1}"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="900" height="900" fill="#0c0d10"/>

  <!-- Series label -->
  <text x="450" y="52" text-anchor="middle"
        font-family="Arial, sans-serif" font-weight="900" font-size="13"
        fill="#ff5a00" letter-spacing="5">SNG CYCLES · BUILDER'S SERIES</text>

  <!-- Hat shadow on ground -->
  <ellipse cx="450" cy="645" rx="258" ry="17" fill="#000" opacity="0.50"/>

  <!-- ═══ BRIM ═══
       Flat top surface shown from slight above angle.
       Front edge (viewer side) is WIDER than where it meets the crown. -->
  <path d="M 228 538 L 672 538 L 748 622 L 152 622 Z"
        fill="url(#bg_${c.id})"/>
  <!-- Brim underside strip (dark) -->
  <path d="M 152 622 L 748 622 L 748 630 L 152 630 Z"
        fill="${shellD2}" opacity="0.70"/>
  <!-- Brim side edges -->
  <line x1="228" y1="538" x2="152" y2="622" stroke="${shellD2}" stroke-width="2"/>
  <line x1="672" y1="538" x2="748" y2="622" stroke="${shellD2}" stroke-width="2"/>
  <!-- Brim front stitching — double row -->
  <path d="M 159 612 L 741 612"
        fill="none" stroke="${c.thread}" stroke-width="2.8"
        stroke-dasharray="11 7" opacity="0.84"/>
  <path d="M 163 603 L 737 603"
        fill="none" stroke="${c.thread}" stroke-width="1.2"
        stroke-dasharray="11 7" opacity="0.30"/>

  <!-- ═══ CROWN ═══
       FLAT TOP structured snapback — matches the actual product.
       Sides are straight vertical. Top has only a slight center-seam bump (6-panel arch).
       NOT a dome. NOT rounded. Boxy and structured, just like the real hat. -->

  <!-- Left side panel sliver (in shadow, 3/4 view hint on left edge) -->
  <path d="M 228 538 L 228 186 L 216 195 L 215 540 Z"
        fill="url(#sp_${c.id})"/>

  <!-- Main front crown panel — flat top, straight sides -->
  <path d="M 228 538
           L 228 186
           Q 450 162 672 186
           L 672 538 Z"
        fill="url(#cg_${c.id})"
        ${isVeryDark ? 'stroke="#ffffff12" stroke-width="1.5"' : ''}/>

  <!-- Panel seams (vertical stitch lines, 6-panel hat) -->
  <!-- Center seam -->
  <line x1="450" y1="164" x2="450" y2="536" stroke="#00000032" stroke-width="1.8"/>
  <!-- Left panel seam -->
  <line x1="356" y1="188" x2="356" y2="536" stroke="#00000025" stroke-width="1.4"/>
  <!-- Right panel seam -->
  <line x1="544" y1="188" x2="544" y2="536" stroke="#00000025" stroke-width="1.4"/>
  <!-- Small eyelets at panel seam tops -->
  <circle cx="356" cy="194" r="4" fill="none" stroke="${c.thread}" stroke-width="1.2" opacity="0.35"/>
  <circle cx="544" cy="194" r="4" fill="none" stroke="${c.thread}" stroke-width="1.2" opacity="0.35"/>

  <!-- Crown–brim seam line -->
  <line x1="228" y1="538" x2="672" y2="538" stroke="#00000048" stroke-width="2.5"/>

  <!-- Sweatband peek -->
  <path d="M 229 531 L 671 531 L 671 538 L 229 538 Z" fill="#00000018"/>

  <!-- Top button -->
  <circle cx="450" cy="163" r="14" fill="${c.shell}" stroke="${c.thread}" stroke-width="2.5"/>
  <circle cx="450" cy="163" r="7"  fill="none"      stroke="${c.thread}" stroke-width="1.2" opacity="0.52"/>

  <!-- ═══ FRONT EMBROIDERY ═══
       SNG shark fin logo + "SNG" text — matches the real product.
       Logo original viewBox: 300×440. Fin occupies x:35–225, y:15–355. Text baseline y:422.
       Scale 0.62 → fin width ~118px, total logo height ~252px.
       Centered at x≈450. Fin tip at y≈225, SNG text bottom at ~477. -->
  <g transform="translate(371, 215) scale(0.62)">
    <path d="M 35,355 C 12,268 52,118 90,15 C 112,68 170,252 225,355 Z"
          fill="${c.thread}"/>
    <text x="130" y="422" text-anchor="middle"
          font-family="Impact, 'Arial Narrow', 'Arial Black', sans-serif"
          font-weight="900" font-size="86" fill="${c.thread}" letter-spacing="14">SNG</text>
  </g>

  <!-- Product name + colorway tag -->
  <text x="450" y="692"
        text-anchor="middle"
        font-family="Arial Black, Arial, sans-serif" font-weight="900"
        font-size="28" fill="#e9eaed">${c.name}</text>
  <text x="450" y="722"
        text-anchor="middle"
        font-family="Arial, sans-serif" font-weight="900" font-size="13"
        fill="#ff5a00" letter-spacing="5">${c.match}</text>

  <!-- Color swatches -->
  <rect x="388" y="742" width="40" height="40" rx="7"
        fill="${c.shell}" stroke="#ffffff18" stroke-width="1.5"/>
  <text x="408" y="800" text-anchor="middle"
        font-family="Arial, sans-serif" font-size="12" fill="#9aa0aa">shell</text>
  <rect x="472" y="742" width="40" height="40" rx="7"
        fill="${c.thread}" stroke="#ffffff18" stroke-width="1.5"/>
  <text x="492" y="800" text-anchor="middle"
        font-family="Arial, sans-serif" font-size="12" fill="#9aa0aa">thread</text>

  <!-- Price -->
  <text x="450" y="848"
        text-anchor="middle"
        font-family="Arial Black, Arial, sans-serif" font-weight="900"
        font-size="25" fill="#ff5a00">Builder's Series Hat — $35</text>
  <text x="450" y="876"
        text-anchor="middle"
        font-family="Arial, sans-serif" font-size="13"
        fill="#9aa0aa" letter-spacing="2">Flat Brim FlexFit® · Embroidered</text>
</svg>`;
}

function sideSVG(opt) {
  if (opt.lines) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="1800" height="400" viewBox="0 0 1800 400">
  <text x="900" y="155" text-anchor="middle"
        font-family="Impact, 'Arial Narrow', sans-serif"
        font-weight="900" font-size="108" fill="#ffffff" letter-spacing="3">${opt.lines[0]}</text>
  <text x="900" y="308" text-anchor="middle"
        font-family="Impact, 'Arial Narrow', sans-serif"
        font-weight="900" font-size="108" fill="#ffffff" letter-spacing="3">${opt.lines[1]}</text>
</svg>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1800" height="400" viewBox="0 0 1800 400">
  <text x="900" y="272" text-anchor="middle"
        font-family="Impact, 'Arial Narrow', sans-serif"
        font-weight="900" font-size="${opt.text.length > 20 ? 118 : 155}" fill="#ffffff" letter-spacing="4">${opt.text}</text>
</svg>`;
}

async function run() {
  const writes = [];

  for (const c of COLORWAYS) {
    const esvg = embroideryDesignSVG(c.thread);
    const ePng = path.join(OUT, 'embroidery', `front-embroidery-${c.id}.png`);
    writes.push(
      sharp(Buffer.from(esvg)).png().toFile(ePng)
        .then(() => console.log('✓ embroidery:', path.basename(ePng)))
    );
    fs.writeFileSync(ePng.replace('.png','.svg'), esvg);

    const msvg = mockupSVG(c);
    const mPng = path.join(OUT, 'mockups', `mockup-${c.id}.png`);
    writes.push(
      sharp(Buffer.from(msvg)).png().toFile(mPng)
        .then(() => console.log('✓ mockup:', path.basename(mPng)))
    );
    fs.writeFileSync(mPng.replace('.png','.svg'), msvg);
  }

  for (const s of SIDE_OPTIONS) {
    const svg = sideSVG(s);
    const sPng = path.join(OUT, 'side-options', `side-${s.id}.png`);
    writes.push(
      sharp(Buffer.from(svg)).png().toFile(sPng)
        .then(() => console.log('✓ side:', path.basename(sPng)))
    );
    fs.writeFileSync(sPng.replace('.png','.svg'), svg);
  }

  await Promise.all(writes);

  console.log('\nDone!');
  console.log('→ printful/embroidery/   — upload to Printful as front embroidery design');
  console.log('→ printful/mockups/      — use as Payhip listing photos');
  console.log('→ printful/side-options/ — optional side embroidery (no extra charge)');
}

run().catch(e => { console.error(e); process.exit(1); });
