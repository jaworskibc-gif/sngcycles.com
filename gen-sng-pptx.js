const PptxGenJS = require('pptxgenjs');
const pres = new PptxGenJS();
pres.layout = 'LAYOUT_WIDE';

const C = {
  bg: '080808', dark: '111111', card: '161616',
  orange: 'e85d04', white: 'FFFFFF', text: 'e0e0e0',
  muted: 'b8b8b8', border: '222222', green: '4CAF50',
};

function addBar(s) {
  s.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:'100%', h:0.04, fill:{color:C.orange}, line:{color:C.orange} });
}
function addSlideNum(s, n) {
  s.addText(`${String(n).padStart(2,'0')} / 12`, { x:11.5, y:7.1, w:1.6, h:0.3, fontSize:9, color:C.muted, fontFace:'Arial', align:'right', charSpacing:3 });
}
function addLabel(s, text, x, y) {
  s.addText(text.toUpperCase(), { x, y, w:8, h:0.25, fontSize:9, color:C.orange, fontFace:'Arial', bold:true, charSpacing:4 });
}

// ── SLIDE 1: COVER ──
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addBar(s);
  s.addText('Investor Presentation  ·  2026  ·  Confidential', { x:0.75, y:0.6, w:11, h:0.3, fontSize:10, color:C.muted, fontFace:'Arial', charSpacing:2 });
  s.addText('SNG', { x:0.75, y:1.1, w:11, h:1.8, fontSize:96, color:C.white, fontFace:'Arial', bold:true });
  s.addText('Cycles', { x:0.75, y:2.7, w:11, h:1.4, fontSize:80, color:C.orange, fontFace:'Arial', bold:true, italic:true });
  s.addText("We build the electric supermoto the factory won't.\nSelf-taught engineer. South Florida. 1,000 hours R&D.\nThree prototypes. One proven build on the road.", { x:0.75, y:4.2, w:7, h:1.2, fontSize:13, color:C.text, fontFace:'Arial', lineSpacingMultiple:1.4 });
  ['Street Legal · Compliance Certified','270-E — Built & Riding','sngcycles.com — Live','6-Model 2026 Lineup'].forEach((b,i) => {
    s.addShape(pres.shapes.RECTANGLE, { x:0.75, y:5.5+i*0.38, w:4, h:0.32, fill:{color:'1a1a1a'}, line:{color:C.border} });
    s.addText('● '+b, { x:0.9, y:5.52+i*0.38, w:3.8, h:0.28, fontSize:10, color:C.text, fontFace:'Arial' });
  });
  addSlideNum(s,1);
}

// ── SLIDE 2: OPPORTUNITY ──
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addBar(s);
  addLabel(s,'Three Gaps. One Company.',0.75,0.15);
  s.addText('The market is wide open.\nIn three directions.', { x:0.75, y:0.5, w:11, h:1.1, fontSize:32, color:C.white, fontFace:'Arial', bold:true, lineSpacingMultiple:1.2 });
  s.addText('E-moto grew 38% year-over-year last year. The segment is exploding — and the three biggest gaps all have the same answer.', { x:0.75, y:1.65, w:10, h:0.4, fontSize:11, color:C.text, fontFace:'Arial' });
  const gaps = [
    {num:'01',title:'No Tall E-Moto Exists',body:"Sur-Ron is built for 5'8\". Zero is a commuter. Stark is competition spec only. Not a single electric motorcycle is engineered for the 6'+ rider with an MX background. That rider is SNG's core customer."},
    {num:'02',title:'No Premium E-Moto Brand',body:"BMW hasn't done it. Ducati hasn't done it. The high-end motard and supermoto premium space is completely empty on the electric side. SNG enters at $38K–$62K with a lineup no one else has."},
    {num:'03',title:'No E-Moto Identity Brand',body:"Alpinestars and Fox were built on 2-stroke oil 40 years ago. That culture doesn't translate. E-moto is a different identity entirely — and nobody owns it yet. SNG is that brand."},
  ];
  gaps.forEach((g,i) => {
    const x = 0.75 + i*4.2;
    s.addShape(pres.shapes.RECTANGLE, { x, y:2.1, w:4.0, h:2.8, fill:{color:C.card}, line:{color:C.border} });
    s.addShape(pres.shapes.RECTANGLE, { x, y:2.1, w:4.0, h:0.04, fill:{color:C.orange}, line:{color:C.orange} });
    s.addText(g.num, { x:x+0.2, y:2.2, w:1, h:0.7, fontSize:36, color:C.orange, fontFace:'Arial', bold:true });
    s.addText(g.title.toUpperCase(), { x:x+0.2, y:2.9, w:3.6, h:0.35, fontSize:12, color:C.white, fontFace:'Arial', bold:true });
    s.addText(g.body, { x:x+0.2, y:3.28, w:3.6, h:1.5, fontSize:9.5, color:C.muted, fontFace:'Arial', lineSpacingMultiple:1.5 });
  });
  const stats = [
    {val:'38%',label:'YoY Growth — Last Year',hi:true},{val:'$22B',label:'Global Market by 2030',hi:false},
    {val:'$0',label:'Competition Across All 3 Gaps',hi:false},{val:"6'7\"",label:'Founder — Built This Because He Had To',hi:false},
  ];
  stats.forEach((st,i) => {
    const x = 0.75+i*3.0;
    s.addShape(pres.shapes.RECTANGLE, { x, y:5.1, w:2.8, h:1.1, fill:{color:st.hi?'1a0800':C.card}, line:{color:st.hi?C.orange:C.border} });
    s.addText(st.val, { x:x+0.1, y:5.15, w:2.6, h:0.6, fontSize:30, color:st.hi?C.orange:C.white, fontFace:'Arial', bold:true, align:'center' });
    s.addText(st.label.toUpperCase(), { x:x+0.1, y:5.72, w:2.6, h:0.4, fontSize:7.5, color:C.muted, fontFace:'Arial', align:'center', charSpacing:1.5 });
  });
  addSlideNum(s,2);
}

