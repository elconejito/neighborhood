# Property Index Design Deliverables

Status: Revision 4 — implemented and visually verified.
Date: August 15, 2026

## Contents

| File | What it is |
| --- | --- |
| `desktop.png` | Primary desktop state, 1440 × 1000 design px (captured at 2×) |
| `tablet.png` | Primary tablet state, 834 × 1112 design px (captured at 2×) |
| `mobile.png` | Primary mobile state, 390 × 844 design px (captured at 2×) |
| `page-2-or-scrolled.png` | Page two, scrolled, with the persistent target baseline pinned |
| `interaction-notes.md` | Sorting, filtering, sticky behaviour, focus, hover, disclosure, keyboard, screen-reader |
| `component-spec.md` | Spacing, type, tokens, delta formatting, similarity scoring, responsive rules |
| `source/Property Index Redesign.dc.html` | Live, interactive prototype of all four states — open in any browser |
| `source/Current State.dc.html` | Pixel recreation of today's build, used as the before-state baseline |
| `source/support.js` | Runtime the two prototypes load. Keep it beside them or they open blank. |

Implementation evidence is stored in the sibling `../implementation_review/`
folder. Those screenshots show the production Vue implementation rather than
the design prototype.

## Design direction — "Baseline & Difference"

The current screen presents the target as the first row of a list. The redesign
promotes it to the **baseline of the page**: a stated reference that everything
else is measured against, and which never leaves the viewport.

Every comparable then answers the three questions in the brief's order, left to
right, once per row:

1. **How much more or less did it cost?** Price, then signed absolute and
   percentage delta, then a neutral magnitude bar centred on the target so gaps
   can be ranked by eye without reading numbers.
2. **Is the gap still there after normalising?** Price per square foot and its
   signed delta, sitting immediately beside the raw price so the two can be read
   as one thought — `$451,000 · −21.6%` next to `$248/sq ft · +$42/sq ft` tells
   the whole story of a small, expensive house.
3. **Why might it differ?** The two or three largest measured differences as
   neutral quantified chips: `+1 bed`, `−0.5 bath`, `−974 sq ft`, `+0.43 ac`,
   `15 yr older`.

The per-row micro-labels became shared column headings. `Closest neighbor` is
retained when the result set contains survey data, using the approved fixed
100 ft threshold and no target-relative delta. Direction-only arrows are gone —
the signed values carry both direction and magnitude, as text.

This stays inside **The Private Ledger**. Manrope throughout; `surface` page,
white cards, `primary-container` for the target hero card; no 1px sectioning
rules anywhere — separation is spacing and tone only; the 4px rounding scale;
the 145° `primary → primary_dim` gradient on the single primary CTA; deep blue
rather than success green.

## What each finding got

| Priority | Finding | Response in this proposal |
| --- | --- | --- |
| P0 | Target disappears after page one / under filtering | The target is rendered from a payload returned outside the paginated, filtered, sorted result set. Full panel above the list; after ~120 px of scroll it collapses into a 56 px pinned summary carrying price, $/sq ft, beds, baths, size and lot. See `page-2-or-scrolled.png`. |
| P0 | Tablet columns overlap at 834 px | Below 1024 px the 12-column row is abandoned entirely for a two-line row. Line one: address, status, activity date, price, price delta. Line two: measured facts and normalised price on the left, explanatory chips on the right. Nothing is compressed below its content width. |
| P1 | Price has no target delta | `−$51,000 · −8.9%` under every price on every breakpoint, plus the magnitude bar on desktop. |
| P1 | Arrows show direction, not magnitude | `ComparisonIndicator` is retired. Signed quantified chips replace it. |
| P1 | No normalised price | `$/sq ft` is a first-class column on desktop, an inline value on tablet, and one of the three fact tiles on mobile — always with its signed delta. Rounded to the dollar; differences under $1 read `same as target` rather than a misleading `−$0`. |
| P1 | Mobile add actions compete | The floating action button is deleted. One 44 px `Add` button sits in the page header. Nothing overlaps the list. |
| P2 | Empty Neighbor data occupies space | Kept as a real column, but only rendered when at least one property in the result set has a value. Closest-neighbour distance shows a value and `Well spaced` / `Close` reading against the fixed 100 ft threshold, with no target-relative delta. Rows with no survey read `Not surveyed`. |
| P2 | Target status relies on tint and position | Explicit `TARGET PROPERTY` label plus a `Baseline for every comparison` tag, and the full baseline restated as text: price, $/sq ft, beds, baths, size, lot, year. |
| P2 | Default sort is Newest Added | Default is now `Most similar to target`. The scoring rule is written out in `component-spec.md`. In the mock, `159 Monroe Street` sorts first and `183 Monroe Street` last, which is what the rule produces on this data. |

