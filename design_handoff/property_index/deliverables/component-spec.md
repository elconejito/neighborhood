# Component spec — Property index

Values are design pixels. Tokens are the CSS custom properties already declared
in `resources/css/app.css`; no new tokens are introduced.

## 1. Tokens used

| Role | Token | Value |
| --- | --- | --- |
| Page background | `surface` | `#f8f9fa` |
| Row / card | `surface-container-lowest` | `#ffffff` |
| Fact tile, magnitude track | `surface-container-low` | `#f1f4f6` |
| Chip fill | `surface-container` | `#eaeff1` |
| Secondary button | `surface-container-high` | `#e3e9ec` |
| Select well, status chip | `surface-container-highest` | `#dbe4e7` |
| Target panel | `primary-container` | `#d6e3ff` |
| Target label, target metric labels | `on-primary-container` / `primary` | `#38527b` / `#455f88` |
| Primary text, all numerals | `on-surface` | `#2b3437` |
| Secondary text, deltas | `on-surface-variant` | `#586064` |
| Column headings | `outline` | `#737c7f` |
| Magnitude bar fill | between `outline` and `secondary` | `#7f8b9c` |
| Well-spaced neighbour value | `primary` | `#455f88` |
| Neighbour value below threshold | `on-surface` | `#2b3437` |
| Unsurveyed neighbour value | `outline-variant` | `#abb3b7` |
| Listed status chip | `tertiary-container` / `tertiary` | `#fdf2e2` / `#655e52` |
| Primary CTA | `linear-gradient(145deg, primary, primary-dim)` | `#455f88 → #39537c` |
| CTA text | `on-primary` | `#f6f7ff` |

`error` and `success` are not used anywhere in this screen.

Price and attribute differences are **neutral in valence but explicit in
direction**: a ▲ or ▼ glyph at 8 px in `on-surface-variant` precedes the
signed value, matching the delta text tone exactly. It reads as an arithmetic
sign, not a verdict. Closest-neighbour distance is the single exception — more
space is genuinely better, so it uses `primary` above the threshold per the
`DESIGN.md` trend-indicator rule. `error` is still not used: a close neighbour
is a characteristic, not a fault.

## 2. Type scale — Manrope

| Use | Size / weight / leading | Tracking |
| --- | --- | --- |
| Page title | 34 / 800 / 1.1 | `-0.025em` |
| Target address (desktop) | 21 / 800 / 1.2 | `-0.01em` |
| Comparable price (desktop) | 20 / 800 / 1.1 | `-0.015em` |
| Comparable address | 16 / 700 / 1.3 | — |
| Normalised price | 16 / 700 / 1.1 | — |
| Baseline stat value | 17 / 800 / 1 | `-0.01em` |
| Facts row (tablet) | 13 / 600 / 1 | — |
| Delta line, chips, metadata | 12 / 600 / 1.4 | — |
| Column heading, target label | 10 / 700 / 1, uppercase | `0.14em` |
| Status chip | 10 / 700 / 1, uppercase | `0.08em` |

Mobile steps the page title to 26 / 800 and the comparable address to 15 / 700.
Nothing on any breakpoint falls below 10 px, and nothing below 12 px is used for
a value the user must read — only for labels that name a value shown larger.

## 3. Radii, elevation, borders

- Cards, panels, the pinned summary: **8 px**.
- Chips, buttons, selects, fact tiles, pagination, status chips: **4 px**.
- No 1px sectioning borders anywhere. Row separation is a 10 px gap plus the tone
  step from `surface` to `surface-container-lowest`.
- Row hover: `0 2px 8px rgba(43,52,55,.05)`.
- Pinned summary: `0 6px 24px rgba(43,52,55,.07)`.
- Focus: `outline: 2px solid var(--color-primary); outline-offset: 2px`.

## 4. Desktop — ≥ 1024 px

