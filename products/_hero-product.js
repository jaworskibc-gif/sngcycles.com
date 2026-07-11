const HERO_PRODUCT_MAP = {
  'rider-team-colors-snapback': {
    name: 'Shark Not Goldfish Rider Team Colors Snapback',
    shortName: 'Rider Team Colors Snapback',
    price: '$35',
    image: '../../hat-team-colors-sheet.jpg',
    tagline: 'Pick your rider colorway. Leave the school behind.',
    badges: ['Hero Hat', 'Manual Orders Live', 'Bundle Driver'],
    angle: 'Main volume hat for the 90-day push. Team colorways give you multiple rider tribes without splitting the brand.',
    description: 'This is the hero hat for the drop. Same SNG rider energy, but built across multiple team-color directions so the buyer can match bike, gear, or brand lane. This version is the revised front treatment with the smaller SNG mark and GET OUT AND RIDE! lockup.',
    options: {
      size: ['One Size Snapback'],
      color: ['Black / White', 'Black / Orange', 'Blue / White', 'Red / White', 'Dark Blue / Hi-Vis Yellow', 'Black / Green', 'Black / Yellow']
    },
    details: [
      ['Front', 'Revised SNG front mark with GET OUT AND RIDE!'],
      ['Back', 'SNG back hit'],
      ['Side', 'Rider embroidery'],
      ['Use', 'Best first-click hat and strongest event/table product']
    ]
  },
  'florida-grown-tee': {
    name: 'Florida Grown Tee',
    shortName: 'Florida Grown Tee',
    price: '$35',
    image: '../../fl-grown-hero-unisex.png',
    tagline: 'Royal Palm Beach energy in a real back-graphic piece.',
    badges: ['Identity Tee', 'Florida Angle', 'Giftable'],
    angle: 'Florida identity product with strong local-pride, founder-story, and shark-brand crossover.',
    description: 'Black tee with the small SNG FL Grown chest hit and the full Florida Grown shark back graphic. This is the local-pride product in the hero five, but it still feels like SNG instead of generic state merch.',
    options: {
      size: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
      color: ['Black']
    },
    details: [
      ['Front', 'Small SNG FL Grown chest hit'],
      ['Back', 'Full Florida Grown shark graphic'],
      ['Audience', 'Florida riders, local supporters, gift traffic'],
      ['Use', 'Best identity-led tee in the stack']
    ]
  },
  'megalodon-tee': {
    name: 'Megalodon Tee',
    shortName: 'Megalodon Tee',
    price: '$35',
    image: '../../sng-megalodon-tee-sheet.png',
    tagline: 'Power. Instinct. Dominance.',
    badges: ['Statement Tee', 'Stop-Scroll Graphic', 'Cold Traffic'],
    angle: 'Most aggressive statement tee in the stack and one of the strongest stop-scroll graphics.',
    description: 'The Megalodon Tee is the loudest shirt in the five-product push. It is the aggression piece, the shark piece, and the one that should stop the scroll fastest when the right audience sees it.',
    options: {
      size: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
      color: ['Black']
    },
    details: [
      ['Front', 'SNG chest hit'],
      ['Back', 'Megalodon shark graphic and headline treatment'],
      ['Audience', 'Statement-piece buyers and shark-brand responders'],
      ['Use', 'Best attack piece in the stack']
    ]
  },
  'conversion-tee-series': {
    name: 'SNG Conversion Tee Series',
    shortName: 'Conversion Tee Series',
    price: '$35',
    image: '../../sng-conversion-series-shirt.png',
    tagline: 'I use ta have gas. Now I just haul ass.',
    badges: ['Hero Tee', 'Slogan Seller', 'Colorway Test Bed'],
    angle: 'Slogan-led conversion product that sorts the buyer instantly.',
    description: 'This is one of the strongest commercial pieces in the entire set because the message does a lot of the selling before the buyer even asks questions. It is built to test across multiple colorways and rider tribes quickly.',
    options: {
      size: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
      color: ['Black / Orange', 'Blue / Yellow', 'Red / Gold', 'Black / Yellow', 'Blue / White', 'Black / Green']
    },
    details: [
      ['Front', 'SNG chest logo by colorway'],
      ['Back', 'I USE TA HAVE GAS. NOW I JUST HAUL ASS.'],
      ['Audience', 'EV converts, humor buyers, comment-section magnets'],
      ['Use', 'Best direct-conversion tee in the stack']
    ]
  },
  'shut-up-get-out-and-ride-hoodie': {
    name: 'Shut Up Get Out And Ride Hoodie',
    shortName: 'Get Out And Ride Hoodie',
    price: '$65',
    image: '../../mens-race-day-hat-and-hoodie-black.png',
    tagline: 'The rider uniform. Pair it with the checker hat.',
    badges: ['Premium Hoodie', 'AOV Anchor', 'Bundle Piece'],
    angle: 'Highest-ticket hero item and strongest AOV anchor when paired with the checker hat upsell.',
    description: 'Black hoodie with the SHUT UP GET OUT AND RIDE back statement, sleeve hit, and checker details. This is not the entry tee. This is the uniform piece and the best product to drive bundles with the checker hat.',
    options: {
      size: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
      color: ['Black']
    },
    details: [
      ['Front', 'SNG chest hit'],
      ['Back', 'SHUT UP GET OUT AND RIDE statement graphic'],
      ['Bundle', 'Best paired with the checker hat'],
      ['Use', 'Highest AOV and strongest upsell anchor']
    ]
  }
};

const ORDER_PHONE = '17867612950';
const ORDER_PHONE_DISPLAY = '(786) 761-2950';
const ORDER_EMAIL = 'sharknotgoldfish@gmail.com';

