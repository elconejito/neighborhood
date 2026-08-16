# Design System Specification: Neighborhood

## 1. Overview & Creative North Star
**Creative North Star: The Private Ledger**
This design system rejects the "utility-first" aesthetic of typical financial trackers in favor of a high-end editorial experience. It is designed to feel like a bespoke property portfolio—a digital archive that balances the authority of a private bank with the warmth of a luxury architectural magazine.

The visual language is defined by **Soft Minimalism**. We break the traditional "grid-of-boxes" template by utilizing intentional asymmetry, expansive whitespace, and a sophisticated layering of surfaces. By stripping away structural lines (borders) and relying on tonal depth, the UI feels breathable, premium, and deeply personal.

---

## 2. Colors & Surface Philosophy
The palette moves away from clinical grays toward muted warm neutrals, providing a "hearth-like" soul to the data. Deep blues replace the standard "success green" to maintain a monochromatic, high-trust atmosphere.

### Surface Hierarchy & The "No-Line" Rule
To achieve a signature premium feel, **1px solid borders are strictly prohibited for sectioning.** Boundaries must be defined through background color shifts or elevation.
- **Base Layer:** Use `surface` (`#f8f9fa`) for the global background.
- **Sectioning:** Use `surface-container-low` (`#f1f4f6`) to define large content areas or sidebars.
- **Nesting:** Place `surface-container-lowest` (`#ffffff`) cards on top of `surface-container-low` sections to create a soft, natural lift.

### The Glass & Gradient Rule
To move beyond a flat, "out-of-the-box" Material look:
- **Floating Elements:** Use `surface-container-lowest` with an 80% opacity and a `20px` backdrop-blur for navigation bars or floating action panels.
- **Signature CTAs:** Primary actions should not be flat. Apply a subtle linear gradient from `primary` (`#455f88`) to `primary_dim` (`#39537c`) at a 145-degree angle to add "soul" and tactile depth.

---

## 3. Typography: The Manrope Scale
We use **Manrope** for its balance of geometric precision and organic warmth. The hierarchy is designed to feel editorial, using large display sizes for financial totals to create a sense of scale and importance.

- **Display (Large/Medium):** Reserved for portfolio totals and equity values. Use `letter-spacing: -0.02em` to create a tighter, custom-type feel.
- **Headlines:** Use `headline-sm` (`1.5rem`) for property names. This provides a clear anchor for each content block.
- **Data Points:** Use `title-md` for secondary metrics (e.g., "Yield: 4.2%"). 
- **Labels:** `label-md` and `label-sm` should always be in `on_surface_variant` (`#586064`) to ensure they recede, allowing the primary data to shine.

---

## 4. Elevation & Depth
In this system, depth is a functional tool, not a decoration. We mimic the behavior of light hitting fine paper.

- **The Layering Principle:** Instead of shadows, stack `surface-container` tiers. A `surface-container-high` element sitting on a `surface` background provides enough contrast to signify hierarchy without visual "noise."
- **Ambient Shadows:** Where a floating effect is required (e.g., a property detail modal), use a "Long Shadow": 
  - `box-shadow: 0 12px 40px rgba(43, 52, 55, 0.05);` 
  - The shadow color is a low-opacity version of `on_surface` to keep it natural.
- **The Ghost Border:** If a boundary is required for accessibility (e.g., an input field), use the `outline_variant` at **15% opacity**. Never use a 100% opaque border.

---

## 5. Components & UI Patterns

### Buttons
- **Primary:** `4px` radius. Gradient fill (Primary to Primary Dim). Text: `on_primary`. 
- **Secondary:** Surface-container-highest fill with `on_surface` text. No border.
- **Tertiary/Ghost:** No background. Use `primary` for text color.

### Cards & Property Lists
- **Forbid Dividers:** Do not use lines to separate property list items. Use `spacing-5` (`1.7rem`) to create a clear "gutter" between items.
- **The "Hero" Card:** For the main portfolio summary, use a `primary_container` (`#d6e3ff`) background to provide a soft wash of color that highlights the most important data.

### Input Fields & Controls
- **Fields:** Use `surface_container_highest` (`#dbe4e7`) for the input well. This creates a "recessed" look rather than a floating box.
- **States:** On focus, transition the background to `surface_container_lowest` and add a `1px` Ghost Border using `primary`.

### Specialized Real Estate Components
- **Equity Progress Bar:** Instead of a standard bar, use a thick `primary` line against a `surface_container_high` track. 
- **Trend Indicators:** All "growth" indicators (appreciation, rent increases) should use `primary` (Deep Blue), not green. Negative trends use `error` (`#9f403d`).

---

## 6. Do's and Don'ts

### Do
- **Do** use `spacing-8` (`2.75rem`) for page margins to allow the layout to "breathe" like a high-end magazine.
- **Do** use `surface-dim` for inactive states to maintain the warm, muted aesthetic.
- **Do** overlap elements slightly (e.g., a small floating data chip overlapping the corner of a property image) to break the rigid grid.

### Don't
- **Don't** use pure black (`#000000`) for text. Always use `on_surface` (`#2b3437`) to maintain the sophisticated, softened contrast.
- **Don't** use standard "Success Green." This system relies on the Deep Blue (`primary`) to convey positive momentum.
- **Don't** use sharp corners. Every container, including images, must adhere to the `4px` subtle rounding scale.
