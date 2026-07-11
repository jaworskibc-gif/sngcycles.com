# Zeely AI Research And SNG Build Translation

Date: July 11, 2026

## What Zeely is now

Based on Zeely's current public site, pricing page, App Store listing, and Google Play listing, the product is positioned as a mobile-first AI marketing platform for small sellers.

Core public claims:

- Product link in -> AI extracts product data and builds ads
- AI UGC-style video generation with avatars
- AI static ad generation with templates
- Campaign launch support for Meta and other ad platforms
- AI sales page / web store for sellers without a site
- Order and payment tracking inside the app

Current public source notes:

- Zeely homepage says users can "Let AI create UGC videos, static ads, and high-selling campaigns" and outlines a 5-step loop: product URL, video ads, static ads, launch campaigns, grow sales.
  Source: https://zeely.ai/
- Zeely pricing page currently lists:
  - Starter: $29.95/month, 2,500 credits
  - Plus: $49.95/month, 5,000 credits
  - Growth: $79.95/month, 10,000 credits
  Source: https://zeely.ai/price/
- Zeely pricing FAQ says running ads may include extra charges and Zeely may charge up to 12%.
  Source: https://zeely.ai/price/
- Apple App Store listing describes:
  - AI video maker
  - AI creative builder
  - AI ad launcher
  - payment and order tracking
  - AI-powered sales page if the seller has no store
  Source: https://apps.apple.com/us/app/zeely-ai-marketing-platform/id1586861768
- Google Play listing says:
  - 100K+ downloads
  - updated June 26, 2026
  - recent update mentions Brand DNA and Target Audience
  Source: https://play.google.com/store/apps/details?hl=en_US&id=app.zeely.android

## What matters for SNG

Zeely is strongest as an execution wrapper for small sellers who do not want to piece together:

- product pages
- hooks
- scripts
- ad creatives
- campaign launch
- tracking

For SNG apparel, the useful part is not the generic "AI" label. The useful part is the closed loop:

1. pick product
2. pick angle
3. generate hooks and scripts
4. generate creative variations
5. launch traffic
6. measure units sold and iterate

That is the system SNG needs in order to sell 350 pieces in 90 days.

## What Zeely does that we cannot clone directly in this repo

Without outside APIs, ad-platform credentials, and generative media services, this repo cannot directly reproduce:

- Zeely's proprietary multi-model video generation stack
- avatar generation
- direct paid-ad launch and optimization
- real payment/order sync from multiple processors
- app-store-native mobile UX

## What we can build now

Inside the current `sng-cycles` static-site stack, we can build a Zeely-style SNG Apparel Sales OS that covers the most operationally important pieces:

- curated apparel product feed
- hero-product prioritization
- 90-day unit target math
- product-to-angle-to-script workflow
- hook and CTA generator
- landing-copy generator
- campaign board
- content production plan
- daily sales tracker
- weekly projection logic

This is enough to run the sales machine manually while keeping the process tight.

## SNG target translation

Primary goal:

- 350 pieces sold in 90 days

Working math:

- 350 units in 90 days
- 116.7 units per 30 days
- 26.9 units per week
- 3.9 units per day

At a blended AOV of roughly $38:

- 350 units x $38 = $13,300 gross revenue target

At a blended AOV of roughly $45:

- 350 units x $45 = $15,750 gross revenue target

That means the real job is to turn a small number of hero SKUs into repeatable traffic and purchase behavior, not to promote the entire catalog equally.

## Recommended merchandising strategy

Use a hero-SKU stack, not a catalog-first strategy.

Hero products to push first:

- SNG Rider Hat
- SNG Builder's Series Hat
- SNG Black Tee
- SNG Black Hoodie
- Leave The School Behind Tee

Supporting products stay available, but do not carry the paid and organic workload first.

## Zeely-inspired build spec for SNG

The SNG version should act like a focused sales operator workspace:

- Dashboard
  - unit target
  - weekly pace
  - blended AOV
  - projected revenue
- Product Feed
  - hero SKUs
  - product angles
  - audience fit
- Creative Engine
  - hooks
  - short-form scripts
  - CTA variants
  - landing-copy variants
- Campaign Lab
  - channel
  - objective
  - offer
  - creative count
- Sales Tracker
  - daily units
  - traffic
  - spend
  - conversion rate
  - notes

## Recommendation

Do not try to clone Zeely visually and feature-for-feature.

Build the SNG-specific version that is narrower but more useful:

- apparel-first
- founder-story aware
- creator/reel driven
- built around actual SNG products and slogans
- built around the 350-unit / 90-day target

That is the system being implemented in `SNG_APPAREL_SALES_OS.html`.