## Deviations from the sources, and why

- **Direction is encoded, valence is not.** Deltas carry a neutral direction
  marker — a small ▲ or ▼ in `on-surface-variant`, the same tone as the
  number beside it — so "greater than" and "less than" are perceptible at a
  glance without asserting that either is good. Colour is not used: no green, no
  red, and no `primary`/`error` on price or attribute differences. The desktop
  magnitude bar encodes the same direction positionally. This is a deliberate
  departure from the `DESIGN.md` trend-indicator rule, which is written for
  metrics that genuinely have a good direction (appreciation, rent growth).
- **The one exception is closest-neighbour distance,** which does have a good
  direction: more space is better, and 100 ft is the threshold. It therefore
  follows `DESIGN.md` properly — `primary` for well spaced, neutral
  `on-surface` below the threshold, never `error`, since a close neighbour is
  a characteristic rather than a fault. The reading is also given as text
  (`Well spaced` / `Close`) so it does not depend on colour.
- **Corner radius: resolved.** The `DESIGN.md` 4px scale is authoritative —
  8px on cards and panels, 4px on chips, buttons, selects and pagination. The
  shipped Tailwind `rounded-xl` (12px) is treated as drift to be corrected in
  sibling views over time, not a precedent to follow.
- **The magnitude bar is new.** It is not in `DESIGN.md`. It uses the
  `surface-container-low` track / `outline`-family fill already in the system and
  carries no colour semantics — it is a redundant encoding of numbers that are
  already present as text, added because "rank the gaps quickly" is the stated
  user goal. It can be dropped without loss of required information.

## Assumptions

- **Data.** Fifteen properties, one pinned target, matching the captured
  evidence. Three page-one comparables and all `year_built` values were not
  legible in the screenshots and were synthesised to match `PropertySeeder`'s
  distributions (`$450k–$650k`, `1985–2015`, specs banded by price). Numbers in
  the mocks are illustrative; the layout does not depend on them.
- **Two comparables are shown as `Listed` rather than `Sold`** so that the
  price-event labelling can be seen. The seeder currently produces sold cycles
  only, so this state does not occur in the captured data.
- **`year_built` participates in the similarity score and in the explanatory
  chips.** It is already on `Property` and in `PropertyTransformer`, so no new
  field is needed.
- **Price per square foot is returned by the API** and has a client-side fallback
  to `market_price / square_feet`. When either value is unavailable, the
  normalised comparison is omitted.
- **The target's comparison payload is implemented** as `meta.target`, independent
  of page, status filter and sort. It also reports `matches_current_filter`.
- **`Closest Neighbor` remains available** on both the index and detail screen.

## Open questions

None outstanding. All seven questions raised during review have been answered and
are recorded as decisions below.

## Decisions