// ── SLIDE 3: LINEUP ──
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addBar(s);
  addLabel(s,'2026 Model Lineup',0.75,0.15);
  s.addText('Six sharks. One ocean.', { x:0.75, y:0.5, w:11, h:0.9, fontSize:36, color:C.white, fontFace:'Arial', bold:true });
  const bikes = [
    {tag:'Entry / Conversion',name:'SNG 270-E',specs:"27kW Peak · 72V / FarDriver · WP XACT 85",price:'$24,950',status:'BUILT ✓',sc:'4CAF50'},
    {tag:'Supermoto',name:'SNG Mako',specs:"40kW Peak · 17\" Supermoto · Street Legal",price:'$28,950',status:'',sc:''},
    {tag:'Stunt Platform',name:'Great White',specs:'~60kW Liquid Cooled · LBX-60 · Custom Frame',price:'$42,500',status:'',sc:''},
    {tag:'Flagship Supermoto',name:'Megalodon 520E',specs:'52kW Peak · Ohlins + Beringer · CarPlay',price:'$38,500',status:'',sc:''},
    {tag:'3-Wheel / Tadpole',name:'Sand Shark',specs:'20kW · Tadpole Config · Custom Frame',price:'$32,000',status:'',sc:''},
    {tag:'Limited Collector',name:'Platinum 520E',specs:'52kW Base · 3M Platinum Wrap · Serial + CoA',price:'$62,000',status:'',sc:'c8a020'},
  ];
  bikes.forEach((b,i) => {
    const x = 0.35+(i%3)*4.3, y = 1.55+Math.floor(i/3)*2.85, plat = b.name==='Platinum 520E';
    s.addShape(pres.shapes.RECTANGLE, { x, y, w:4.1, h:2.65, fill:{color:plat?'0f0e0a':C.card}, line:{color:plat?'c8a020':C.border} });
    s.addShape(pres.shapes.RECTANGLE, { x, y, w:4.1, h:0.04, fill:{color:plat?'c8a020':C.orange}, line:{color:C.orange} });
    s.addText(b.tag.toUpperCase(), { x:x+0.2, y:y+0.12, w:3.7, h:0.25, fontSize:8, color:plat?'c8a020':C.orange, fontFace:'Arial', bold:true });
    s.addText(b.name, { x:x+0.2, y:y+0.4, w:3.5, h:0.5, fontSize:18, color:C.white, fontFace:'Arial', bold:true });
    s.addText(b.specs, { x:x+0.2, y:y+0.95, w:3.7, h:0.7, fontSize:9, color:C.muted, fontFace:'Arial', lineSpacingMultiple:1.5 });
    s.addText('Starting MSRP', { x:x+0.2, y:y+1.8, w:2, h:0.22, fontSize:7.5, color:C.muted, fontFace:'Arial' });
    s.addText(b.price, { x:x+0.2, y:y+2.0, w:2.5, h:0.4, fontSize:20, color:plat?'c8a020':C.orange, fontFace:'Arial', bold:true });
    if(b.status) s.addText(b.status, { x:x+2.8, y:y+2.05, w:1.1, h:0.35, fontSize:11, color:b.sc||C.green, fontFace:'Arial', bold:true });
  });
  addSlideNum(s,3);
}

