# RR Flowers Website V2 — Premium Revision V3

Static mobile-first website for RR Flowers Surabaya. Built to help visitors browse flower products and start an order through WhatsApp.

## What's changed in V3
- The hero section uses a full bouquet image layer with a soft pink-white gradient.
- Four service-benefit cards now appear directly under the main hero copy: Fast Response, WhatsApp can be contacted to send an order any time, Personalized Arrangements, and Scheduled Delivery.
- Product/catalog image cards use a consistent 1:1 square ratio and `object-fit: contain` so the original photo is not cropped.
- Featured products show a visible **Best Seller** badge with a star icon. The badge appears only for products marked `featured: true` in `data/products.json`.
- Product titles, descriptions, filters, and buttons have more readable sizing and more spacing, including on mobile.
- Local CSS/JS references include a version query to help avoid stale cached files.

## Install into an existing GitHub Codespaces repository
1. Download and extract the ZIP.
2. Select **all contents inside the extracted folder** (not the outer folder itself).
3. Drag them into the root of the existing `rrflowerssurabaya` repository, at the same level as `index.html`.
4. Replace/overwrite matching files. Make sure these are included: `index.html`, `katalog.html`, `product.html`, `tentang.html`, `portfolio.html`, `partnership.html`, `css/style.css`, `js/app.js`, `data/products.json`, and `assets/`.
5. Save files with `Ctrl+S`. The CSS and JS query strings have been bumped to `v=3` to help the browser load the new versions.
6. Run `python -m http.server 8080` in the Codespaces terminal. Open port 8080 and visit `/index.html`.
7. Refresh the preview with `Ctrl+Shift+R`.

## Important notes
- This is a static prototype. Confirm each product photo matches the correct SKU before publishing.
- The Best Seller badge is driven by `featured: true` in `data/products.json`; it is not automatically added to every product.
- “WhatsApp can be contacted any time” means visitors can send a message at any time; it does not promise that a staff member replies 24 hours a day.
- Review all product names, prices, contact information, and delivery coverage before launch.
