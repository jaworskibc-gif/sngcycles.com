const ASSETS = '/home/shark/sng-cycles/assets/payhip';
const MVP = '/home/shark/sng-cycles/assets/tonight-mvp';

const MERCH = [
  // ── MVP DROP ──────────────────────────────────────────────
  {
    sku: 'MVP-001',
    title: 'SNG Builder\'s Series Hat - I Use Ta Have Gas',
    price: '36.99',
    image: `${MVP}/01-builder-series-hat-sng-classic.png`,
    fullDesc: `The Builder's Series hat that starts conversations.\n\nFlat brim rider hat with the line across the front:\n\nI USE TA HAVE GAS.\nNOW I JUST HAUL ASS.\n\nThis is the Florida garage drop. Funny, loud, and built for riders who get it. Available in SNG team colorways so you can match your bike, your gear, or your favorite brand colors.\n\nColorways: SNG Classic, Black/Orange, Blue/White, Red/White, Navy/Hi-Vis, Black/Green, Black/Yellow.`,
  },
  {
    sku: 'MVP-002',
    title: 'SNG Black Tee - I Use Ta Have Gas',
    price: '30.00',
    image: `${MVP}/02-black-tee-use-ta-have-gas.png`,
    fullDesc: `The first funny SNG drop.\n\nFront: small SNG shark logo.\nBack:\n\nI USE TA HAVE GAS.\nNOW I JUST HAUL ASS.\n\nThis is not corporate moto merch. This is Florida garage-built rider gear from the same shop that built the 270E from a Sur-Ron donor into something way past stock.\n\nClean enough to wear anywhere. Dumb enough to make riders laugh. That is the point.`,
  },
  {
    sku: 'MVP-003',
    title: 'SNG Black Hoodie - I Use Ta Have Gas',
    price: '50.00',
    image: `${MVP}/03-black-hoodie-use-ta-have-gas.png`,
    fullDesc: `The hoodie version of the first SNG funny drop.\n\nFront: big SNG shark logo.\nBack:\n\nI USE TA HAVE GAS.\nNOW I JUST HAUL ASS.\n\nBuilt for riders, builders, garage nights, pit days, and anyone who gets the joke without needing it explained. This is SNG before it gets polished by anybody else.\n\nFlorida-built. Rider-owned. Shark Not Goldfish.`,
  },
  // ── FULL CATALOG ──────────────────────────────────────────
  {
    sku: 'MERCH-001',
    title: 'SNG Cycles x Great White "Stuntin Is A Habit" Blue Tie-Dye Hoodie',
    fullDesc: `The Great White collab built for riders who make it look effortless. Blue tie-dye wash, heavyweight premium fleece, SNG shark graphic on the front, "Stuntin Is A Habit" across the back, and SNG4LIFE down the sleeve — because this isn't a phase, it's a lifestyle. Cut from premium heavyweight material that holds up on the lot, the track, or wherever you're putting on a show. Sized up to 2XLT so tall riders don't have to compromise.`,
    price: '60.00',
    image: `${ASSETS}/merch-hoodie-habit-payhip.png`,
  },
  {
    sku: 'MERCH-002',
    title: 'SNG Cycles x Great White "Stuntin Aint Easy" Blue Tie-Dye Hoodie',
    fullDesc: `Same Great White DNA as the original, different statement. Blue tie-dye wash, SNG shark graphic front, "Stuntin Aint Easy" across the back — because anyone who makes it look that smooth knows what went into it. Heavyweight premium fleece with SNG4LIFE on the sleeve. Available through 2XLT so every rider can rep the brand right.`,
    price: '60.00',
    image: `${ASSETS}/merch-hoodie-easy-payhip.png`,
  },
  {
    sku: 'MERCH-003',
    title: 'SNG Cycles "Leave the School Behind" White Hoodie',
    fullDesc: `White. Clean. Loud where it counts. The front drops a full rider graphic with ocean backdrop and the SNG gear ring — the mark of the pack that rides different. The back says it plain: "SNG Cycles — Leave the School Behind." SNG4LIFE on the sleeve. Heavyweight premium fleece, tall sizing through 2XLT, built for riders who already left the crowd in the rearview.`,
    price: '60.00',
    image: `${ASSETS}/merch-hoodie-white-payhip.png`,
  },
  {
    sku: 'MERCH-004',
    title: 'SNG Cycles Core 3-Pack Tees — White / Red / Black',
    fullDesc: `Three shirts, three slogans, one brand. The Core 3-Pack comes in White, Red, and Black — each tee rocking a different SNG slogan: Stuntin Aint Easy, SNG Cycles, and Stuntin Is A Habit. Premium embroidery, woven hem label, and cut for tall riders so the fit is actually right. Ten bucks a shirt to represent. No reason not to.`,
    price: '30.00',
    image: `${ASSETS}/merch-tee-core-3-payhip.png`,
  },
  {
    sku: 'MERCH-005',
    title: 'SNG Cycles Dark 3-Pack Tees — Black / Charcoal / Navy',
    fullDesc: `Black, Charcoal, Navy — the dark pack for riders who don't need to be seen coming. Three tees, three slogans across the set: Stuntin Is A Habit, Stuntin Aint Easy, and Swim Without The Pack. Same premium build as the Core Pack — clean cut, SNG brand on every piece. Stack the pack and rotate all week.`,
    price: '30.00',
    image: `${ASSETS}/merch-tee-dark-3-payhip.png`,
  },
  {
    sku: 'MERCH-006',
    title: 'SNG Cycles Cut-Off 3-Pack — Black / Hunter Green / Burgundy',
    fullDesc: `Sleeves are optional. The Cut-Off 3-Pack comes in Black, Hunter Green, and Burgundy — three cut-off tees built for the days when you're putting in real work. Track days, dune runs, lot sessions — gear that moves with you and doesn't get in the way. SNG branding on every piece. Show up, cut loose, rep the brand.`,
    price: '30.00',
    image: `${ASSETS}/merch-tee-cutoff-3-payhip.png`,
  },
  {
    sku: 'MERCH-007',
    title: 'SNG Cycles Light 5-Pack Tees — 5 Colorways',
    fullDesc: `Five shirts. Five colorways. Five bucks a piece. The Light 5-Pack covers the spread — White, Hunter Green, Sand, Burgundy, and Red — so you've got an SNG tee for every day of the week and then some. Premium build, SNG branded, and priced for riders who stock up smart. Mix and match, layer up, or give one to whoever asks about the bike.`,
    price: '25.00',
    image: `${ASSETS}/merch-tee-light-5-payhip.png`,
  },
  {
    sku: 'MERCH-008',
    title: 'SNG Cycles Single Tee — Pick Your Color + Slogan',
    fullDesc: `Your shirt, your way. Pick any color and any SNG slogan and we'll get it made. Available slogans: Stuntin Is A Habit, Stuntin Aint Easy, SNG Cycles, Swim Without The Pack, I Use Ta Have Gas / Now I Just Haul Ass, Leave the School Behind. Specify your choice in the order notes at checkout. Premium build, tall sizes through 2XLT. One tee to start — or one to round out the pack.`,
    price: '15.00',
    image: `/home/shark/sng-cycles/apparel-meg-tee.png`,
  },
  {
    sku: 'MERCH-009',
    title: 'SNG Rider Hat — Flat Brim FlexFit® — 7 Colorways',
    fullDesc: `The Builder's Series hat that starts conversations. Flat brim FlexFit with the Florida line across the front: I Use Ta Have Gas / Now I Just Haul Ass. Seven colors available to match your ride, your gear, or whatever major brand you're running: SNG Classic, Black/Orange, Blue/White, Red/White, Navy/Hi-Vis, Black/Green, and Black/Yellow. The image shows the exact front design style. One hat, all the flex.`,
    price: '35.00',
    image: `/home/shark/sng-cycles/sng-hat-collection.png`,
  },
];