// ── SLIDE 4: MEGALODON ──
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addBar(s);
  addLabel(s,'Flagship Model',7.0,0.15);
  s.addShape(pres.shapes.RECTANGLE, { x:0.5, y:0.4, w:5.8, h:6.8, fill:{color:'0d0d0d'}, line:{color:C.border} });
  s.addText('MEGALODON 520E\n[Bike Image]', { x:0.5, y:3.2, w:5.8, h:1, fontSize:14, color:'333333', fontFace:'Arial', bold:true, align:'center' });
  s.addText('Megalodon', { x:6.8, y:0.5, w:6, h:0.75, fontSize:40, color:C.white, fontFace:'Arial', bold:true });
  s.addText('520E', { x:6.8, y:1.2, w:6, h:0.7, fontSize:38, color:C.orange, fontFace:'Arial', bold:true, italic:true });
  s.addText('Electric Supermoto · Street Legal', { x:6.8, y:1.9, w:6, h:0.3, fontSize:11, color:C.muted, fontFace:'Arial' });
  const specs = [
    ['Peak Power','52kW (70HP)',true],['Motor','LBX-60 High-Power Race',false],
    ['Controller','FarDriver High-Power (1,600A burst)',false],['Battery','72V / 60Ah · ~80 mile range',false],
    ['Suspension','WP XACT 48mm · Ohlins TTX36',false],['Wheels','Warp9 17/17 Custom · Blue',false],
    ['Brakes','Beringer 6-Piston (World SMoto spec)',false],['Display','RiderNav R7X · Wireless CarPlay',false],
    ['Safety','Front + Rear Cam · Blind Spot Radar',true],['Compliance','Street Legal · Compliance Certified',true],
  ];
  specs.forEach(([k,v,hi],i) => {
    const y = 2.3+i*0.42;
    s.addShape(pres.shapes.RECTANGLE, { x:6.8, y, w:6, h:0.38, fill:{color:hi?'1a0d00':'0d0d0d'}, line:{color:hi?C.orange:'1a1a1a'} });
    s.addText(k, { x:6.95, y:y+0.06, w:2, h:0.28, fontSize:9, color:C.muted, fontFace:'Arial' });
    s.addText(v, { x:9.0, y:y+0.06, w:3.7, h:0.28, fontSize:9, color:hi?C.orange:C.text, fontFace:'Arial', bold:hi });
  });
  s.addShape(pres.shapes.RECTANGLE, { x:6.8, y:6.6, w:6, h:0.65, fill:{color:'1a0d00'}, line:{color:C.orange} });
  s.addText('Starting MSRP', { x:6.95, y:6.64, w:2.5, h:0.22, fontSize:8, color:C.muted, fontFace:'Arial' });
  s.addText('$38,500', { x:6.95, y:6.84, w:2.5, h:0.35, fontSize:20, color:C.orange, fontFace:'Arial', bold:true });
  s.addText('Demo Build: ~$21,000  ·  ~45% gross margin', { x:9.0, y:6.84, w:3.7, h:0.35, fontSize:10, color:'d0d0d0', fontFace:'Arial', align:'right' });
  addSlideNum(s,4);
}

// ── SLIDE 5: GREAT WHITE ──
{
  const s = pres.addSlide();
  s.background = { color: C.dark };
  addBar(s);
  addLabel(s,'The Apex Predator',0.75,0.15);
  s.addText('Great', { x:0.75, y:0.5, w:6, h:0.75, fontSize:40, color:C.white, fontFace:'Arial', bold:true });
  s.addText('White', { x:0.75, y:1.2, w:6, h:0.7, fontSize:38, color:C.orange, fontFace:'Arial', bold:true, italic:true });
  s.addText('~60kW Liquid-Cooled Stunt Platform (~80HP)', { x:0.75, y:1.9, w:6, h:0.3, fontSize:11, color:C.muted, fontFace:'Arial' });
  const specs = [
    ['Peak Power','~60kW Liquid Cooled',true],['Motor','LBX-60 Liquid Cooled',false],
    ['Controller','High-Power Programmable — TBD at build',false],['Battery','84V / 60Ah High-Discharge',false],
    ['Frame','Custom 4130 Chromoly — Stunt Spec',false],['Suspension','WP XACT Pro A-Kit — Stunt Tuned',false],
    ['Brakes','Beringer 6-Piston F + R',false],['Platform','Extended swingarm · Stunt pegs · Cage',false],
    ['Safety','Front + Rear Cam · Blind Spot Radar',true],
  ];
  specs.forEach(([k,v,hi],i) => {
    const y = 2.3+i*0.42;
    s.addShape(pres.shapes.RECTANGLE, { x:0.75, y, w:6, h:0.38, fill:{color:hi?'1a0d00':'0d0d0d'}, line:{color:hi?C.orange:'1a1a1a'} });
    s.addText(k, { x:0.9, y:y+0.06, w:2, h:0.28, fontSize:9, color:C.muted, fontFace:'Arial' });
    s.addText(v, { x:2.9, y:y+0.06, w:3.7, h:0.28, fontSize:9, color:hi?C.orange:C.text, fontFace:'Arial', bold:hi });
  });
  s.addShape(pres.shapes.RECTANGLE, { x:0.75, y:6.6, w:6, h:0.65, fill:{color:'1a0d00'}, line:{color:C.orange} });
  s.addText('$42,500', { x:0.9, y:6.84, w:2.5, h:0.35, fontSize:20, color:C.orange, fontFace:'Arial', bold:true });
  s.addText('Demo Build: ~$28,000  ·  ~34% gross margin', { x:3.5, y:6.84, w:4, h:0.35, fontSize:10, color:'d0d0d0', fontFace:'Arial' });
  s.addShape(pres.shapes.RECTANGLE, { x:7.1, y:0.4, w:5.8, h:6.8, fill:{color:'0a0800'}, line:{color:C.border} });
  s.addText('GREAT WHITE\n[Bike Image]', { x:7.1, y:3.2, w:5.8, h:1, fontSize:14, color:'333333', fontFace:'Arial', bold:true, align:'center' });
  addSlideNum(s,5);
}