| # | Question | Decision |
| --- | --- | --- |
| 1 | Delta colour | Neutral. No green, red, `primary` or `error` on price or attribute differences. Direction is carried by a ▲ / ▼ glyph in the same tone as the number, plus the sign on the value itself. |
| 2 | Corner radius | `DESIGN.md` 4px scale is authoritative: 8px cards and panels, 4px chips, buttons, selects, pagination. The shipped Tailwind `rounded-xl` is drift to correct. |
| 3 | `Closest neighbor` column | Kept, as a real comparison. More distance is better. |
| 4 | Neighbour threshold | Fixed constant, `NEIGHBOR_GOOD_FT = 100`. Product-wide, never derived per neighbourhood. |
| 5 | Neighbour display | Distance in feet plus `Well spaced` or `Close`. **No delta from the target** — the reading is absolute, not comparative. |
| 6 | Neighbour units | Feet, always. `formatRelativeDistance(meters, 'ft')`; never the automatic mode, which switches to yards above 150 ft. |
| 7 | Similarity weighting | Fixed constants: 2 beds, 1.5 baths, 1,200 sq ft, 0.3 ac, 20 yr. Not tuned per neighbourhood. |
| 8 | Sold vs. listed | One list for all properties. Both are shown together, distinguished by the status chip and by price-event labelling; neither is excluded or grouped separately. |
| 9 | `Change target` | Removed. The target is not changeable from this screen; pinning stays where it is today. |
| 10 | Magnitude bar | Kept. |

## Revision notes

- **2026-08-15 — revision 4, implementation reconciliation.** Production now
  returns the target outside pagination, excludes it from comparable totals,
  exposes $/sq ft and neighbour distance, and supports full-result similarity
  and price-gap sorting. Missing similarity data receives a penalty and rows
  with fewer than three comparable axes sort last. The responsive Vue layouts,
  compact mobile status/sort controls, single add action, sticky target summary,
  event labels, pagination focus, and target-absent states are implemented.

- **2026-08-11 — revision 3, after second review.** All remaining questions
  answered; see **Decisions** above.
  - Similarity normalisers confirmed as fixed constants.
  - Sold and listed properties stay in one list.
  - `Change target` removed from the baseline panel, along with its divider —
    the panel is now purely a readout.
  - Closest-neighbour cell reduced to distance plus `Well spaced` / `Close`.
    The signed delta from the target is gone: unlike price or size, this measure
    is judged against an absolute threshold, not against the target, so a delta
    invited the wrong comparison. The mobile caption became
    `Compared with target`, which stays true of all three tiles.
  - Magnitude bar kept.
- **2026-08-11 — revision 2, after review.**
  - Added a neutral direction marker (▲ / ▼) to every price and $/sq ft
    delta on all breakpoints, so "greater" and "lesser" register without colour.
  - **Reinstated `Closest neighbor` as a first-class column**, now a real
    measurement rather than a dash: distance in feet and a `Well spaced` /
    `Close` reading against the 100 ft threshold.
    Added to the baseline panel and the pinned summary. `primary` is used for
    well-spaced values — the one place in this screen where a value genuinely
    has a good direction. One row is deliberately shown as `Not surveyed` to
    demonstrate missing-value handling. Distances in the mocks are illustrative.
  - Corner radius confirmed at the `DESIGN.md` 4px scale; open question closed.
  - Closest-neighbour threshold confirmed as a fixed 100 ft constant, not derived
    per neighbourhood; open question closed.
  - Target-persistence API contract written up explicitly in
    `component-spec.md` §10.
  - Mobile fact tiles went from two to three to carry the neighbour value, with a
    `Value · then difference from target` caption so the compact deltas stay
    unambiguous.
- **2026-08-11 — initial proposal.** Recreated the current build from
  `PropertyList.vue`, `PropertyListItem.vue`, `ComparisonIndicator.vue`,
  `Navigation.vue` and `resources/css/app.css` as a before-state baseline, then
  produced the four required states, interaction notes and component spec. No
  production files touched.

## Note on file location

This folder is the `design_handoff/property_index/deliverables/` payload. Unzip it
over that path in the repository — the structure and filenames match the brief
exactly, so nothing needs renaming. `screenshots/` is not included and was not
modified.
