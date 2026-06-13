const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const COLORWAYS = [
  { name:'SNG Classic',    shell:'#111316', thread:'#ffffff', match:'HOUSE' },
  { name:'Black / Orange', shell:'#111316', thread:'#ff6a00', match:'KTM' },
  { name:'Blue / White',   shell:'#1c5fb4', thread:'#ffffff', match:'YAMAHA' },
  { name:'Red / White',    shell:'#c8202b', thread:'#ffffff', match:'HONDA' },
  { name:'Navy / Hi-Vis',  shell:'#1a2742', thread:'#d8ff00', match:'HI-VIZ' },
  { name:'Black / Green',  shell:'#111316', thread:'#2ecc40', match:'KAWASAKI' },
  { name:'Black / Yellow', shell:'#111316', thread:'#ffd400', match:'ACCENT' },
];

function hat(shell, thread){
  return `
    <path d="M28 178 Q150 150 272 178 Q272 200 150 206 Q28 200 28 178 Z" fill="${shell}" stroke="#000a" stroke-width="2"/>
    <path d="M28 178 Q150 150 272 178" fill="none" stroke="${thread}" stroke-width="2.4" stroke-dasharray="5 5" opacity="0.9"/>
    <path d="M56 176 C50 96 96 44 150 44 C204 44 250 96 244 176 Z" fill="${shell}" stroke="#000a" stroke-width="2"/>
    <path d="M150 44 L150 176" stroke="#0007" stroke-width="1.4"/>
    <path d="M150 52 C118 70 100 120 104 176" stroke="#0006" stroke-width="1.2" fill="none"/>
    <path d="M150 52 C182 70 200 120 196 176" stroke="#0006" stroke-width="1.2" fill="none"/>
    <circle cx="150" cy="50" r="7" fill="${shell}" stroke="${thread}" stroke-width="1.6"/>
    <text x="150" y="112" text-anchor="middle" font-family="Arial, sans-serif" font-weight="900" font-size="15" fill="${thread}">I USE TA</text>
    <text x="150" y="130" text-anchor="middle" font-family="Arial, sans-serif" font-weight="900" font-size="15" fill="${thread}">HAVE GAS.</text>
    <text x="150" y="150" text-anchor="middle" font-family="Arial, sans-serif" font-weight="900" font-size="13" fill="${thread}">NOW I JUST</text>
    <text x="150" y="166" text-anchor="middle" font-family="Arial, sans-serif" font-weight="900" font-size="13" fill="${thread}">HAUL ASS.</text>`;
}

const COLS=3, CW=400, CH=330, HEAD=140, BG='#0c0d10';
const rows = Math.ceil(COLORWAYS.length/COLS);
const W = COLS*CW, H = HEAD + rows*CH + 30;

let cells = '';
COLORWAYS.forEach((c,i)=>{
  const col=i%COLS, row=Math.floor(i/COLS);
  const x=col*CW, y=HEAD+row*CH;
  cells += `
  <g transform="translate(${x},${y})">
    <rect x="20" y="14" width="${CW-40}" height="${CH-34}" rx="14" fill="#15171c" stroke="#2a2d35"/>
    <svg x="40" y="24" width="320" height="266" viewBox="0 0 300 250">${hat(c.shell,c.thread)}</svg>
    <text x="${CW/2}" y="${CH-58}" text-anchor="middle" font-family="Arial, sans-serif" font-weight="800" font-size="18" fill="#e9eaed">${c.name}</text>
    <rect x="${CW/2-26}" y="${CH-26}" width="14" height="14" rx="3" fill="${c.shell}" stroke="#0006"/>
    <rect x="${CW/2+12}" y="${CH-26}" width="14" height="14" rx="3" fill="${c.thread}" stroke="#0006"/>
    <text x="${CW/2}" y="${CH-44}" text-anchor="middle" font-family="Arial, sans-serif" font-weight="800" font-size="10" fill="#ff5a00" letter-spacing="2">${c.match}</text>
  </g>`;
});

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${BG}"/>
  <text x="40" y="56" font-family="Arial, sans-serif" font-weight="900" font-size="13" fill="#ff5a00" letter-spacing="4">SNG CYCLES · BUILDER'S SERIES</text>
  <text x="40" y="92" font-family="Arial, sans-serif" font-weight="900" font-size="30" fill="#e9eaed">Hat Colorway Templates — Flat Brim FlexFit®</text>
  <text x="40" y="118" font-family="Arial, sans-serif" font-size="15" fill="#9aa0aa">Front embroidery: "I Use Ta Have Gas. Now I Just Haul Ass." · 7 colorways · embroidery-ready</text>
  ${cells}
</svg>`;

const outDir = __dirname;
fs.writeFileSync(path.join(outDir,'builder-series-hats.svg'), svg);
sharp(Buffer.from(svg)).png().toFile(path.join(outDir,'builder-series-hats.png'))
  .then(()=>console.log('PNG written:', path.join(outDir,'builder-series-hats.png')))
  .catch(e=>{console.error(e); process.exit(1);});