// ── SLIDE 6: PROVEN ──
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addBar(s);
  addLabel(s,'Proven Traction',0.75,0.15);
  s.addText('Not a concept.\nAlready built.', { x:0.75, y:0.5, w:6, h:1.2, fontSize:34, color:C.white, fontFace:'Arial', bold:true, lineSpacingMultiple:1.2 });
  [['1,000+','Hours of R&D'],['3','Prototypes Built'],['$40K+','Self-Funded'],['270-E','Riding Today']].forEach(([v,l],i) => {
    const x = 0.75+(i%2)*2.8, y = 1.85+Math.floor(i/2)*0.85;
    s.addText(v, { x, y, w:2.6, h:0.6, fontSize:28, color:C.orange, fontFace:'Arial', bold:true });
    s.addText(l, { x, y:y+0.52, w:2.6, h:0.3, fontSize:9, color:C.muted, fontFace:'Arial' });
  });
  s.addShape(pres.shapes.RECTANGLE, { x:0.75, y:3.7, w:5.8, h:1.0, fill:{color:'0a1a0a'}, line:{color:'2d7a2d'} });
  s.addText('✓ Street Legal Compliance — Secured', { x:0.95, y:3.78, w:5.4, h:0.3, fontSize:11, color:C.green, fontFace:'Arial', bold:true });
  s.addText('SNG Cycles has completed the compliance process for street-legal VIN registration in all 50 states — a barrier most custom builders never clear.', { x:0.95, y:4.1, w:5.4, h:0.5, fontSize:9, color:C.muted, fontFace:'Arial', lineSpacingMultiple:1.4 });
  addLabel(s,'Milestones',7.0,0.15);
  const ms = [
    [true,'Prototype 1 — Concept validation','First functional build, proof of geometry and power. Self-funded.'],
    [true,'Prototype 2 — Suspension + drivetrain','WP XACT integration, controller tuning, 520 chain drive.'],
    [true,'270-E — Production-intent prototype','Built to spec. Riding. $16,430 actual cost. Street legal confirmed.'],
    [true,'Street Legal Compliance — Secured','Full compliance complete. VIN registration in all 50 states.'],
    [true,'Brand + Domain — Registered','sngcycles.com live. Website live. Team assembled. Merch launched.'],
    [false,'Demo Fleet — 6 builds','10–14 weeks with capital deployed.'],
    [false,'30-Unit Production Run — $4M trigger','Full production, dealer network, collector editions.'],
  ];
  ms.forEach(([done,title,desc],i) => {
    const y = 0.5+i*0.88;
    s.addShape(pres.shapes.OVAL, { x:7.0, y:y+0.05, w:0.2, h:0.2, fill:{color:done?C.orange:'333333'}, line:{color:done?C.orange:'444444'} });
    s.addText(title, { x:7.3, y, w:5.8, h:0.3, fontSize:10, color:done?C.white:'666666', fontFace:'Arial', bold:true });
    s.addText(desc, { x:7.3, y:y+0.3, w:5.8, h:0.4, fontSize:8.5, color:done?C.muted:'444444', fontFace:'Arial', lineSpacingMultiple:1.3 });
  });
  addSlideNum(s,6);
}