const GUIDES = [
  {
    sku: 'GUIDE-001',
    title: 'SNG Cycles Guide #001 — Sur-Ron LBX Frame-Up Super Build',
    fullDesc: `This is where the build starts. Guide #001 walks you through a full frame-up build on a Sur-Ron Light Bee X — not a summary, not a YouTube highlight reel, but an actual step-by-step documented build with a complete parts list, sourcing guide, and assembly sequence. If you've been staring at a bare frame wondering where to start, this is what you've been looking for. Built by a builder, for builders — because nobody else had the nerve to document it.`,
    price: '149.00',
    image: `${ASSETS}/guide-001-payhip.png`,
    pdf: '/home/shark/sng-cycles/guides/guide-001.pdf',
  },
  {
    sku: 'GUIDE-002',
    title: 'SNG Cycles Guide #002 — 270-E Light Bee Supermoto Build (27kW)',
    fullDesc: `This is the most detailed electric moto build guide available anywhere. The 270-E takes a Sur-Ron Light Bee X and turns it into a 27kW supermoto — Sotion 925 motor, BAC8000 controller, 72V system, WP XACT 85 forks, Flow KTM 85 wheels, finished at 200 lbs. Every single decision is documented: why these parts, where to source them, how to assemble them, and what to watch out for. This isn't a concept build — it's the real thing, built by hand in Florida and written up so you can do it too. If you're only buying one guide, this is it.`,
    price: '149.00',
    image: `${ASSETS}/guide-002-payhip.png`,
    pdf: '/home/shark/sng-cycles/guides/guide-002.pdf',
  },
  {
    sku: 'GUIDE-003',
    title: 'SNG Cycles Guide #003 — 52kW CRF450 Electric Full Build',
    fullDesc: `If the 270-E wasn't enough, this is the next level. Guide #003 documents a complete electric conversion on a CRF450 frame using a 52kW system — a high-power, high-stakes build that most people won't attempt and almost nobody has documented. The guide covers the full conversion: drivetrain, power system, fitment, fabrication, and final assembly. This one is for builders who've already done the basics and are ready to go further than anyone else in their group chat. 52kW in a CRF450 frame. You already know.`,
    price: '249.00',
    image: `${ASSETS}/guide-003-payhip.png`,
    pdf: '/home/shark/sng-cycles/guides/guide-003.pdf',
  },
  {
    sku: 'GUIDE-004',
    title: 'SNG Cycles Guide #004 — E-520 Jackshaft Fabrication & Assembly (Includes Schematic)',
    fullDesc: `The jackshaft is where a lot of builds go wrong — wrong tolerances, wrong alignment, wrong sequence — and there's almost nothing documented on how to do it right. Guide #004 fixes that. Full fabrication and assembly guide for the E-520 jackshaft system, including parts sourcing, spec selection, and step-by-step assembly — plus the complete E-520 Jackshaft Schematic included at no extra charge. The schematic alone sells for $15. It's included here because if you're buying the guide, you're serious, and you need both.`,
    price: '49.00',
    image: `${ASSETS}/guide-004-payhip.png`,
    pdf: '/home/shark/sng-cycles/guides/guide-004.pdf',
  },
  {
    sku: 'GUIDE-005',
    title: 'SNG Cycles Guide #005 — A+ Concept Trike Full Manufacturing Package',
    fullDesc: `This is the one nobody else would put out. Guide #005 is a complete manufacturing package for the A+ Concept Trike — custom electric, built from scratch, documented in full. This isn't a conversion and it isn't a kit build. It's a ground-up manufacturing guide covering fabrication, drivetrain, electrical, assembly, and finish — the kind of documentation that takes months to produce and that you won't find anywhere else at any price. If you want to build something that doesn't exist yet, this is how you start. The most comprehensive guide in the series by a long shot.`,
    price: '299.00',
    image: `${ASSETS}/guide-005-payhip.png`,
    pdf: '/home/shark/sng-cycles/guides/guide-005.pdf',
  },
  {
    sku: 'GUIDE-BUNDLE',
    title: 'SNG Cycles — Complete Build Guide Bundle (All 5 Guides)',
    fullDesc: `Five builds. One price. The Complete Build Guide Bundle gets you every guide in the SNG Cycles series: the LBX Frame-Up, the 270-E Supermoto, the 52kW CRF450, the Jackshaft Fab guide, and the A+ Concept Trike Manufacturing Package. These guides exist because Bryan Jaworski built every one of these machines by hand and documented everything along the way — not for clout, but because no one else had done it. Stack all five and you've got the most complete electric moto build library available anywhere. $699 for the full set versus $895 individual. Math does the talking.`,
    price: '699.00',
    image: `${ASSETS}/guide-bundle-payhip.png`,
    pdf: '/home/shark/sng-cycles/guides/guide-bundle.pdf',
  },
];

module.exports = { MERCH, GUIDES };
