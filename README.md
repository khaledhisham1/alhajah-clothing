# Al Hajah — Bridal Atelier Store (Demo)

A presentation demo of an online store for **Al Hajah** (إسدالات الحاجة), a women's clothing manufacturer in Kerdasa, Giza, specializing in bridal esdals and reception abayas.

> This is a **demo**, not a production store. Products, prices and photos are sample data, and checkout is simulated.

## Concept: The Bridal Atelier
The site opens behind two cream fabric curtains. A gold arch draws itself, a bridal photo fades in, and the name "الحاجة" appears. "ادخلي المعرض" parts the curtains into the store. The intro can be skipped, plays once per session, and respects `prefers-reduced-motion`.

## Features
- Editorial homepage: arched hero, collections (Bridal, Reception, Everyday), bridal story, fabrics
- Shop view with collection filter and price sort (hash routing, no page reloads)
- Product pages with fabric swatches, colors, esdal length (140–170 cm), quantity, hover zoom, and related items
- Size advisor: height and weight give a recommended length, which pre-selects on product pages
- Shopping bag drawer saved in `localStorage`
- Checkout with validation, event date, and payment choice (cash on delivery or a simulated Vodafone Cash)
- Order confirmation with an animated WhatsApp conversation, plus a real `wa.me` link carrying the formatted order
- Responsive, RTL, mobile-first

## Tech
Plain HTML, CSS and JavaScript. No build step, no backend, no API keys.

```
index.html
assets/css/style.css
assets/js/data.js   # sample products, fabrics, size logic
assets/js/app.js    # router, cart, checkout, intro
assets/img/
```

Run locally: open `index.html`, or serve the folder (for example `python -m http.server`).

## Image credits
All photos are from [Unsplash](https://unsplash.com) under the Unsplash License, used for illustration only. They are not the manufacturer's products.
