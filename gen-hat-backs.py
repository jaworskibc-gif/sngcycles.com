#!/usr/bin/env python3
"""Generate back-view SVGs for each SNG hat colorway."""
import os

COLORWAYS = [
    { 'key': 'sng-classic',   'shell': '#111316', 'brim': '#111316', 'thread': '#ffffff', 'label': 'SNG Classic',   'match': 'HOUSE'     },
    { 'key': 'black-orange',  'shell': '#111316', 'brim': '#111316', 'thread': '#ff6a00', 'label': 'Black / Orange', 'match': 'KTM'       },
    { 'key': 'blue-white',    'shell': '#1c5fb4', 'brim': '#1c5fb4', 'thread': '#ffffff', 'label': 'Blue / White',   'match': 'YAMAHA'    },
    { 'key': 'red-white',     'shell': '#c8202b', 'brim': '#c8202b', 'thread': '#ffffff', 'label': 'Red / White',    'match': 'HONDA'     },
    { 'key': 'navy-hiviz',    'shell': '#1a2742', 'brim': '#1a2742', 'thread': '#d8ff00', 'label': 'Navy / Hi-Vis',  'match': 'HUSQVARNA' },
    { 'key': 'black-green',   'shell': '#111316', 'brim': '#111316', 'thread': '#2ecc40', 'label': 'Black / Green',  'match': 'KAWASAKI'  },
    { 'key': 'black-yellow',  'shell': '#111316', 'brim': '#111316', 'thread': '#ffd400', 'label': 'Black / Yellow', 'match': 'SUR-RON'   },
]

def darken(hex_color, amount=25):
    r = max(0, min(255, int(hex_color[1:3], 16) - amount))
    g = max(0, min(255, int(hex_color[3:5], 16) - amount))
    b = max(0, min(255, int(hex_color[5:7], 16) - amount))
    return f'#{r:02x}{g:02x}{b:02x}'

