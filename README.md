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
