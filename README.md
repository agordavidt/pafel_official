# Pafel Solutions Nigeria Limited — Website

Marketing website for Pafel Solutions, an Abuja-based HVAC engineering company offering design, installation, maintenance, and procurement services across Nigeria.

**Live site:** https://pafelsolutions.com/

## Pages

| Page | Purpose |
|---|---|
| `index.html` | Home — hero, services overview, key benefits, featured deployments, testimonials |
| `about.html` | Company mission/vision/values, process, safety standards, partner logos |
| `services.html` | Detailed service breakdown (HVAC Design, Installation, Maintenance & SLAs, Sourcing) with an SLA comparison table |
| `projects.html` | Portfolio grid + detailed case studies |
| `contact.html` | General enquiry form, map, contact details |

Every page shares a persistent navbar, footer, floating WhatsApp button, and a **Book Site Assessment** modal (booking form with a JS-driven calendar/time-slot picker).

## Tech stack

- **Bootstrap 5.3.3** — layout, components, modal, carousel
- **AOS** (Animate On Scroll) — scroll-triggered entrance animations
- **GSAP** — hero entrance animation, stat counters
- **Web3Forms** — form backend (no server required) for both the booking modal and the contact form; on failure both forms show an inline error with a `mailto:` link as backup
- **Google Fonts (Inter)** — typography
- Vanilla JS (`assets/js/main.js`) — no build step, no framework

## File structure

```
/
├── index.html
├── about.html
├── services.html
├── projects.html
├── contact.html
├── assets/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   └── images/
```

## Setup

1. **Web3Forms access key** — both forms currently reference a placeholder in `main.js`:
   ```js
   var WEB3FORMS_ACCESS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY';
   ```
   Get a free key at [web3forms.com](https://web3forms.com) using `admin@pafelsolutions.com`, then replace the placeholder. Forms will not send until this is set.

2. **No build step.** This is a static site — clone/download and open `index.html`, or deploy the folder as-is to Netlify, Vercel, or any static host.

## Key implementation notes

- **Booking form** (`#assessmentModal`, present on every page) sends to email only via Web3Forms. Success shows a styled in-page confirmation before the modal auto-closes; failure keeps the modal open with the form data intact and a direct `mailto:` fallback link. Each page's copy of the modal needs a `<p class="form-status" id="bkStatus"></p>` between the submit button and `.booking-note` for this to render — **`index.html`, `about.html`, `services.html`, `projects.html`, and `contact.html` all need to carry this in sync**, since the modal markup is duplicated per page rather than templated.
- **Contact form** (`contact.html`) behaves the same way — email via Web3Forms, styled success/error state, `mailto:` fallback — needs a matching `<div class="form-status" id="cStatus">`.
- **Design tokens** live at the top of `style.css` as CSS custom properties (`--magenta`, `--ink`, `--gray-500`, etc.) — change brand colors from one place.
- **Mobile nav** uses a `.nav-on-dark` class (added in JS when a `.page-header` is present) to keep the navbar transparent-with-white-text over dark hero banners until the user scrolls.



Act as an expert Senior Front-End Engineer and UI Designer specializing in high-converting agency marketing websites. 

Your task is to build a completely responsive, modern, single-page variant or multi-section landing page that accurately replicates the structure, design language, and content of the premier hybrid creative marketing agency, Anchor Digital (https://anchordigital.com.au/).

You must write clean, production-ready HTML featuring Tailwind CSS for styling and interactive state configurations. Do not use generic placeholders like "// write styles here." Everything must be complete.

---

### 1. VISUAL SYSTEM & TYPOGRAPHY STYLE GUIDE
Follow these exact design tokens to match the site's premium feel:
*   **Color Palette:**
    *   Primary Background: Clean, modern slate-whites (`bg-slate-50` or `bg-white`).
    *   Dark Accents: Premium dark navy/charcoal (`text-slate-900` or `text-zinc-900`). **Crucial:** Avoid pure #000000 to keep the design premium and reduce eye strain.
    *   Brand Accent: Vibrant Electric Royal Blue (`text-blue-600`, `bg-blue-600`, `hover:bg-blue-700`).
*   **Typography Specs:**
    *   Font Family: Use a clean modern Sans-Serif system throughout (utilize Tailwind's `font-sans` stacking Inter/Geist-style layout).
    *   Headings: Large, tracking-tight, heavy weights (`font-bold tracking-tight text-slate-900`).
    *   Body Copy: Set text to an easy-to-read slate/gray (`text-slate-600`), enforcing an optimal reading line length limit (max width of `max-w-2xl` to `max-w-3xl`) to hit 50-75 characters per line. High line height (`leading-relaxed`).

---

### 2. CORE LAYOUT SECTIONS TO GENERATE
Build the page structure using semantic HTML5 elements filled with Anchor Digital's actual brand positioning messaging:

*   **Header & Navigation:** Clean desktop layout containing a minimalist logo marker, a multi-column links array (Services, Work, About, Locations, News), and a clear "Get in Touch" high-contrast CTA button.
*   **Hero Area:** Clean layouts featuring a bold split design or asymmetrical left-heavy tracking text: 
    *   *Headline:* "/ Brisbane-based creative and digital marketing agency"
    *   *Subheadline:* "We create digital solutions to market your business."
    *   *Intro block text:* "Refusing to stay in one lane, we define ourselves as a hybrid creative marketing agency..."
    *   Actionable CTAs with micro-hover translations.
*   **"How We Can Help" Service Grid:** A grid layout containing individual card sections detailing their multi-disciplinary spectrum:
    1. Brand Strategy & Consulting
    2. Website Design & Development
    3. Graphic Design
    4. Marketing Strategy Workshops
    5. SEO (Search Engine Optimisation)
    6. Social Media Advertising
*   **Case Studies / "Our Work" Grid:** Distinct visual showcases highlighting performance numbers for active clients like "Thirdson Constructions", "Adventure Professionals", and "Bridj" (showing metric boosts like "275% increase in App Downloads").
*   **Testimonials Layer:** A clean blockquote section emphasizing client reviews and data metrics ("1,053% increase in organic traffic").
*   **Latest Insights Blog Section:** A clean 3-card news grid detailing modern topics from 2026:
    *   "Proof of Human: Using 'Verified Human' Content to Beat the AI Noise"
    *   "The 'Dark Social' Dilemma: Measuring What Google Analytics Can't See"
    *   "The 'Post-Purchase' Engine: Turn One-Time Buyers into Brand Advocates"
*   **Footer Matrix:** Comprehensive mapping of physical office locations (Brisbane, Sunshine Coast, Sydney), full service listings, and copyright tags.

---

### 3. TAILWIND-ONLY ANIMATIONS & MICRO-INTERACTIONS
You must inject life into the UI by applying these interaction layer effects directly within Tailwind utility setups:
*   **Fades & Reveal Mockups:** Utilize standard transition parameters (`transition-all duration-700 ease-out`) combined with interactive triggers to give the interface an elegant scroll-reveal feeling.
*   **Bespoke Cards & CTAs:** Interactive elements like buttons and service cards must shift elegantly on user attention. Use combinations such as `transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:border-blue-600/30`.
*   **Smooth Easing Hooks:** Ensure smooth color changes and micro-scaling transitions by applying explicit transition utility curves (`ease-in-out` or custom cubic-bezier style curves).

Please output the complete, fully formed layout block including all structural code and the real content blocks specified above.