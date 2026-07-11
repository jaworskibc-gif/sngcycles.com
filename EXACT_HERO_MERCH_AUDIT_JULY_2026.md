# SNG Exact Hero Merch Audit

Date: July 11, 2026

This file locks the final hero set for the 90-day apparel push and separates:

- hero product selected
- exact production package exists

Do not publish a product to Shopify or Printful unless it matches the locked board exactly.

## Locked Hero Set

### 1. Shark Not Goldfish Rider Team Colors Snapback

- Status: not exact-ready
- Locked version:
  - smaller SNG front mark
  - `GET OUT AND RIDE!` under front logo
  - rider team colorways
  - side rider embroidery
  - back SNG hit
- Closest local base:
  - `hat-team-colors-sheet.jpg`
  - `hat-snap-*.png`
  - `assets/payhip/merch-ready/hat-*.svg`
- Exact blockers:
  - front embroidery art does not match final locked board
  - final front text treatment must be rebuilt

### 2. Florida Grown Tee

- Status: not exact-ready
- Locked version:
  - black tee
  - small SNG FL Grown chest hit
  - full Florida Grown shark back graphic
- Exact blockers:
  - no confirmed exact print package on disk
  - need exact front chest print file
  - need exact back print file

### 3. Megalodon Tee

- Status: not exact-ready
- Locked version:
  - chosen board from review thread
  - exact front/back layout from that board only
- Closest local base:
  - `sng-megalodon-tee-sheet.png`
  - `sng-tee-megalodon-sheet.png`
- Exact blockers:
  - local Megalodon board is a different version
  - final front and back art package must match selected board exactly

### 4. SNG Conversion Tee Series

- Status: close, but not verified exact
- Locked version:
  - team colorways
  - front chest logo
  - `I USE TA HAVE GAS. NOW I JUST HAUL ASS.`
- Closest local base:
  - `sng-conversion-series-shirt.png`
  - `assets/printful-ready/tee-front-logo-chest.png`
  - `assets/printful-ready/tee-back-gas-print.png`
- Exact blockers:
  - final sizing and colorway treatment must be checked against the selected board

### 5. Shut Up Get Out And Ride Hoodie

- Status: not exact-ready
- Locked version:
  - black hoodie
  - `SHUT UP GET OUT AND RIDE` back graphic
  - sleeve hit
  - checker details
  - matching checker hat used as upsell/bundle piece, not core hero slot
- Closest local base:
  - `mens-race-day-hat-and-hoodie-black.png`
- Exact blockers:
  - no isolated exact hoodie production package found
  - existing hoodie files on disk are different products

## Publish Rule

For each hero product, the following must exist before publish:

1. Exact front art file
2. Exact back art file if applicable
3. Exact side/back embroidery file if applicable
4. Exact product mockup matching the locked board
5. Shopify title, copy, price, and variant map

## Next Build Order

1. Rider Team Colors Snapback
2. SNG Conversion Tee Series
3. Florida Grown Tee
4. Megalodon Tee
5. Shut Up Get Out And Ride Hoodie

## Required Source Inputs

To make these exact, export the final locked boards or source art for:

- Rider Team Colors Snapback final revised board
- Florida Grown Tee final board
- Megalodon Tee final board
- Shut Up Get Out And Ride Hoodie final board

If those are saved into the repo, use them as the source of truth. Do not substitute older mockups.
