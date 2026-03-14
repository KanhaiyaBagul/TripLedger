# Screen 4: Add Expense Modal

A sleek dark-mode slide-in modal for adding a new expense to a group trip — focused, minimal, form-forward.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Web modal overlay on top of Trip Detail page
- Theme: Dark glass modal on dim backdrop (black/60% overlay)
- Modal Surface: Slate-800 (#1e293b), 16px radius, 1px white/10% border, heavy drop shadow
- Input Style: Slate-900 (#0f172a) background, white text, 8px radius, violet focus ring
- Primary Button: Violet pill (#7c3aed) with gradient, full-width
- Cancel: Ghost text link "Cancel" in slate-400
- Font: Inter

**Page Structure:**
1. **Modal Header:** "Add New Expense" in 20px 700-weight white (left), X close icon button in slate-400 (right)
2. **Description Field:** Label "What was it for?", dark input, placeholder "e.g. Hotel booking, Train tickets, Food"
3. **Amount Field:** Label "Amount", dark input with "₹" prefix badge in slate-500, number keyboard, placeholder "0.00"
4. **Paid By Dropdown:** Label "Who paid?", dropdown trigger showing selected member with colored avatar circle + name "Amit ▾"; Dropdown list: each option has avatar + name in dark popover card
5. **Participants Section:** Label "Split between", 2-column checkbox grid — each member row: colored avatar circle, name, checkbox (checked by default); "Select All" / "Clear All" quick-action links in violet above grid
6. **Split Type Badge:** Read-only info row — "Split Type:" label + "Equal Split" chip in slate-700 with ⓘ tooltip icon
7. **Live Calculation Preview:** Highlighted calculation box in slate-800 border: "Each person pays: ₹2,000" updating live — use emerald text for the amount
8. **Action Buttons:** "Add Expense" full-width violet pill button (bottom of modal); "Cancel" centered ghost text link below it in slate-400