def gen_svg(c):
    shell   = c['shell']
    brim    = c['brim']
    thread  = c['thread']
    label   = c['label']
    match   = c['match']
    key     = c['key']
    darker  = darken(shell, 25)

    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="0 0 900 900">
  <defs>
    <linearGradient id="cr_{key}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="{shell}"/>
      <stop offset="1" stop-color="#000" stop-opacity="0.45"/>
    </linearGradient>
    <linearGradient id="patch_{key}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="{darken(shell, 15)}"/>
      <stop offset="1" stop-color="{darken(shell, 35)}"/>
    </linearGradient>
  </defs>

  <!-- background -->
  <rect width="900" height="900" fill="#0c0d10"/>

  <!-- series label -->
  <text x="450" y="58" text-anchor="middle"
        font-family="Arial, sans-serif" font-weight="900" font-size="16"
        fill="#ff5a00" letter-spacing="5">SNG CYCLES · BUILDER\'S SERIES</text>

  <!-- hat shadow -->
  <ellipse cx="450" cy="624" rx="330" ry="22" fill="#000" opacity="0.3"/>

  <!-- flat brim back view -->
  <path d="M84 534 Q450 452 816 534 Q816 602 450 618 Q84 602 84 534 Z"
        fill="{brim}" stroke="#000a" stroke-width="3.5"/>
  <!-- brim stitching -->
  <path d="M84 534 Q450 452 816 534"
        fill="none" stroke="{thread}" stroke-width="5" stroke-dasharray="12 9" opacity="0.9"/>

  <!-- crown -->
  <path d="M168 528 C150 288 288 132 450 132 C612 132 750 288 732 528 Z"
        fill="url(#cr_{key})" stroke="#000a" stroke-width="3.5"/>

  <!-- center back seam (prominent from behind) -->
  <path d="M450 132 L450 528" stroke="#0009" stroke-width="3"/>
  <!-- side panel seams -->
  <path d="M450 156 C354 210 300 360 312 528" stroke="#0005" stroke-width="2" fill="none"/>
  <path d="M450 156 C546 210 600 360 588 528" stroke="#0005" stroke-width="2" fill="none"/>

  <!-- top button -->
  <circle cx="450" cy="144" r="19" fill="{shell}" stroke="{thread}" stroke-width="3"/>

  <!-- SNAP CLOSURE / ADJUSTMENT STRAP -->
  <rect x="318" y="472" width="264" height="34" rx="6" fill="{darker}" stroke="#000" stroke-width="1.5"/>
  <!-- left snap block -->
  <rect x="328" y="479" width="50" height="20" rx="4" fill="{shell}" stroke="#44444a" stroke-width="1.2"/>
  <circle cx="353" cy="489" r="7" fill="#2e2e35" stroke="#555560" stroke-width="1.5"/>
  <circle cx="353" cy="489" r="3" fill="#444450"/>
  <!-- size text -->
  <text x="450" y="493" text-anchor="middle" font-family="Arial, sans-serif"
        font-weight="700" font-size="9" fill="#666" letter-spacing="3">SNAPBACK · ONE SIZE</text>
  <!-- right snap block -->
  <rect x="522" y="479" width="50" height="20" rx="4" fill="{shell}" stroke="#44444a" stroke-width="1.2"/>
  <circle cx="547" cy="489" r="7" fill="#2e2e35" stroke="#555560" stroke-width="1.5"/>
  <circle cx="547" cy="489" r="3" fill="#444450"/>

  <!-- SNG BACK PATCH (woven label) -->
  <rect x="404" y="320" width="92" height="116" rx="5" fill="url(#patch_{key})" stroke="{thread}" stroke-width="2" opacity="0.95"/>
  <rect x="408" y="324" width="84" height="108" rx="3" fill="none" stroke="{thread}" stroke-width="0.7" opacity="0.35"/>
  <!-- Shark fin shape -->
  <path d="M450 338 C450 338 437 358 435 374 C440 370 444 374 450 376 C456 374 460 370 465 374 C463 358 450 338 450 338 Z"
        fill="{thread}"/>
  <line x1="432" y1="376" x2="468" y2="376" stroke="{thread}" stroke-width="2.5" stroke-linecap="round"/>
  <!-- SNG text -->
  <text x="450" y="400" text-anchor="middle" font-family="Arial Black, Arial, sans-serif"
        font-weight="900" font-size="21" fill="{thread}" letter-spacing="2">SNG</text>
  <text x="450" y="415" text-anchor="middle" font-family="Arial, sans-serif"
        font-weight="700" font-size="9.5" fill="{thread}" letter-spacing="4" opacity="0.85">CYCLES</text>
  <text x="450" y="428" text-anchor="middle" font-family="Arial, sans-serif"
        font-size="7.5" fill="{thread}" letter-spacing="2.5" opacity="0.45">BACK</text>

  <!-- colorway label -->
  <text x="450" y="688" text-anchor="middle"
        font-family="Arial Black, Arial, sans-serif" font-weight="900"
        font-size="28" fill="#e9eaed">{label}</text>
  <text x="450" y="722" text-anchor="middle"
        font-family="Arial, sans-serif" font-weight="900" font-size="14"
        fill="#ff5a00" letter-spacing="4">{match} · BACK</text>

  <!-- swatches -->
  <rect x="386" y="742" width="44" height="44" rx="8" fill="{shell}" stroke="#0007" stroke-width="1.5"/>
  <text x="408" y="806" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" fill="#9aa0aa">shell</text>
  <rect x="470" y="742" width="44" height="44" rx="8" fill="{thread}" stroke="#0007" stroke-width="1.5"/>
  <text x="492" y="806" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" fill="#9aa0aa">thread</text>

  <!-- price -->
  <text x="450" y="856" text-anchor="middle"
        font-family="Arial Black, Arial, sans-serif" font-weight="900"
        font-size="26" fill="#ff5a00">SNG Rider Hat — $35</text>
  <text x="450" y="886" text-anchor="middle"
        font-family="Arial, sans-serif" font-size="14"
        fill="#9aa0aa" letter-spacing="2">Flat Brim Snapback</text>
</svg>'''

out_dir = 'assets/payhip/merch-ready'
os.makedirs(out_dir, exist_ok=True)
for c in COLORWAYS:
    svg = gen_svg(c)
    path = os.path.join(out_dir, f"hat-back-{c['key']}.svg")
    with open(path, 'w') as f:
        f.write(svg)
    print(f'Generated {path}')

print('Done.')
