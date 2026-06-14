#!/usr/bin/env python3
"""Generate hat back SVGs matching the real SNG snapback back view."""
import os

COLORWAYS = [
    { 'key': 'sng-classic',  'shell': '#111316', 'brim': '#0d0f11', 'strap': '#1e2124', 'thread': '#ffffff', 'label': 'SNG Classic · Black / White'   },
    { 'key': 'black-orange', 'shell': '#111316', 'brim': '#0d0f11', 'strap': '#1e2124', 'thread': '#f47820', 'label': 'Black / Orange · KTM'           },
    { 'key': 'blue-white',   'shell': '#1c5fb4', 'brim': '#163f78', 'strap': '#183a6e', 'thread': '#ffffff', 'label': 'Blue / White · Yamaha'          },
    { 'key': 'red-white',    'shell': '#c8202b', 'brim': '#8a1018', 'strap': '#961820', 'thread': '#ffffff', 'label': 'Red / White · Honda'            },
    { 'key': 'navy-hiviz',   'shell': '#1a2742', 'brim': '#111a2e', 'strap': '#161f38', 'thread': '#d8ff00', 'label': 'Dark Blue / Hi-Vis · Husqvarna' },
    { 'key': 'black-green',  'shell': '#111316', 'brim': '#0d0f11', 'strap': '#1e2124', 'thread': '#2ecc40', 'label': 'Black / Green · Kawasaki'       },
    { 'key': 'black-yellow', 'shell': '#111316', 'brim': '#0d0f11', 'strap': '#1e2124', 'thread': '#ffd400', 'label': 'Black / Yellow · Sur-Ron'       },
]

def gen_svg(c):
    shell  = c['shell']
    brim   = c['brim']
    strap  = c['strap']
    thread = c['thread']

    # darken shell slightly for shadow/depth
    def hex_darken(h, amt=25):
        r = max(0, int(h[1:3], 16) - amt)
        g = max(0, int(h[3:5], 16) - amt)
        b = max(0, int(h[5:7], 16) - amt)
        return f'#{r:02x}{g:02x}{b:02x}'

    dark = hex_darken(shell, 30)

    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="0 0 900 900">
  <!-- page bg -->
  <rect width="900" height="900" fill="#0c0d10"/>

  <!-- ── CROWN — clean dome from behind ── -->
  <!-- shadow/depth ellipse under crown -->
  <ellipse cx="450" cy="580" rx="340" ry="28" fill="#000" opacity="0.35"/>

  <!-- main crown body -->
  <path d="M152 555
           C140 310 268 110 450 108
           C632 108 760 310 748 555
           Z"
        fill="{shell}"/>

  <!-- subtle left/right panel shading -->
  <path d="M152 555 C140 310 268 110 450 108"
        fill="none" stroke="{dark}" stroke-width="1.5" opacity="0.6"/>
  <path d="M748 555 C760 310 632 110 450 108"
        fill="none" stroke="{dark}" stroke-width="1.5" opacity="0.6"/>

  <!-- center back seam -->
  <line x1="450" y1="110" x2="450" y2="556"
        stroke="{dark}" stroke-width="2" opacity="0.5"/>

  <!-- subtle side seams -->
  <path d="M450 130 C374 195 328 360 336 556"
        fill="none" stroke="{dark}" stroke-width="1.2" opacity="0.35"/>
  <path d="M450 130 C526 195 572 360 564 556"
        fill="none" stroke="{dark}" stroke-width="1.2" opacity="0.35"/>

  <!-- top button -->
  <circle cx="450" cy="120" r="18" fill="{dark}" stroke="{hex_darken(shell,10)}" stroke-width="2"/>

  <!-- ── BRIM — flat, back edge ── -->
  <path d="M136 557 Q450 475 764 557 Q764 598 450 612 Q136 598 136 557 Z"
        fill="{brim}" stroke="#00000060" stroke-width="2.5"/>
  <!-- brim stitching -->
  <path d="M136 557 Q450 475 764 557"
        fill="none" stroke="{thread}" stroke-width="3.5"
        stroke-dasharray="12 9" opacity="0.5"/>

  <!-- ── SNAPBACK STRAP ── -->
  <rect x="268" y="594" width="364" height="34" rx="6"
        fill="{strap}" stroke="#00000055" stroke-width="1.5"/>

  <!-- ── SNG WOVEN TAG (small, centered on strap) ── -->
  <rect x="410" y="596" width="80" height="30" rx="4"
        fill="{hex_darken(shell,15)}" stroke="{thread}" stroke-width="1.8" opacity="0.95"/>

  <!-- shark fin inside tag -->
  <path d="M450 601 C450 601 444 610 443 615 C446 613 448 615 450 616 C452 615 454 613 457 615 C456 610 450 601 450 601 Z"
        fill="{thread}" opacity="0.9"/>

  <!-- SNG text inside tag -->
  <text x="450" y="623"
        text-anchor="middle"
        font-family="Arial Black, Arial, sans-serif"
        font-weight="900"
        font-size="9"
        fill="{thread}"
        letter-spacing="1.5"
        opacity="0.92">SNG</text>

  <!-- snap buttons on each side of tag -->
  <circle cx="382" cy="611" r="9" fill="{hex_darken(shell,20)}" stroke="#44444a" stroke-width="1.2"/>
  <circle cx="382" cy="611" r="4" fill="{hex_darken(shell,35)}"/>
  <circle cx="518" cy="611" r="9" fill="{hex_darken(shell,20)}" stroke="#44444a" stroke-width="1.2"/>
  <circle cx="518" cy="611" r="4" fill="{hex_darken(shell,35)}"/>

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