function buildOrderSummary(product, size, color, notes) {
  return [
    `Product: ${product.name}`,
    `Size: ${size || 'Not selected'}`,
    `Color: ${color || 'Not selected'}`,
    `Price: ${product.price}`,
    notes ? `Notes: ${notes}` : 'Notes:'
  ].join('\n');
}

function renderHeroProductPage() {
  const slug = document.body.dataset.productSlug;
  const product = HERO_PRODUCT_MAP[slug];
  if (!product) {
    document.getElementById('app').innerHTML = '<div style="padding:40px;color:#fff">Product not found.</div>';
    return;
  }

  document.title = `${product.name} | SNG Cycles`;

  const sizeOptions = (product.options.size || []).map(v => `<option value="${v}">${v}</option>`).join('');
  const colorOptions = (product.options.color || []).map(v => `<option value="${v}">${v}</option>`).join('');
  const detailHtml = product.details.map(([k, v]) => `<div class="bullet"><strong>${k}</strong>${v}</div>`).join('');
  const badgeHtml = product.badges.map(v => `<span class="pill">${v}</span>`).join('');

  document.getElementById('app').innerHTML = `
    <div class="topbar">
      <div>
        <div class="brand">SNG <span>Cycles</span></div>
        <div class="sub">Hero Drop Product Page · Manual Orders Live Tonight</div>
      </div>
      <div class="actions">
        <a class="btn ghost" href="../../hero-drop/">Back To Hero Drop</a>
        <a class="btn blue" href="../../collections/hero-drop/">Open Collection</a>
      </div>
    </div>
    <div class="wrap">
      <section class="hero">
        <div class="hero-card visual">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="hero-card body">
          <div class="eyebrow">Locked Hero Product</div>
          <h1>${product.name}</h1>
          <div class="tagline">${product.tagline}</div>
          <div class="price">${product.price}</div>
          <div class="pill-row">${badgeHtml}</div>
          <div class="copy">${product.description}</div>
          <div class="copy"><span class="muted">Why it matters:</span> ${product.angle}</div>
          <div class="cta-note">Tonight's order path is manual on purpose: customer sends the product, size, and color, then Bryan confirms availability and sends payment instructions directly.</div>
        </div>
      </section>

      <section class="split">
        <div class="panel">
          <h2>Order This Product</h2>
          <div class="field-grid">
            <div class="field">
              <label for="size">Size</label>
              <select id="size"><option value="">Select size</option>${sizeOptions}</select>
            </div>
            <div class="field">
              <label for="color">Colorway</label>
              <select id="color"><option value="">Select color</option>${colorOptions}</select>
            </div>
          </div>
          <div class="field" style="margin-top:12px">
            <label for="notes">Notes</label>
            <textarea id="notes" placeholder="Optional notes, extra request, or bundle question"></textarea>
          </div>
          <div class="cta-stack" style="margin-top:16px">
            <a class="btn" id="text-order" href="#">Text To Order</a>
            <a class="btn blue" id="email-order" href="#">Email Order</a>
            <a class="btn ghost" href="tel:${ORDER_PHONE}">Call ${ORDER_PHONE_DISPLAY}</a>
          </div>
          <div class="cta-note">If the buyer is on mobile, `Text To Order` is the fastest path. If they are on desktop, `Email Order` gives them a clean prefilled order draft.</div>
        </div>
        <div class="panel">
          <h2>Product Details</h2>
          <div class="bullet-list">${detailHtml}</div>
        </div>
      </section>

      <section class="split">
        <div class="panel">
          <h2>How Tonight Works</h2>
          <div class="bullet-list">
            <div class="bullet"><strong>1. Buyer chooses size and color</strong>That goes straight into the text or email draft.</div>
            <div class="bullet"><strong>2. Buyer sends order request</strong>Bryan confirms the exact product variation and answers any fit questions.</div>
            <div class="bullet"><strong>3. Payment is handled manually</strong>Until real Shopify checkout is wired, this is the fastest honest order path.</div>
          </div>
        </div>
        <div class="panel">
          <h2>Order Contact</h2>
          <div class="contact">
            <div class="bullet"><strong>Text / Call</strong><a href="tel:${ORDER_PHONE}">${ORDER_PHONE_DISPLAY}</a></div>
            <div class="bullet"><strong>Email</strong><a href="mailto:${ORDER_EMAIL}">${ORDER_EMAIL}</a></div>
            <div class="bullet"><strong>Fulfillment</strong>Manual confirmation tonight. Shopify and Printful sync can replace this flow after the exact production packages are finalized.</div>
          </div>
        </div>
      </section>
    </div>
  `;

  const sizeEl = document.getElementById('size');
  const colorEl = document.getElementById('color');
  const notesEl = document.getElementById('notes');
  const textOrder = document.getElementById('text-order');
  const emailOrder = document.getElementById('email-order');

  function updateLinks() {
    const summary = buildOrderSummary(product, sizeEl.value, colorEl.value, notesEl.value.trim());
    textOrder.href = `sms:${ORDER_PHONE}?&body=${encodeURIComponent(`I want to order:\n\n${summary}`)}`;
    emailOrder.href = `mailto:${ORDER_EMAIL}?subject=${encodeURIComponent(`Order Request - ${product.shortName}`)}&body=${encodeURIComponent(`I want to order:\n\n${summary}`)}`;
  }

  sizeEl.addEventListener('change', updateLinks);
  colorEl.addEventListener('change', updateLinks);
  notesEl.addEventListener('input', updateLinks);
  updateLinks();
}

document.addEventListener('DOMContentLoaded', renderHeroProductPage);