- Page gutter 44 px (`spacing-8`), content `max-width: 1280px`, centred.
- Row grid: `minmax(0,1fr) 200px 150px 132px 300px`, `gap: 20px`, padding
  `14px 24px`.
  Column headings sit on the same grid with the same 24 px inset so headings and
  values align exactly.
- Row height ≈ 88 px including the 10 px gap. Six to seven rows are visible in a
  1000 px viewport with the full baseline panel showing, and eight once the panel
  collapses to the pinned summary.
- Cell contents:
  - **Property** — address, then a row of `status chip` + activity date.
  - **Price · vs target** — right-aligned. Price, then `−$51,000 · −8.9%`, then
    the magnitude bar.
  - **$/sq ft · vs target** — right-aligned. `$181`, then `▼ −$25/sq ft`.
  - **Closest neighbor** — right-aligned. Distance in feet, then `Well spaced`
    or `Close`. Unsurveyed rows read `Not surveyed` over `No survey data` in
    `outline-variant`.
  - **Why it may differ** — up to three chips, wrapping, 6 px gap.
- Baseline panel: stats are right-aligned in a wrapping 26 px-gap row, with each
  stat label above its value. It is a read-only baseline; there is no
  `Change target` control or internal divider.

### Magnitude bar

- Total width equals the price column (200 px); height 5 px; radius 3 px.
- Track `surface-container-low`; centre tick 1 × 9 px in `outline-variant`.
- Fill grows left of the tick when below target, right when above.
- Scale is fixed at ±25 % of target price, clamped at 100 %. Fixed rather than
  relative to the visible page so bars stay comparable across pages and sorts.
- `aria-hidden="true"`. It is a redundant encoding of the numbers beside it.

## 5. Tablet — 768–1023 px

- Page gutter 32 px. **The 12-column row is not used at any width below 1024 px.**
- Two-line row, padding `14px 20px`, 9 px between lines.
  - **Line 1** — left: address, then `status chip` + date. Right: price, then
    `−$51,000 · −8.9% vs target`.
  - **Line 2** — left: `4 bd · 3 ba · 2,888 sq ft · 0.45 ac · $181/sq ft −$25/sq ft · well spaced · 118 ft to neighbor`,
    with the neighbour clause taking `primary` above the threshold.
    Right: up to three chips, `white-space: nowrap`.
- The address column may wrap freely; the price block is `flex-shrink: 0` and
  keeps its content width. Facts and chips are separate flex children with a
  20 px minimum gap, so they can never overlap — the tablet defect was caused by
  fractional grid columns narrower than their content.
- Baseline panel becomes two lines: address and price on line one, the stat run
  as a single `·`-separated wrapping row on line two.
- Row height ≈ 105 px.

## 6. Mobile — < 768 px

- Page gutter **18 px** (was 40 px), app bar 56 px, header actions 44 px.
- Card padding `14px 16px`, 11 px between blocks, 10 px between cards.
- Card structure:
  1. Header — address (15/700) left, price (18/800) right.
  2. Sub-header — `Sold · Sep 19, 2024` left, `−$51,000 · −8.9%` right.
  3. Caption `Compared with target` (9 px, uppercase,
     `outline`), then three fact tiles, `repeat(3, 1fr)`, 7 px gap,
     `surface-container-low`, 4 px radius, `padding: 8px 9px`:
     `$/SQ FT` → `$181` → `▼ −$25`; `SQ FT` → `2,888` → `+96`;
     `NEIGHBOR` → `118 ft` → `Well spaced`. Each tile is ≈ 102 px wide at
     390 px and ≈ 82 px at 320 px; the caption is what lets the sub-values stay
     this short.
  4. Chips row — the two largest differences, plus `All details` right-aligned.
- Card height ≈ 165 px, against roughly 280 px today, while showing strictly more
  comparative information.
- No floating action button. One `Add` action in the header.
- All targets ≥ 44 px.

## 7. Delta formatting

