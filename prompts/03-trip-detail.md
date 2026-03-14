# Screen 3: Trip Detail Page — Expenses, Members & Settlements

A comprehensive trip management hub with tabbed navigation — showing expenses, members, and the settlement breakdown in one dark, fluid interface populated with the "Goa Trip 2026" example data.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Web, Desktop-first, same sidebar + main layout as Dashboard
- Theme: Dark, tabbed content, data-dense but scannable
- Background: Deep Navy (#0f172a)
- Surface Cards: Elevated Slate (#1e293b), white/8% border, 12px radius
- Tab Active: Violet (#7c3aed) underline, white text
- Tab Inactive: Slate-500 text, no underline
- Table Row Dividers: 1px white/5% lines
- Badge Colors: Violet (owner), Slate-600 (member), Emerald bg (settled), Amber bg (pending)
- Font: Inter

**Page Structure:**
1. **Breadcrumb:** "Dashboard / Goa Trip 2026" in slate-400 with chevron separator
2. **Trip Header Card (full-width glass card):** "Goa Trip 2026" in 32px bold white; Description: "Our annual Goa getaway with the squad" in slate-400; Metadata row: "4 Members • ₹18,000 Total • Created Feb 28, 2026" in slate-500; Right side: "+ Add Expense" violet pill button + "Invite Member" ghost outline pill button
3. **Tab Bar:** "Expenses" (active, violet underline) | "Members" | "Settlements" — horizontal, spaced evenly

**TAB 1 — Expenses (active by default):**
4. **Expense Table:** Columns: Description | Amount | Paid By | Participants | Date | Actions
   - Row 1: "Train Tickets" | "₹8,000" amber | "Amit" (avatar + name) | "4" | "Feb 28" | trash icon
   - Row 2: "Hotel Booking" | "₹6,000" | "Rahul" | "4" | "Feb 28" | trash icon
   - Row 3: "Food" | "₹4,000" | "Sneha" | "4" | "Feb 28" | trash icon
   - Footer row: "Total: ₹18,000" right-aligned bold

**TAB 2 — Members:**
5. **Members List:** Each row: colored initial avatar circle, Name (bold white), email in slate-400, role badge (violet "Owner" / slate "Member"), "Remove" ghost danger button
   - Amit | amit@example.com | Owner
   - Rahul | rahul@example.com | Member
   - Sneha | sneha@example.com | Member
   - Karan | karan@example.com | Member
6. **Invite Row:** Email input "Invite by email address..." + "Send Invite" violet button

**TAB 3 — Settlements:**
7. **Balance Summary Row (4 pills):** "Amit +₹3,500" (emerald bg), "Rahul +₹1,500" (emerald bg), "Sneha −₹500" (rose bg), "Karan −₹4,500" (rose bg). Below: "Per person share: ₹4,500" in slate-400
8. **Settlement Transactions (3 cards):**
   - "Karan → Amit: ₹3,500" — payer avatar, right arrow icon in violet, payee avatar, amount bold amber, "Mark Settled" pill toggle (ghost → green filled on click)
   - "Karan → Rahul: ₹1,000" — same layout
   - "Sneha → Rahul: ₹500" — same layout
9. **Algorithm Note:** Small info chip at bottom: "✓ Optimized: 3 transactions instead of 6 possible" in slate-500 with info icon
