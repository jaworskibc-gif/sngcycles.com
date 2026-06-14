#!/usr/bin/env python3
"""Generate front-view SVGs for SNG snapback hats matching the reference design."""
import os

COLORWAYS = [
    { 'key': 'sng-classic',  'shell': '#111316', 'brim': '#0d0f11', 'thread': '#ffffff', 'label': 'SNG Classic'         },
    { 'key': 'black-orange', 'shell': '#111316', 'brim': '#0d0f11', 'thread': '#f47820', 'label': 'Black / Orange · KTM' },
    { 'key': 'blue-white',   'shell': '#1c5fb4', 'brim': '#163f78', 'thread': '#ffffff', 'label': 'Blue / White · Yamaha' },
    { 'key': 'red-white',    'shell': '#c8202b', 'brim': '#8a1018', 'thread': '#ffffff', 'label': 'Red / White · Honda'  },
    { 'key': 'navy-hiviz',   'shell': '#1a2742', 'brim': '#111a2e', 'thread': '#d8ff00', 'label': 'Dark Blue / Hi-Vis · Husqvarna' },
    { 'key': 'black-green',  'shell': '#111316', 'brim': '#0d0f11', 'thread': '#2ecc40', 'label': 'Black / Green · Kawasaki' },
    { 'key': 'black-yellow', 'shell': '#111316', 'brim': '#0d0f11', 'thread': '#ffd400', 'label': 'Black / Yellow · Sur-Ron' },
]

def darken(h, amt=30):
    r = max(0, int(h[1:3], 16) - amt)
    g = max(0, int(h[3:5], 16) - amt)
    b = max(0, int(h[5:7], 16) - amt)
    return f'#{r:02x}{g:02x}{b:02x}'

def gen_front_svg(c):
    shell  = c['shell']
    brim   = c['brim']
    thread = c['thread']
    dark   = darken(shell, 35)
    mid    = darken(shell, 15)

    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="0 0 900 900">

  <!-- page bg -->
  <rect width="900" height="900" fill="#0c0d10"/>

  <!-- ── CROWN ── -->
  <!-- outer glow/shadow -->
  <ellipse cx="450" cy="720" rx="310" ry="24" fill="#000" opacity="0.4"/>

  <!-- main crown shape — rounded trapezoid, wider at base -->
  <path d="
    M160 680
    C120 480 170 200 450 160
    C730 200 780 480 740 680
    Z"
    fill="{shell}"/>

  <!-- crown top highlight (subtle) -->
  <path d="
    M310 200
    C340 175 410 162 450 160
    C490 162 560 175 590 200
    C560 185 500 175 450 172
    C400 175 340 185 310 200 Z"
    fill="{mid}" opacity="0.4"/>

  <!-- left panel seam -->
  <path d="M160 680 C138 560 160 340 248 240"
        fill="none" stroke="{dark}" stroke-width="2" opacity="0.5"/>
  <!-- right panel seam -->
  <path d="M740 680 C762 560 740 340 652 240"
        fill="none" stroke="{dark}" stroke-width="2" opacity="0.5"/>
  <!-- center seam (subtle) -->
  <path d="M450 165 L450 680"
        fill="none" stroke="{dark}" stroke-width="1.5" opacity="0.3"/>

  <!-- top button -->
  <circle cx="450" cy="172" r="22" fill="{mid}" stroke="{darken(shell,5)}" stroke-width="3"/>
  <circle cx="450" cy="172" r="10" fill="{dark}" opacity="0.6"/>

  <!-- eyelets (air holes) -->
  <ellipse cx="320" cy="295" rx="7" ry="9" fill="{dark}" stroke="{darken(shell,5)}" stroke-width="1.5"/>
  <ellipse cx="580" cy="295" rx="7" ry="9" fill="{dark}" stroke="{darken(shell,5)}" stroke-width="1.5"/>

  <!-- ── SNG CYCLES EMBROIDERY ── -->
  <!-- shark fin -->
  <path d="M450 370
           C450 370 424 410 420 436
           C430 428 440 434 450 438
           C460 434 470 428 480 436
           C476 410 450 370 450 370 Z"
        fill="{thread}" opacity="0.97"/>
  <!-- fin base line -->
  <line x1="414" y1="438" x2="486" y2="438"
        stroke="{thread}" stroke-width="4" stroke-linecap="round" opacity="0.95"/>

  <!-- SNG -->
  <text x="450" y="548"
        text-anchor="middle"
        font-family="Arial Black, Arial, sans-serif"
        font-weight="900"
        font-size="110"
        fill="{thread}"
        letter-spacing="6"
        opacity="0.97">SNG</text>

  <!-- CYCLES -->
  <text x="450" y="604"
        text-anchor="middle"
        font-family="Arial Black, Arial, sans-serif"
        font-weight="900"
        font-size="38"
        fill="{thread}"
        letter-spacing="12"
        opacity="0.88">CYCLES</text>

  <!-- ── BRIM ── -->
  <!-- brim underside shadow -->
  <ellipse cx="450" cy="698" rx="300" ry="18" fill="#000" opacity="0.5"/>

  <!-- main brim — flat, extends wider than crown -->
  <path d="M90 685 Q450 645 810 685 L810 715 Q450 710 90 715 Z"
        fill="{brim}" stroke="{dark}" stroke-width="2"/>

  <!-- brim top stitching -->
  <path d="M105 686 Q450 648 795 686"
        fill="none" stroke="{thread}" stroke-width="3"
        stroke-dasharray="12 8" opacity="0.4"/>

  <!-- brim front edge -->
  <path d="M90 715 Q450 720 810 715"
        fill="none" stroke="{dark}" stroke-width="2.5" opacity="0.6"/>

</svg>'''

out_dir = 'assets/payhip/merch-ready'
os.makedirs(out_dir, exist_ok=True)
for c in COLORWAYS:
    svg = gen_front_svg(c)
    path = os.path.join(out_dir, f"hat-{c['key']}.svg")
    with open(path, 'w') as f:
        f.write(svg)
    print(f'Generated {path}')

print('Done.')