| Value | Format | Example |
| --- | --- | --- |
| Price delta | signed, whole dollars, thousands separated | `−$64,000` |
| Percentage delta | signed, one decimal | `−11.1%` |
| $/sq ft | whole dollars | `$188` |
| $/sq ft delta | signed whole dollars + `/sq ft` | `−$18/sq ft` |
| $/sq ft delta under $1 | literal | `same as target` |
| Beds | signed integer + `bed`/`beds` | `+1 bed` |
| Baths | signed, `.5` precision | `−0.5 bath` |
| Square feet | signed, thousands separated | `−974 sq ft` |
| Acreage | signed, two decimals | `+0.10 ac` |
| Year built | unsigned magnitude + `newer`/`older` | `15 yr older` |
| Closest neighbour | whole feet, unit forced to `ft` | `118 ft` |
| Closest-neighbour reading | `Well spaced` at ≥ 100 ft, else `Close` | `Well spaced` |
| Threshold | fixed constant, product-wide, not per neighbourhood | `NEIGHBOR_GOOD_FT = 100` |
| Unsurveyed neighbour | `Not surveyed` over `No survey data` | — |

Closest-neighbour distance is the one measure **not** expressed as a delta from
the target. It is judged against an absolute threshold, so a signed difference
from the target's 96 ft would invite the wrong comparison — 118 ft is well spaced
whatever the target happens to be. The target's own distance still appears in the
baseline panel and the pinned summary, as a fact rather than a reference point.
| Exact match on an attribute | omitted entirely — never `0` or `≈` | — |

- The minus sign is U+2212, not a hyphen. The direction glyphs are U+25B2 and
  U+25BC at 8 px, `vertical-align: 1px`, `aria-hidden` — the signed number
  immediately after them is the accessible source of truth.
- Closest-neighbour distance always renders in **feet**. `formatRelativeDistance`
  must be called as `formatRelativeDistance(meters, 'ft')`; its automatic mode
  switches to yards above 150 ft, which would put `126 ft` and `60 yd` in the
  same column and make the values incomparable.
- Percentages are always relative to the target price, never to the neighbourhood
  mean.
- Sold and listed prices are labelled by the status chip and are never described
  with the same verb. A listed comparable's delta is captioned
  `vs target (asking)` in the expanded details so an asking price is not silently
  equated with a sale.

## 8. Similarity score

Sum of normalised absolute differences; lower is more similar. Ties break on
most recent activity.

```
score = |Δbeds|/2 + |Δbaths|/1.5 + |Δsqft|/1200 + |Δacres|/0.30 + |Δyear|/20
```

The same normalised terms rank the explanatory chips: the two or three largest
non-zero terms become the `Why it may differ` chips, in descending order. This is
why one row leads with `+0.09 ac` and another with `−974 sq ft` — the chip order
is the contribution order, not a fixed field order.

Attributes that are null on either property are excluded from the difference
terms and chips, then penalised at 0.25 per absent axis. The available terms are
normalised back to a five-axis scale; rows with fewer than three comparable axes
sort after rows with sufficient data. Missing data therefore cannot earn an
artificially favorable rank.

The normalisers are a first pass, not a valuation model. See open question 3 in
`README.md`.

## 9. Component changes implied

| File | Change |
| --- | --- |
| `PropertyList.vue` | Render the target from `meta.target` rather than finding `is_pinned` in `data`. Add the sticky summary. Add `similarity` to `sortOptions` and make it the default. Remove the mobile FAB. Change page gutters to 44/32/18. Add shared column headings. |
| `PropertyListItem.vue` | Three layouts (desktop grid, tablet two-line, mobile card) instead of one grid that collapses. Compute target deltas, retain the conditional Neighbor cell, and emit a concise accessible name. |
| `ComparisonIndicator.vue` | Retired. Replaced by a `DifferenceChip` that renders signed text. Keep the file only if other views consume it — the property index no longer does. |
| `ComparisonIndicator.vue` (2) | If retained for other views, add a `value` prop so it can render signed text with the direction glyph rather than a bare arrow. |
| `PropertyTransformer.php` | Expose `price_per_square_foot` and `closest_neighbor_distance_meters` as top-level fields so the row does not have to dig into the `analysis` blob. |
| `PropertyController.php` | Return the pinned target outside the paginated set as `meta.target`; support `orderBy=similarity` and target-relative `orderBy=price_gap`. |