// ── SLIDE 7: WHY SNG ──
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addBar(s);
  addLabel(s,'Competitive Advantage',0.75,0.08);
  s.addText('Why SNG wins.\nWhy no one else can.', { x:0.75, y:0.35, w:11, h:0.95, fontSize:28, color:C.white, fontFace:'Arial', bold:true, lineSpacingMultiple:1.2 });
  const tbl = [
    [{text:'Brand',options:{bold:true,color:C.white,fontSize:9,fill:{color:'1a1a1a'}}},{text:'Peak Power',options:{bold:true,color:C.white,fontSize:9,fill:{color:'1a1a1a'}}},{text:'Street Legal',options:{bold:true,color:C.white,fontSize:9,fill:{color:'1a1a1a'}}},{text:'Tall Rider Geo',options:{bold:true,color:C.white,fontSize:9,fill:{color:'1a1a1a'}}},{text:'Compliance Cert',options:{bold:true,color:C.white,fontSize:9,fill:{color:'1a1a1a'}}},{text:'Custom Build',options:{bold:true,color:C.white,fontSize:9,fill:{color:'1a1a1a'}}},{text:'Available Now',options:{bold:true,color:C.white,fontSize:9,fill:{color:'1a1a1a'}}}],
    [{text:'Sur-Ron Light Bee X',options:{color:C.text,fontSize:8.5}},{text:'6kW / 27kW mod',options:{color:C.text,fontSize:8.5}},{text:'✕ No',options:{color:'ff4444',fontSize:8.5}},{text:'✕ No',options:{color:'ff4444',fontSize:8.5}},{text:'✕ No',options:{color:'ff4444',fontSize:8.5}},{text:'✕ No',options:{color:'ff4444',fontSize:8.5}},{text:'✓ Yes',options:{color:C.green,fontSize:8.5}}],
    [{text:'Stark Varg',options:{color:C.text,fontSize:8.5}},{text:'40kW',options:{color:C.text,fontSize:8.5}},{text:'✓ Yes',options:{color:C.green,fontSize:8.5}},{text:'✕ No',options:{color:'ff4444',fontSize:8.5}},{text:'✕ No',options:{color:'ff4444',fontSize:8.5}},{text:'✕ No',options:{color:'ff4444',fontSize:8.5}},{text:'✓ Yes',options:{color:C.green,fontSize:8.5}}],
    [{text:'Zero FXE',options:{color:C.text,fontSize:8.5}},{text:'34kW (46HP)',options:{color:C.text,fontSize:8.5}},{text:'✓ Yes',options:{color:C.green,fontSize:8.5}},{text:'✕ No',options:{color:'ff4444',fontSize:8.5}},{text:'— Standard',options:{color:C.muted,fontSize:8.5}},{text:'✕ No',options:{color:'ff4444',fontSize:8.5}},{text:'✓ Yes',options:{color:C.green,fontSize:8.5}}],
    [{text:'Cake Kalk (Disc.)',options:{color:C.text,fontSize:8.5}},{text:'42kW',options:{color:C.text,fontSize:8.5}},{text:'✕ Off-road',options:{color:'ff4444',fontSize:8.5}},{text:'✕ No',options:{color:'ff4444',fontSize:8.5}},{text:'✕ No',options:{color:'ff4444',fontSize:8.5}},{text:'✕ No',options:{color:'ff4444',fontSize:8.5}},{text:'✕ Bankrupt',options:{color:'ff4444',fontSize:8.5}}],
    [{text:'SNG Cycles',options:{bold:true,color:C.orange,fontSize:8.5,fill:{color:'1a0800'}}},{text:'27kW–60kW+ (36–80HP)',options:{bold:true,color:C.orange,fontSize:8.5,fill:{color:'1a0800'}}},{text:'✓ Yes',options:{bold:true,color:C.green,fontSize:8.5,fill:{color:'1a0800'}}},{text:"✓ Yes — 6'7\"",options:{bold:true,color:C.green,fontSize:8.5,fill:{color:'1a0800'}}},{text:'✓ Certified',options:{bold:true,color:C.green,fontSize:8.5,fill:{color:'1a0800'}}},{text:'✓ Yes',options:{bold:true,color:C.green,fontSize:8.5,fill:{color:'1a0800'}}},{text:'✓ 270-E on road',options:{bold:true,color:C.green,fontSize:8.5,fill:{color:'1a0800'}}}],
  ];
  s.addTable(tbl, { x:0.5, y:1.4, w:12.3, h:2.8, rowH:[0.36,0.42,0.42,0.42,0.42,0.42], fontSize:8.5, fontFace:'Arial', fill:{color:C.card}, border:{pt:0.5,color:C.border}, colW:[2.2,1.9,1.5,1.8,1.8,1.6,1.5] });
  [
    {icon:'⚡',title:'Compliance First',body:"Every SNG build is engineered for street-legal VIN registration from day one. Competitors build for tracks. We build for roads."},
    {icon:'📐',title:'Built for Real Riders',body:"1,000+ hours designing geometry for riders 6'+ from KTM 450/500/690 backgrounds. The ergonomics every other manufacturer ignores — we started there."},
    {icon:'🦈',title:'Brand That Travels',body:"SNG is a story — the backyard engineer who built what the factory wouldn't. That narrative is a marketing asset no VC money can replicate."},
  ].forEach((card,i) => {
    const x = 0.5+i*4.28;
    s.addShape(pres.shapes.RECTANGLE, { x, y:5.8, w:4.1, h:1.5, fill:{color:C.card}, line:{color:C.border} });
    s.addText(`${card.icon}  ${card.title.toUpperCase()}`, { x:x+0.2, y:5.88, w:3.7, h:0.32, fontSize:10, color:C.white, fontFace:'Arial', bold:true });
    s.addText(card.body, { x:x+0.2, y:6.22, w:3.7, h:1.0, fontSize:8.5, color:C.muted, fontFace:'Arial', lineSpacingMultiple:1.4 });
  });
  addSlideNum(s,7);
}

