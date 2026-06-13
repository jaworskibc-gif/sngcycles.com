import os, re

files = [
    'sng-strategy.html',
    'sng-investor-onepager.html',
    'guide-lbx-frameup.html',
    'guide-270e-lightbee.html',
    'guide-crf450-52kw.html',
    'guide-jackshaft.html',
    'guide-aplus-trike.html',
    'guide-surron-bundle.html',
    'guide-gas-build.html',
]

# Each tuple: (exact_old, exact_new)
replacements = [
    # ── HEADER: dark bg → white, white text → dark text ──
    ('.header { background: #0a0a0a; position: relative; overflow: hidden; }',
     '.header { background: #ffffff; border-bottom: 4px solid #e85d04; }'),

    ('.header { background: #0a0a0a; }',
     '.header { background: #ffffff; border-bottom: 4px solid #e85d04; }'),

    # Remove the orange gradient line under header (now using border-bottom)
    ("  .header::after { content:''; display:block; height:4px; background:linear-gradient(90deg,#e85d04 0%,#ff9533 50%,#e85d04 100%); }\n", ''),

    # Brand name: white → dark
    ('color:#fff; letter-spacing:3px; text-transform:uppercase; }',
     'color:#0a0a0a; letter-spacing:3px; text-transform:uppercase; }'),

    # Header brand divider: dark → light
    ('border-left:1px solid #2a2a2a;',
     'border-left:1px solid #e0e0e0;'),

    # ── COVER / HERO: dark bg → light gray ──
    ('  .cover { background:#0f0f0f;',
     '  .cover { background:#f5f5f5;'),
    ('  .cover-hero { background:#0f0f0f;',
     '  .cover-hero { background:#f5f5f5;'),

    # Cover title: white → dark
    ('font-weight:900; color:#fff; line-height:1.1; letter-spacing:1px;',
     'font-weight:900; color:#0a0a0a; line-height:1.1; letter-spacing:1px;'),
    ('font-weight:900; color:#fff; line-height:1;',
     'font-weight:900; color:#0a0a0a; line-height:1;'),

    # Cover subtitle/meta
    ('font-weight:300; letter-spacing:1px; text-transform:uppercase; margin-bottom:36px; }',
     'font-weight:300; letter-spacing:1px; text-transform:uppercase; margin-bottom:36px; color:#555; }'),
    ('  .cover-sub { font-size:14px; color:#777;',
     '  .cover-sub { font-size:14px; color:#555;'),
    ('  .meta-val { font-size:13px; color:#aaa;',
     '  .meta-val { font-size:13px; color:#333;'),

    # Guide cover stats box: dark border → light border
    ('border:1px solid #222; border-radius:4px;',
     'border:1px solid #e0e0e0; border-radius:4px;'),
    ('border-right:1px solid #222;',
     'border-right:1px solid #e0e0e0;'),

    # Cover tagline
    ('  .cover-tagline { font-size:13px; color:#aaa;',
     '  .cover-tagline { font-size:13px; color:#555;'),

    # Guide subtitle
    ('  .guide-subtitle { font-size:15px; color:#888;',
     '  .guide-subtitle { font-size:15px; color:#555;'),

    # ── HIGHLIGHT BOXES: dark bg → light gray ──
    ('  .hl-box { flex:1; background:#0a0a0a;',
     '  .hl-box { flex:1; background:#f5f5f5; border:1px solid #e8e8e8;'),

    # ── SPECS TABLE HEADER: dark → orange ──
    ('  .specs-table th { background:#0a0a0a; color:#fff;',
     '  .specs-table th { background:#e85d04; color:#fff;'),

    # ── PARTS TABLE HEADER: dark → light with orange text ──
    ('  .parts-table th { background:#1a1a1a; color:#e85d04;',
     '  .parts-table th { background:#f5f5f5; color:#e85d04; border-bottom:2px solid #e85d04;'),

    # ── PARTS TOTAL ROW: dark → orange ──
    ('  .parts-total td { background:#0a0a0a !important; color:#fff !important;',
     '  .parts-total td { background:#e85d04 !important; color:#fff !important;'),

    # ── CALLOUT DARK: dark bg → warm orange tint ──
    ('  .callout-dark {\n    background:#0a0a0a;\n    border-left:4px solid #e85d04;\n    padding:13px 16px;\n    margin:16px 0;\n    border-radius:0 4px 4px 0;\n  }',
     '  .callout-dark {\n    background:#fff3ec;\n    border-left:4px solid #e85d04;\n    border-top:1px solid #ffd8b8;\n    border-right:1px solid #ffd8b8;\n    border-bottom:1px solid #ffd8b8;\n    padding:13px 16px;\n    margin:16px 0;\n    border-radius:0 4px 4px 0;\n  }'),
    ('  .callout-dark p { font-size:12.5px; color:#ccc;',
     '  .callout-dark p { font-size:12.5px; color:#1a1a1a;'),

    # ── VIN SECTION: dark bg → light gray ──
    ('  .vin-section { background:#0a0a0a;',
     '  .vin-section { background:#f5f5f5; border-top:4px solid #e85d04;'),
    ('  .vin-title { font-family:Impact,\'Arial Black\',\'Arial Narrow\',Arial,sans-serif; font-size:20px; font-weight:900; color:#fff;',
     '  .vin-title { font-family:Impact,\'Arial Black\',\'Arial Narrow\',Arial,sans-serif; font-size:20px; font-weight:900; color:#0a0a0a;'),
    ('  .vin-table td { padding:9px 12px; border-bottom:1px solid #1a1a1a; color:#ccc;',
     '  .vin-table td { padding:9px 12px; border-bottom:1px solid #e8e8e8; color:#333;'),
    ('  .vin-table tr:nth-child(even) td { background:#0f0f0f; }',
     '  .vin-table tr:nth-child(even) td { background:#f9f9f9; }'),
    ('  .vin-table td:nth-child(2) { font-weight:600; color:#fff;',
     '  .vin-table td:nth-child(2) { font-weight:600; color:#0a0a0a;'),
    ('  .vin-example { background:#141414;',
     '  .vin-example { background:#fff;'),
    ('  .vin-code { font-family:\'Courier New\', monospace; font-size:22px; font-weight:900; color:#fff;',
     '  .vin-code { font-family:\'Courier New\', monospace; font-size:22px; font-weight:900; color:#0a0a0a;'),

    # ── FOOTER: dark bg → light gray ──
    ('  .guide-footer { background:#0a0a0a;',
     '  .guide-footer { background:#f5f5f5; border-top:1px solid #e0e0e0;'),
    ('  .footer-center { font-family:Impact,\'Arial Black\',\'Arial Narrow\',Arial,sans-serif; font-size:9px; font-weight:700; color:#333;',
     '  .footer-center { font-family:Impact,\'Arial Black\',\'Arial Narrow\',Arial,sans-serif; font-size:9px; font-weight:700; color:#888;'),

    # ── CAPITAL ASK inline styles (strategy doc) ──
    ('style="padding:28px 44px; background:#0a0a0a; border-top:4px solid #e85d04;"',
     'style="padding:28px 44px; background:#f5f5f5; border-top:4px solid #e85d04;"'),
    ('style="background:#111;border-top:3px solid #e85d04;padding:14px 16px;"',
     'style="background:#fff;border:1px solid #e8e8e8;border-top:3px solid #e85d04;padding:14px 16px;"'),
    ("style=\"font-family:Impact,'Arial Black',Arial,sans-serif;font-size:26px;color:#fff;\"",
     "style=\"font-family:Impact,'Arial Black',Arial,sans-serif;font-size:26px;color:#0a0a0a;\""),
]

base = '/home/shark/sng-cycles'
for fname in files:
    fpath = os.path.join(base, fname)
    if not os.path.exists(fpath):
        print(f'SKIP {fname}')
        continue
    html = open(fpath, encoding='utf-8').read()
    original = html
    for old, new in replacements:
        html = html.replace(old, new)
    if html != original:
        open(fpath, 'w', encoding='utf-8').write(html)
        changes = sum(1 for o, n in replacements if o in original)
        print(f'Updated {fname} ({changes} replacements)')
    else:
        print(f'No changes: {fname}')
