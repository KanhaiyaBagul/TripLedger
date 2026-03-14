# Design System: TripLedger
**Project ID:** 4229727256817814367

## 1. Visual Theme & Atmosphere

TripLedger is sophisticated, finance-adjacent, and focused. The aesthetic is **dark glassmorphism** — a premium, high-contrast experience that feels both trustworthy and modern. The mood is "night-mode productivity tool": dense with data yet breathable through generous spacing. Cards feel like frosted portals floating above a deep navy void. Every surface has quiet depth.

## 2. Color Palette & Roles

| Name | Hex | Role |
|------|-----|------|
| Midnight Navy | `#0f172a` | Global page background |
| Deep Slate | `#1e293b` | Sidebar, card surfaces, modals |
| Dark Slate | `#0f172a` | Input field backgrounds |
| Electric Violet | `#7c3aed` | Primary accent — CTA buttons, active nav, focus rings, borders |
| Frosted White Border | `rgba(255,255,255,0.08)` | Card/surface borders |
| Pure White | `#f8fafc` | Primary headings and high-emphasis text |
| Cool Slate | `#94a3b8` | Secondary body text, labels, placeholders |
| Muted Slate | `#64748b` | Tertiary text, dividers |
| Emerald | `#10b981` | Positive balances ("you are owed"), settled status |
| Rose | `#f43f5e` | Negative balances ("you owe"), danger actions |
| Amber | `#f59e0b` | Total expense highlights, warnings |

## 3. Typography Rules

- **Font Family:** Inter (Google Fonts) — loaded via `next/font/google`
- **Headings (h1):** 700 weight, `#f8fafc`, 28–32px
- **Subheadings (h2/h3):** 600 weight, `#f8fafc`, 18–22px
- **Labels:** 500 weight, `#94a3b8`, 13–14px, `letter-spacing: 0.02em`
- **Body / Descriptions:** 400 weight, `#94a3b8`, 14–16px
- **Numeric values (amounts):** 700 weight, colored per role (emerald/rose/white)
- **Small print / metadata:** 400 weight, `#64748b`, 12px

## 4. Component Stylings

- **Primary Buttons:** Fully pill-shaped (`border-radius: 9999px`), violet gradient (`#7c3aed → #6d28d9`), white text, hover glow of violet at 30% opacity
- **Ghost Buttons:** Pill-shaped, 1px `#7c3aed` border, transparent background, violet text
- **Danger Buttons:** Pill-shaped, rose background (`#f43f5e`), white text
- **Cards/Containers:** `border-radius: 12px`, `background: #1e293b`, `border: 1px solid rgba(255,255,255,0.08)`, `box-shadow: 0 4px 24px rgba(0,0,0,0.4)`
- **Glass Modal:** Same as cards but with `backdrop-filter: blur(16px)` and `background: rgba(30,41,59,0.85)`
- **Input Fields:** `background: #0f172a`, white text, `border: 1px solid rgba(255,255,255,0.1)`, `border-radius: 8px`, violet focus ring (`box-shadow: 0 0 0 2px #7c3aed`)
- **Badges/Chips (role):** Violet (owner), Slate-600 (member), Emerald bg (settled), Amber bg (pending) — all `border-radius: 9999px`, small padding, bold uppercase 11px text
- **Navigation Active State:** Violet background pill behind nav item text
- **Tabs:** Animated sliding violet underline on active tab, `#94a3b8` text for inactive

## 5. Layout Principles

- **Sidebar:** 240px fixed width, full viewport height, `background: #0f172a`, right border `rgba(255,255,255,0.05)`
- **Main Content:** Remaining width, `padding: 32px 40px`, scrollable
- **Grid:** 2-column responsive card grid (switches to 1-col on mobile), `gap: 20px`
- **Spacing:** 8px base unit — 16px inner card padding, 32px section gaps, 40px page padding
- **Header rows:** Space-between flex — title left, action buttons right
- **Stat cards:** Equal 3-column row, icon badge left, number + label right
- **Elevation layers:** Background (0) → Cards (1) → Modals (2) → Toasts (3)