// ── SLIDE 8: BUSINESS MODEL ──
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addBar(s);
  addLabel(s,'Business Model',0.75,0.12);
  s.addText('Four ways we make money.', { x:0.75, y:0.45, w:6, h:0.75, fontSize:28, color:C.white, fontFace:'Arial', bold:true });
  [
    ['01','Custom Builds — Direct Sale','Build-to-order. $24,950–$62,000 MSRP per bike. 35–55% gross margin at demo scale. Production economics improve significantly at 30+ units.'],
    ['02','Limited Production Run — 30 Units','The $4M investor trigger. Blanket factory orders. 30–45% BOM reduction vs. demo cost. Full dealer network activation.'],
    ['03','Apparel & Merch','Drop-ship hats, hoodies, tees live via Printful. Flat brim only — brand statement. Zero inventory.'],
    ['04','Digital Guides / IP','Proprietary build guides for the DIY e-moto community. Sold via Payhip. Passive income between builds.'],
  ].forEach(([num,title,body],i) => {
    const y = 1.35+i*1.38;
    s.addShape(pres.shapes.RECTANGLE, { x:0.5, y, w:6.1, h:1.25, fill:{color:C.card}, line:{color:C.border} });
    s.addText(num, { x:0.7, y:y+0.1, w:0.6, h:0.6, fontSize:22, color:C.orange, fontFace:'Arial', bold:true });
    s.addText(title, { x:1.35, y:y+0.12, w:4.9, h:0.35, fontSize:11, color:C.white, fontFace:'Arial', bold:true });
    s.addText(body, { x:1.35, y:y+0.5, w:4.9, h:0.7, fontSize:8.5, color:C.muted, fontFace:'Arial', lineSpacingMultiple:1.4 });
  });
  s.addText('Unit Economics — Megalodon 520E', { x:7.0, y:0.45, w:6, h:0.4, fontSize:13, color:C.white, fontFace:'Arial', bold:true });
  s.addShape(pres.shapes.RECTANGLE, { x:7.0, y:0.95, w:5.9, h:0.32, fill:{color:'1a1a1a'}, line:{color:C.border} });
  s.addText('Demo Build (Single Unit)', { x:7.1, y:0.99, w:5.6, h:0.26, fontSize:9, color:C.orange, fontFace:'Arial', bold:true });
  [['Component BOM','~$12,000',false],['Custom fab + labor','~$5,000',false],['Compliance + docs','~$1,500',false],['Total demo cost','~$18,500 avg.',false],['MSRP','$38,500',false],['Gross Margin','~52%',true]].forEach(([k,v,hi],i) => {
    const y = 1.3+i*0.42;
    s.addShape(pres.shapes.RECTANGLE, { x:7.0, y, w:5.9, h:0.38, fill:{color:hi?'0a2000':'0d0d0d'}, line:{color:hi?C.green:'1a1a1a'} });
    s.addText(k, { x:7.15, y:y+0.06, w:3.5, h:0.28, fontSize:9, color:C.muted, fontFace:'Arial' });
    s.addText(v, { x:10.5, y:y+0.06, w:2.3, h:0.28, fontSize:9, color:hi?C.green:C.text, fontFace:'Arial', bold:hi, align:'right' });
  });
  s.addShape(pres.shapes.RECTANGLE, { x:7.0, y:3.9, w:5.9, h:0.32, fill:{color:'1a1a1a'}, line:{color:C.border} });
  s.addText('Production Run (30 Units)', { x:7.1, y:3.94, w:5.6, h:0.26, fontSize:9, color:C.orange, fontFace:'Arial', bold:true });
  [['BOM (volume discount −35%)','~$7,800',false],['Assembly (learned curve)','~$3,000',false],['Overhead per unit','~$1,200',false],['Total production cost','~$12,000',false],['MSRP','$38,500',false],['Gross Margin at Scale','~69%',true]].forEach(([k,v,hi],i) => {
    const y = 4.25+i*0.42;
    s.addShape(pres.shapes.RECTANGLE, { x:7.0, y, w:5.9, h:0.38, fill:{color:hi?'0a2000':'0d0d0d'}, line:{color:hi?C.green:'1a1a1a'} });
    s.addText(k, { x:7.15, y:y+0.06, w:3.5, h:0.28, fontSize:9, color:C.muted, fontFace:'Arial' });
    s.addText(v, { x:10.5, y:y+0.06, w:2.3, h:0.28, fontSize:9, color:hi?C.green:C.text, fontFace:'Arial', bold:hi, align:'right' });
  });
  s.addShape(pres.shapes.RECTANGLE, { x:7.0, y:6.8, w:5.9, h:0.55, fill:{color:'1a0800'}, line:{color:C.orange} });
  s.addText("30 bikes · $4M trigger · 30 units × ~$35K avg. ASP = $1.05M gross revenue on first production run", { x:7.15, y:6.84, w:5.6, h:0.45, fontSize:9, color:C.text, fontFace:'Arial', lineSpacingMultiple:1.4 });
  addSlideNum(s,8);
}

