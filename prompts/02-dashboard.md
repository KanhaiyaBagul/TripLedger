# Screen 2: Dashboard — My Trips

A premium dark-mode dashboard showing a user's group trips at a glance — data-rich, scannable, and action-oriented.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Web, Desktop-first, 2-column sidebar + main layout
- Theme: Dark, sophisticated, subtle depth with glass cards
- Background: Deep Navy (#0f172a) full page
- Sidebar: Dark Slate (#0f172a) with 1px right border in white/5%
- Surface/Cards: Elevated Slate (#1e293b) with white/8% border, 12px radius, soft shadow
- Primary Accent: Electric Violet (#7c3aed) for active nav, CTAs, highlights
- Success: Emerald (#10b981) for positive balances ("you are owed")
- Danger: Rose (#f43f5e) for negative balances ("you owe")
- Text Primary: White (#f8fafc)
- Text Secondary: Slate-400 (#94a3b8)
- Font: Inter — 700 headings, 500 labels, 400 body

**Page Structure:**
1. **Left Sidebar (240px fixed):** TripLedger logo + violet icon at top; Nav items: Dashboard (active — violet pill highlight), My Trips, Settlements, Profile; Bottom: user avatar circle + "amit@example.com" in slate-400 + "Log Out" ghost button
2. **Top Header Bar:** "My Trips" in 28px bold white (left), subtitle "Manage your shared group expenses" in slate-400, "+ New Trip" violet pill button (right-aligned with plus icon)
3. **Summary Stats Row (3 equal cards):**
   - Card A: Violet plane icon badge — "3" large bold, "Active Trips" slate-400 label
   - Card B: Amber receipt icon badge — "₹18,000" large bold, "Total Expenses" label
   - Card C: Emerald arrow-up icon badge — "₹3,500" large bold emerald, "You're Owed" label
   Each card: glass surface (#1e293b), colored icon in soft glow badge, subtle colored top gradient border
4. **Trip Cards Grid (2-column):**
   - Card "Goa Trip 2026": Violet left-border accent (4px), members badge "4 members", "₹18,000 total" in amber, "Feb 28, 2026" in slate-400, "View Trip →" violet ghost button, 3-dot menu (Delete)
   - Card "Manali Weekend": Blue left-border accent, "3 members", "₹12,000 total", "Jan 15, 2026", "View Trip →" button
   - Ghost card: Dashed 1px slate border, centered plus icon in slate-500, "Create a new trip" in slate-400
5. **Empty State (if 0 trips):** Centered suitcase illustration, "No trips yet" in 22px bold, "Create your first trip and invite friends to split expenses" in slate-400, large violet CTA "Create Your First Trip"