## 10. API contract for target persistence (P0)

This is the one required change that cannot be made in the view layer, and it is
what the whole screen rests on. Filtering `data` for `is_pinned` client-side
cannot work, because the target may not be on the page that was fetched.

`GET /api/v1/neighborhoods/{neighborhood}/properties` should return the pinned
target **in addition to**, and independently of, the paginated collection:

```jsonc
{
  "data": [ /* comparables only — the target is never a member */ ],
  "meta": {
    "pagination": { "total": 14, "current_page": 2, "total_pages": 2, /* … */ },
    "target": {
      "id": 1,
      "address": "1347 Edwin Miller Boulevard",
      "city": "Martinsburg",
      "state": "WV",
      "market_price": 575000,
      "market_activity_date": "2024-09-15",
      "price_event_type": "sold",
      "price_per_square_foot": 205.94,
      "bedrooms": 3,
      "bathrooms": 3.0,
      "square_feet": 2792,
      "acreage": 0.36,
      "year_built": 2004,
      "closest_neighbor_distance_meters": 29.3,
      "matches_current_filter": true
    }
  }
}
```

Requirements:

- `meta.target` is **not** affected by `page`, `per_page`, `sale_status`,
  `orderBy` or `sortedBy`. It is resolved from
  `Property::where('neighborhood_id', …)->where('is_pinned', true)` before the
  paginated query runs.
- The target is **excluded from `data`** and from `meta.pagination.total`, so
  the count the user reads (`14 comparables`) is the count of things they can
  actually compare. This changes the existing total by one and needs a matching
  test update.
- `matches_current_filter` drives the `Not in current filter` note in the pinned
  summary, so the user is never misled about why the target is still on screen.
- `meta.target` is `null` when nothing is pinned. The client suppresses the whole
  comparison layer — deltas, `Why it may differ` and the similarity sort options —
  rather than rendering empty ones. The closest-neighbour column is the exception:
  it is threshold-based rather than target-relative, so it survives with no target
  pinned.
- There is no write path from this screen. The target is chosen elsewhere; the
  index only reads it.
- `price_per_square_foot` is returned as an unrounded float; rounding is a
  presentation decision and is specified in §7.
- Deltas stay client-side. They are pure functions of `meta.target` and each
  row, so no per-row server computation is needed and the payload does not grow.
- The similarity sort, however, must be **server-side** (`orderBy=similarity`),
  because ordering has to be applied across the full result set before
  pagination, not to the ten rows already fetched.

## 11. Breakpoint coverage

The four deliverable artboards are drawn at 1440, 834 and 390 px. The layout that
each of the required widths resolves to:

| Width | Layout | Notes |
| --- | --- | --- |
| 320, 375, 390 | Mobile card | Address wraps; the three fact tiles stay `repeat(3, 1fr)` down to 320 px (≈ 82 px of content each, which the short sub-values are sized for). Chips wrap to a second line; `All details` moves below them under 340 px. |
| 768, 834 | Two-line row | Facts and chips are separate flex children with a hard 20 px gap; both keep content width, so the tablet collision cannot recur. |
| 1024 | Column grid, narrow | Address column reaches its `minmax(0,1fr)` floor at ≈ 160 px and wraps to two lines. The four fixed columns are unchanged. Below 1024 px the grid is abandoned, not squeezed. |
| 1440 | Column grid | As drawn. |

Verify at implementation time by resizing rather than by the static exports: the
tablet and mobile layouts are specified as flex rows with non-shrinking metric
blocks, which is what makes them safe, and that behaviour is only observable in a
live browser.
