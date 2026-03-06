# All Things Adriano — Project Brief & Status
*Last updated: March 2026*

---

## 1. Client Overview

**Studio name:** All Things Adriano  
**Location:** Bryn Mawr Neighbourhood, Edgewater, Chicago, IL  
**Type:** Private boutique beauty studio — appointment only  
**Stylist:** Adriano  
**Services:** Hair (cuts, color, treatments) + Skin (consultations, facials)  
**Booking platform:** Vagaro (`vagaro.com/allthingsadrianocom`)  
**Target audience:** Women 25+, LGBTQ+ clients, out-of-state clients visiting Chicago  
**Positioning:** Exclusive, private, 1:1 experience — not a traditional salon

---

## 2. Visual Identity

### Tone & Voice
- Refined, intentional, warm but not casual
- Avoid clinical coldness — "human warmth" is a core brand value
- English only (Chicago market)

### Color Palette
| Token | Hex | Usage |
|---|---|---|
| Warm White | `#F7F5F0` | Primary background |
| Beige | `#EDE8DF` | Secondary surfaces, cards |
| Stone | `#C4BDB0` | Dividers, muted UI |
| Gold | `#A8906A` | Brand accent, headlines, CTAs |
| Gold Light | `#C4A97D` | Hover states, price labels |
| Sage Dark | `#6C7A68` | Skin section accent |
| Sage BG | `#EBF0E9` | Skin section background |
| Ink | `#1C1917` | Primary text, dark sections |
| Ink Mid | `#3D3935` | Body text |
| Ink Muted | `#6B6560` | Secondary text |
| Ink Faint | `#9C9790` | Labels, captions |

### Typography
- **Display / Headings:** Playfair Display (serif, weight 300–400, italic for gold accents)
- **Body / UI:** Jost (sans-serif, weight 200–400)

### Design Principles
- Minimal — generous white space, no clutter
- Gold accent lines (2px left borders on cards, section dividers)
- Scroll reveal animations (fade up, staggered delays)
- Custom gold cursor (desktop only)
- Ticker bar (dark background, scrolling brand keywords)

---

## 3. Site Architecture

Single-page layout, 10 sections:

| # | Section | ID | Notes |
|---|---|---|---|
| 01 | Nav | — | Fixed, compacts on scroll, hamburger on mobile |
| 02 | Hero | `#home` | 50/50 split, detail card "Focused" |
| 03 | Ticker | — | Scrolling keywords, dark bg |
| 04 | About | `#about` | Portrait photo + 2×2 quality grid |
| 05A | Hair Services | `#services-hair` | Dark bg, 3 cards, gold accent |
| 05B | Skin Services | `#services-skin` | Sage bg, 3 cards, sage accent |
| 06 | The Studio | `#studio` | Left text + 3-image right grid |
| 07 | Quote | — | Full-width pull quote, centered |
| 08 | Google Reviews | `#reviews` | 3 cards, dark bg (see §6) |
| 09 | Booking | `#booking` | Left meta + right Vagaro widget |
| 10 | Footer | — | 3-col: brand, navigate, connect |

---

## 4. Copy Decisions (client-approved)

### Hero
- Headline: *"Beauty with intention. Precision with care."*
- "intention" and "care" in gold, "Beauty with" and "Precision with" in ink
- Detail card: **"Focused"** (not "Intentional")

### About — Quality Grid
| Box | Title | Body |
|---|---|---|
| 1 | **Perfection** | Technical mastery applied with accuracy. |
| 2 | Discretion | A private environment where you are the focus. |
| 3 | Expertise | Deep knowledge across hair and skin. |
| 4 | Safety | Inclusive, affirming space for every client. |

### Services — Hair
1. **Precision Cut** — "face, hair texture, and lifestyle" (lifestyle last)
2. **Color & Toning** — "executed with **fineness**"
3. **Treatment & Restoration** — "**thinning hair**"

### Services — Skin
1. Skin Consultation
2. Facial Treatment
3. Skin + Hair Session (combined)

### Booking Section
- **Location:** "We're located in the historic Bryn Mawr Neighbourhood in Edgewater, Chicago"
- **Parking:** "Free private & gated parking available for all clients" *(no suffix)*

---

## 5. Files Delivered

| File | Description |
|---|---|
| `allthingsadriano_desktop_v6.png` | Latest desktop sketch (1400px) |
| `allthingsadriano_mobile_v6.png` | Latest mobile sketch (390px) |
| `allthingsadriano_v3.html` | Latest production HTML (single file, all CSS + JS inline) |

### Logo Assets
The client provided a logo (black bg, gold monogram + text). Three versions extracted:
- `logo_transparent.png` — full transparent PNG (source)
- `logo_nav.png` — 180px wide, for light nav background
- `logo_footer.png` — 200px wide, brightened for dark footer background

To activate in HTML: place logo files in an `assets/` folder and update the `src` attributes in nav and footer. Fallback text renders automatically if the image file is missing.

---

## 6. Integrations — Decisions

### Vagaro (Booking)
**Decision: Redirect link (no embed)**

The client opted for the zero-cost approach. Instead of an iframe embed, the booking widget will be replaced with a direct link button that redirects the user to the Vagaro booking page:

```
https://www.vagaro.com/allthingsadrianocom/book-now
```

**To implement in HTML:** Remove the `<iframe>` block inside `.vagaro-iframe-wrapper` and replace with a styled CTA button:

```html
<a href="https://www.vagaro.com/allthingsadrianocom/book-now"
   target="_blank" rel="noopener"
   class="btn-primary">
  Book Now on Vagaro
</a>
```

---

### Google Reviews
**Decision: Pending**

Three options were discussed:

| Option | Cost | Design Control | Auto-updates | Effort |
|---|---|---|---|---|
| Google Maps iframe embed | Free | None (Google UI) | Yes | Minimal |
| Elfsight / Trustmary widget | ~$9–25/mo | Partial | Yes | Low |
| Google Places API + custom frontend | Free tier + usage costs | Full (matches sketch exactly) | Yes | Medium–High (requires backend/serverless) |

**Current status:** Client is evaluating. The current HTML has a static figurative section (3 hardcoded review cards) as a placeholder that matches the visual design. This will be replaced once a decision is made.

**Direct link to Google Reviews profile** (works regardless of chosen option):
```
https://www.google.com/maps/search/?api=1&query=All+Things+Adriano+Chicago
```
Or with Place ID (more precise — obtain from Google Maps):
```
https://search.google.com/local/reviews?placeid=PLACE_ID
```

---

## 7. Next Steps

- [ ] Client to decide on Google Reviews integration approach
- [ ] Provide professional photography for hero, about portrait, and studio images
- [ ] Confirm Vagaro redirect vs embed final preference
- [ ] Supply logo files in `assets/` folder to activate in HTML
- [ ] Domain + hosting setup
- [ ] Final QA on mobile devices (iOS Safari, Android Chrome)