// ── SLIDE 9: THE VAULT ──
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addBar(s);
  addLabel(s,"The Builder's Series",0.75,0.1);
  s.addText("Not gas.\nNot just e-moto.\nBoth.", { x:0.75, y:0.42, w:5.5, h:1.3, fontSize:28, color:C.white, fontFace:'Arial', bold:true, lineSpacingMultiple:1.2 });
  s.addText("Every gas rider has a closet full of Alpinestars and Fox gear that smells like 2-stroke oil — built on 40 years of gas culture. SNG doesn't kill it. We electrify it.", { x:0.75, y:1.8, w:5.5, h:0.6, fontSize:9.5, color:C.text, fontFace:'Arial', lineSpacingMultiple:1.5 });
  [['01','Builder Jackshaft','7075 Billet · ABEC-9 Sealed · Shark CNC'],['02','Waterproof Build Plans','Bench-length · lays flat while you work'],['03',"Builder Tee — Tall Cut",'Long-torso fit · SNG brand'],['04','Flat Brim Hat',"Your gas bike's colorway · KTM / Honda / Kawi"],['05','Number Plate Decal Set','SNG branded · race-spec vinyl'],['06','Serial Certificate','Numbered #/25 · CoA · Collectible']].forEach(([num,title,desc],i) => {
    const x = 0.75+(i%2)*2.75, y = 2.5+Math.floor(i/2)*0.82;
    s.addShape(pres.shapes.RECTANGLE, { x, y, w:2.6, h:0.72, fill:{color:'0d0d0d'}, line:{color:'1e1e1e'} });
    s.addShape(pres.shapes.RECTANGLE, { x:x+0.1, y:y+0.1, w:0.38, h:0.38, fill:{color:'1a0800'}, line:{color:C.orange} });
    s.addText(num, { x:x+0.1, y:y+0.12, w:0.38, h:0.3, fontSize:9, color:C.orange, fontFace:'Arial', bold:true, align:'center' });
    s.addText(title.toUpperCase(), { x:x+0.56, y:y+0.1, w:1.95, h:0.28, fontSize:8.5, color:C.white, fontFace:'Arial', bold:true });
    s.addText(desc, { x:x+0.56, y:y+0.38, w:1.95, h:0.3, fontSize:7.5, color:C.muted, fontFace:'Arial' });
  });
  s.addShape(pres.shapes.RECTANGLE, { x:0.75, y:5.05, w:5.5, h:0.45, fill:{color:'1a0800'}, line:{color:C.orange} });
  s.addText('Not a PDF. Not a download. Physical.', { x:0.9, y:5.1, w:3.5, h:0.3, fontSize:9.5, color:C.orange, fontFace:'Arial', bold:true });
  s.addText('$499', { x:5.3, y:5.1, w:0.85, h:0.3, fontSize:16, color:C.orange, fontFace:'Arial', bold:true, align:'right' });
  s.addText("Builder's Series Hats — Your Gas Bike's Colorway", { x:0.75, y:5.6, w:5.5, h:0.28, fontSize:8, color:C.orange, fontFace:'Arial', bold:true, charSpacing:2 });
  [['KTM ORANGE','e85d04','1a0e00'],['HONDA RED','cc0000','0d0d0d'],['KAWI GREEN','2d7a2d','0a1a0a'],['YAMAHA BLUE','1a6ed8','0a0a1a']].forEach(([label,color,bg],i) => {
    const x = 0.75+i*1.38;
    s.addShape(pres.shapes.RECTANGLE, { x, y:5.95, w:1.3, h:0.35, fill:{color:bg}, line:{color} });
    s.addText(label, { x, y:5.98, w:1.3, h:0.28, fontSize:7.5, color, fontFace:'Arial', bold:true, align:'center' });
  });
  s.addShape(pres.shapes.RECTANGLE, { x:0.75, y:6.45, w:5.5, h:0.82, fill:{color:'1a0800'}, line:{color:C.orange} });
  s.addText("Builder's Box — 52kW Setup · $8,000  |  Jackshaft + full instructions. Faster than a Stark Varg. Build it yourself for less than the cost of a new 450.", { x:0.9, y:6.52, w:5.2, h:0.72, fontSize:9, color:C.text, fontFace:'Arial', lineSpacingMultiple:1.45 });
  addLabel(s,'The Customer Ladder',6.75,0.1);
  [['$499','The Vault','Jackshaft + waterproof build plans + apparel. Physical. No download link.'],['$8K',"Builder's Box — 52kW Full Kit",'Jackshaft + full instructions. Faster than a Stark Varg. Build it yourself.'],['$8K+','SNG Builds It For You','Vault owner calls SNG. "Build mine." Done.'],['$40K','Full SNG Build','He gets a promotion. Sells the KTM. Wants a Megalodon.']].forEach(([price,title,desc],i) => {
    const y = 0.45+i*1.68;
    s.addShape(pres.shapes.RECTANGLE, { x:6.75, y, w:6.1, h:1.55, fill:{color:C.card}, line:{color:C.border} });
    s.addText(price, { x:6.85, y:y+0.1, w:1.2, h:0.7, fontSize:22, color:C.orange, fontFace:'Arial', bold:true });
    s.addText(title.toUpperCase(), { x:8.15, y:y+0.12, w:4.5, h:0.35, fontSize:10, color:C.white, fontFace:'Arial', bold:true });
    s.addText(desc, { x:8.15, y:y+0.5, w:4.5, h:0.9, fontSize:8.5, color:C.muted, fontFace:'Arial', lineSpacingMultiple:1.4 });
  });
  addSlideNum(s,9);
}

// ── SLIDE 10: THE ASK ──
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addBar(s);
  addLabel(s,'Investment Opportunity',0.75,0.1);
  s.addText("We need capital.\nYou need returns.", { x:0.75, y:0.45, w:11, h:1.0, fontSize:34, color:C.white, fontFace:'Arial', bold:true, lineSpacingMultiple:1.2 });
  s.addText('The technology is proven. The market is open. The team is built. The only thing standing between SNG Cycles and 30 bikes in driveways is capital deployment.', { x:0.75, y:1.52, w:11, h:0.4, fontSize:11, color:C.text, fontFace:'Arial' });
  [
    {phase:'Phase 1 — Demo Fleet',amount:'$130K',desc:'One working prototype of every model. Proof of full range. Ready to show, ride, and close production deposits.',items:['6 demo builds (1 per model)','Components sourced & verified','10–14 week build timeline','270-E already done — 5 builds to go','Budget includes contingency'],featured:false},
    {phase:'Phase 2 — Production Trigger',amount:'$4M',desc:'The 30-bike production run. Blanket factory orders. Dealer agreements. Collector editions. Full brand activation.',items:['30 units at target ASP $35K+','~$1.05M gross revenue run 1','Platinum edition batch ($62K each)','30-45% BOM reduction at volume','Full compliance + VIN pathway'],featured:true},
    {phase:'What You Get',amount:'Equity + Returns',desc:'Terms available upon NDA/CCM agreement. Investment structure and projected returns discussed in private session.',items:['Equity stake in SNG Cycles','First-mover in proven category','Strong gross margins (52–69%)','Scalable — same platform, more models','Full IP + compliance assets'],featured:false},
  ].forEach((card,i) => {
    const x = 0.5+i*4.28;
    s.addShape(pres.shapes.RECTANGLE, { x, y:2.05, w:4.1, h:5.2, fill:{color:card.featured?'1a0800':C.card}, line:{color:card.featured?C.orange:C.border, pt:card.featured?1.5:0.75} });
    s.addText(card.phase.toUpperCase(), { x:x+0.2, y:2.15, w:3.7, h:0.3, fontSize:8, color:C.orange, fontFace:'Arial', bold:true, charSpacing:1.5 });
    s.addText(card.amount, { x:x+0.2, y:2.48, w:3.7, h:0.75, fontSize:card.featured?42:32, color:C.white, fontFace:'Arial', bold:true });
    s.addText(card.desc, { x:x+0.2, y:3.28, w:3.7, h:0.9, fontSize:8.5, color:C.muted, fontFace:'Arial', lineSpacingMultiple:1.45 });
    card.items.forEach((item,j) => s.addText('· '+item, { x:x+0.2, y:4.25+j*0.54, w:3.7, h:0.48, fontSize:9, color:C.text, fontFace:'Arial' }));
  });
  addSlideNum(s,10);
}

