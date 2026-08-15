# Interaction notes — Property index

Companion to `README.md`. Behaviour only; measurements are in `component-spec.md`.

## 1. The persistent target baseline

### States

| State | Trigger | Appearance |
| --- | --- | --- |
| Full panel | Page load, scroll position < 120 px | `primary-container` card above the list. Label, address, city, market event and date, plus eight baseline stats: price, $/sq ft, beds, baths, size, lot, year built, closest neighbour. |
| Pinned summary | Scroll ≥ 120 px, any page, any filter | 56 px bar pinned directly beneath the top navigation. Address on the left; price, $/sq ft, beds, baths, size, lot and closest neighbour on the right. |
| Absent | Neighbourhood has no pinned property | The whole comparison apparatus is suppressed: no deltas, no `Why it may differ`, no similarity sort. The list falls back to the plain catalogue with an inline prompt to pin a target. |

### Rules

- The target is **never** a member of the paginated result set. It comes from a
  separate payload (`meta.target`) so it survives pagination, `sale_status`
  filtering, and every sort order. This is the P0 fix; it cannot be implemented
  by filtering the current response client-side, because the target may not be on
  the current page. The full response contract is specified in
  `component-spec.md` §10 and needs to be agreed with the application agent
  before this screen can be built.
- The transition between full panel and pinned summary is a 160 ms opacity and
  `translateY(-4px)` crossfade. It respects `prefers-reduced-motion: reduce`,
  which swaps directly with no transition.
- The pinned summary is `position: sticky; top: 64px` (below the app bar) with
  `z-index` above the rows. It is `surface-container-lowest` at 92 % opacity with
  a 20 px `backdrop-filter` blur per the Glass rule in `DESIGN.md`; the static
  export in `page-2-or-scrolled.png` renders it as flat `primary-container`
  because blur does not survive image capture.
- Below 768 px the baseline panel does **not** stick. It scrolls away with the
  header. Sticking it would cost roughly a quarter of the viewport on a 390 px
  screen. Instead each comparable card restates the deltas in full, so no card
  requires the baseline to be on screen to be understood.
- **The target cannot be changed from this screen.** The baseline panel is a
  readout only; there is no `Change target` control and no write path. Pinning
  stays wherever it happens today, which keeps this screen single-purpose and
  removes any risk of a mis-tap silently re-baselining every comparison on the
  page.

## 2. Sorting

Options, in menu order:

1. **Most similar to target** — default
2. Largest price gap
3. Smallest price gap
4. Price high → low
5. Price low → high
6. Newest activity
7. Oldest activity
8. Address A–Z
9. Address Z–A

Rules:

- `Most similar to target` is the default and replaces `Newest Added`, which
  described record creation order and had no relationship to comparative value.
  The scoring rule is in `component-spec.md` §6.
- The current sort is written into the URL as `?sort=similarity` and restored on
  load, matching the existing `syncToUrl` behaviour in `PropertyList.vue`. The
  default value is omitted from the query string, as it is today.
- Changing sort resets to page 1 and returns focus to the sort trigger.
- Options 1–3 require a target. When none is pinned they are removed from the
  menu rather than shown disabled.
- Sold and listed properties are always sorted and paginated as **one list**.
  Neither is excluded from the default view and neither is grouped separately;
  the status chip and the price-event label are what keep them distinguishable.
- The sort control keeps the visible `Sort` label above it on desktop and tablet.
  On mobile the label is dropped and the current value is the button text
  (`Most similar`), with the full name in `aria-label`.
- Sorting is server-side and paginated. The similarity score is computed against
  the target for the whole result set, not the current page.

## 3. Filtering

- `Status` keeps `All properties` / `Sold` / `Unsold` and stays in the URL as
  `?status=`.
- Filtering **never** removes the target baseline, even when the target itself
  would not match the active filter. If the target is excluded by the filter, the
  pinned summary gains the text `Not in current filter` beside the label, so the
  user is not misled into thinking the target matched.
- Result count text updates live: `Showing 10–14 of 14 comparables`. The count
  describes comparables and excludes the target, so the arithmetic is honest.
- Filter and sort controls do not reflow between the two breakpoint layouts; they
  are the same components at reduced size.

## 4. The comparable row

### Hover — desktop and tablet

- The whole row is one link. On hover the card lifts from
  `surface-container-lowest` to a `0 2px 8px rgba(43,52,55,.05)` ambient shadow
  over 120 ms. No border appears — the No-Line rule holds on hover.
- The address takes `primary` on hover; nothing else changes colour. Numbers must
  not shift tone, or the neutral-delta commitment is broken.
- Cursor is `pointer` across the whole row.

### Focus

- The row is a single tab stop with a visible focus ring: 2 px `primary` at 2 px
  offset, drawn outside the card so it is never clipped by the row above.
- Focus order within the page: back link → status → sort → `Dashboard` →
  `Add property` → each row in visual order →
  per-page select → pagination.