// ── SLIDE 11: TEAM ──
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addBar(s);
  addLabel(s,'The Team',0.75,0.1);
  s.addText('Built by riders.\nRun by builders.', { x:0.75, y:0.45, w:11, h:1.0, fontSize:34, color:C.white, fontFace:'Arial', bold:true, lineSpacingMultiple:1.2 });
  [
    {name:'Bryan Jaworski',title:'Founder & Chief Engineer',bio:"Self-taught engineer, Royal Palm Beach FL. 6'7\" MX background. Built three prototypes and $40K+ of personal R&D before asking anyone for a dollar. Every spec on every bike came from his hands. The 270-E is riding today because he refused to wait for someone else to build it.",founder:true},
    {name:'Fernando B.',title:'Engineering / Technical',bio:'Technical build support and engineering review. Hands-on with the builds from prototype 1.',founder:false},
    {name:'Roy B.',title:'Operations',bio:'Operations and logistics. Sourcing relationships and build coordination for the production run.',founder:false},
    {name:'Patrick',title:'Business Development',bio:'Market development and dealer relationships. Connecting the build pipeline to buyers.',founder:false},
  ].forEach((m,i) => {
    const x = 0.4+i*3.15;
    s.addShape(pres.shapes.RECTANGLE, { x, y:1.65, w:3.0, h:5.5, fill:{color:C.card}, line:{color:m.founder?C.orange:C.border, pt:m.founder?1.5:0.75} });
    s.addShape(pres.shapes.RECTANGLE, { x:x+0.15, y:1.75, w:2.7, h:2.0, fill:{color:'1a1a1a'}, line:{color:'2a2a2a'} });
    s.addText(m.founder?'🦈':'👤', { x:x+0.15, y:2.3, w:2.7, h:1, fontSize:36, align:'center' });
    s.addText(m.name, { x:x+0.15, y:3.82, w:2.7, h:0.4, fontSize:12, color:C.white, fontFace:'Arial', bold:true });
    s.addText(m.title.toUpperCase(), { x:x+0.15, y:4.22, w:2.7, h:0.28, fontSize:7.5, color:C.orange, fontFace:'Arial', bold:true, charSpacing:0.5 });
    s.addText(m.bio, { x:x+0.15, y:4.55, w:2.7, h:2.4, fontSize:8.5, color:C.muted, fontFace:'Arial', lineSpacingMultiple:1.45 });
  });
  addSlideNum(s,11);
}

// ── SLIDE 12: CONTACT ──
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addBar(s);
  s.addText("LET'S TALK", { x:2, y:0.5, w:9, h:0.35, fontSize:10, color:C.orange, fontFace:'Arial', bold:true, charSpacing:4, align:'center' });
  s.addText("Ready to build\nthe future?", { x:1, y:1.0, w:11, h:2.2, fontSize:56, color:C.white, fontFace:'Arial', bold:true, align:'center', lineSpacingMultiple:1.15 });
  s.addText("The market is open. The product is built. The team is ready.\nThe only question is whether you want in before the first 30 bikes are spoken for.", { x:1.5, y:3.35, w:10, h:0.7, fontSize:12, color:C.text, fontFace:'Arial', align:'center', lineSpacingMultiple:1.5 });
  [['📧','Email','sharknotgoldfish@gmail.com'],['🌐','Website','sngcycles.com'],['📄','NDA / Term Sheet','Available upon request']].forEach(([icon,label,val],i) => {
    const x = 1.5+i*3.5;
    s.addShape(pres.shapes.RECTANGLE, { x, y:4.3, w:3.2, h:1.2, fill:{color:C.card}, line:{color:C.border} });
    s.addText(`${icon}  ${label.toUpperCase()}`, { x:x+0.15, y:4.4, w:2.9, h:0.35, fontSize:9, color:C.orange, fontFace:'Arial', bold:true, charSpacing:1.5 });
    s.addText(val, { x:x+0.15, y:4.78, w:2.9, h:0.6, fontSize:11, color:C.white, fontFace:'Arial', bold:true });
  });
  s.addText('All meetings held under strict confidentiality. NDA and term sheets available upon request.', { x:1.5, y:5.65, w:10, h:0.4, fontSize:9, color:C.muted, fontFace:'Arial', align:'center' });
  s.addText('SNG', { x:4.5, y:6.3, w:4, h:0.85, fontSize:52, color:C.orange, fontFace:'Arial', bold:true, italic:true, align:'center' });
  s.addText('CYCLES', { x:4.5, y:6.9, w:4, h:0.4, fontSize:14, color:C.muted, fontFace:'Arial', bold:true, charSpacing:8, align:'center' });
  addSlideNum(s,12);
}

pres.writeFile({ fileName: '/mnt/c/Users/Shark/Downloads/SNG-Investor-Deck-2026.pptx' })
  .then(() => console.log('PPTX saved'))
  .catch(err => console.error(err));