- The ring uses `outline`, not `box-shadow`, so it survives Windows High Contrast.
- Nothing relies on hover alone. There are no hover-only affordances in the row.

### Accessible name

Each row announces as one concise name, not a run-on of every metric:

> `53 Monroe Street, sold $511,000, 64,000 dollars below target, 11.1 percent below target. Property details.`

The remaining values are exposed as a description list inside the row so a screen
reader user can step through them, but they are not concatenated into the link
name. `aria-describedby` points at the `Why it may differ` group.

### Comparison meaning is text

Every comparison is readable as text with images and colour off:
`−$64,000`, `−11.1%`, `−$18/sq ft`, `+1 bed`, `−0.5 bath`, `−70 sq ft`,
`+0.10 ac`, `15 yr older`, and `Well spaced · 118 ft`.

Three redundant encodings sit on top of that text, and none of them is the only
carrier of meaning:

- The **▲ / ▼ direction glyph** is `aria-hidden`. It repeats the sign that is
  already on the number beside it, at the same tone — perceptible without
  implying that either direction is desirable.
- The **magnitude bar** is `aria-hidden`. It repeats the percentage delta.
- The **`primary` tint on a well-spaced neighbour value** is paired with the
  literal word `Well spaced`, so the threshold is never colour-only.

### Closest neighbour

- More distance is better. The threshold is a **fixed 100 ft constant**
  (`NEIGHBOR_GOOD_FT`), applied identically in every neighbourhood — it is not
  derived from the spread of the result set, so the reading means the same thing
  on every screen and does not shift as properties are added. This is the one measure on
  the screen with a genuine good direction, so it is the one place `primary` is
  used on a comparison value. `error` is not used — a close neighbour is a
  characteristic, not a failure.
- The cell reads: distance, then `Well spaced` or `Close`. The word carries the
  judgement; the colour only reinforces it.
- **No delta from the target is shown.** Every other measure on the row is
  relative — this one is absolute. 118 ft is well spaced regardless of what the
  target sits at, and pairing it with a `+22 ft` would suggest the target is the
  yardstick when the 100 ft threshold is. The target's own 96 ft still appears in
  the baseline panel and the pinned summary as a fact about the target.
- The whole column is hidden when **no** property in the result set has a value.
  When some do, rows without one read `Not surveyed` in `outline-variant` and
  contribute no delta and no explanatory chip — they never render a bare `—`.
- Distances always display in feet. See `component-spec.md` §7.

`−` is U+2212 MINUS SIGN, not a hyphen, so screen readers say "minus" and the
glyph aligns with the digits.

## 5. Progressive disclosure — mobile

- Each card shows the two largest differences plus `$/sq ft`, `Size`, and the
  conditional `Neighbor` tile.
- `All details` expands the card in place to reveal the remaining ranked
  differences. It is a `<button aria-expanded>` with a 44 px target, not a link.
- Expanded state is not persisted between pages. Only one card needs to be open
  at a time, but opening a second does not close the first.
- Fields with no value are omitted. Nothing renders a `—` placeholder and nothing
  reserves an empty column or card section.

## 6. Add property

- Exactly one add action per breakpoint.
- Desktop and tablet: `Add property` in the page header, gradient fill.
- Mobile: the same action, abbreviated to `Add`, 44 px tall, in the page header.
- The floating action button is **removed**. It duplicated the header action and
  covered the first comparable card. If a bottom-anchored action is preferred
  later, it must sit in a bar that reserves layout height and respects
  `env(safe-area-inset-bottom)` — never floating over content.

## 7. Pagination

- Previous and next are icon-only buttons with `aria-label="Previous page"` and
  `aria-label="Next page"`. Page-number buttons carry `aria-label="Page 2"` and
  the current page carries `aria-current="page"`.
- Disabled arrows keep 30 % opacity and `aria-disabled`, matching current
  behaviour.
- Changing page scrolls to the top of the list, not the top of the document, so
  the baseline stays in view. Focus moves to the list heading, which is
  `tabindex="-1"`, and the live region announces
  `Showing 10 to 14 of 14 comparables`.
- Per-page and page state stay in the URL exactly as they do today.

## 8. Loading, empty and error

- **Loading:** the target baseline renders as soon as its payload resolves, ahead
  of the rows; it does not wait for the list. Rows show four tonal skeleton bars
  at row height, so the page does not change height when data lands.
- **No comparables, target pinned:** the baseline panel stays, and the empty state
  reads `No comparables match this filter` with a clear-filter action. The
  baseline is still useful on its own.
- **No target pinned:** see §1. The comparison layer is absent, not broken.
- **Missing `square_feet` on a comparable:** the `$/sq ft` cell is omitted for
  that row only, and the size difference is not offered as an explanatory chip.
  The row keeps its price delta.

## 9. Touch and pointer targets

- Every interactive element is at least 44 × 44 px on mobile: the add button, the
  sort trigger, `All details`, pagination buttons, and the full-card link.
- Chips are not interactive. They are static text and must not be styled to look
  tappable — no shadow, no border, no hover state.
