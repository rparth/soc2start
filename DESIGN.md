---
name: SOC2Start.io
description: Compliance that feels like competence, not compliance.
version: 2.0.0
colors:
  # Brand
  navy-dark: "#0D2137"
  navy: "#1A3D5E"
  navy-mid: "#2D5A8A"
  navy-light: "#3A7BC8"
  emerald: "#27AE60"
  emerald-light: "#34D278"
  emerald-pale: "#E8F8EF"
  # Neutral
  slate: "#7A8FA3"
  slate-light: "#B8C4CE"
  surface: "#F5F7FA"
  surface-raised: "#FFFFFF"
  border: "#E8ECF0"
  # Semantic
  danger: "#E74C3C"
  danger-light: "#FF6B6B"
  info: "#3498DB"
  info-light: "#52A9FF"
  warning: "#F39C12"
  warning-light: "#F5B041"
  # Dark mode overrides
  dark:
    surface: "#0A1929"
    surface-raised: "#0D2137"
    surface-elevated: "#132D4A"
    surface-overlay: "#1A3D5E"
    text-primary: "#E8ECF0"
    text-secondary: "#7A8FA3"
    text-tertiary: "#5A6F82"
    border: "rgba(232, 236, 240, 0.1)"
typography:
  display:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "3rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-1.6px"
  headline:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.33
    letterSpacing: "-0.5px"
  title:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "-0.4px"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
    letterSpacing: "0"
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.33
    letterSpacing: "0"
  mono:
    fontFamily: "JetBrains Mono, Fira Code, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
  3xl: "64px"
motion:
  duration:
    instant: "0ms"
    fast: "100ms"
    normal: "150ms"
    relaxed: "200ms"
    slow: "300ms"
    deliberate: "400ms"
  easing:
    default: "cubic-bezier(0.25, 1, 0.5, 1)"
    enter: "cubic-bezier(0.16, 1, 0.3, 1)"
    exit: "cubic-bezier(0.4, 0, 1, 1)"
    spring: "cubic-bezier(0.34, 1.56, 0.64, 1)"
elevation:
  z-base: 0
  z-dropdown: 10
  z-sticky: 20
  z-overlay: 30
  z-modal: 40
  z-toast: 50
components:
  button-primary:
    backgroundColor: "{colors.emerald}"
    textColor: "#ffffff"
    rounded: "{rounded.lg}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.emerald-light}"
  button-secondary:
    backgroundColor: "#ffffff"
    textColor: "{colors.navy-dark}"
    rounded: "{rounded.lg}"
    padding: "12px 24px"
  button-secondary-hover:
    backgroundColor: "{colors.navy-dark}"
    textColor: "#ffffff"
  card-default:
    backgroundColor: "#ffffff"
    rounded: "{rounded.lg}"
    padding: "24px"
  input-bordered:
    backgroundColor: "#ffffff"
    textColor: "{colors.navy-dark}"
    rounded: "{rounded.md}"
    padding: "6px 12px"
  badge-sm:
    rounded: "{rounded.pill}"
    padding: "5px 14px"
---

# Design System: SOC2Start.io v2.0

## 1. Overview

**Creative North Star: "The Assured Advisor"**

SOC2Start.io looks like the tool a seasoned CISO would build for themselves: clean, dense where it matters, spacious where decisions happen. It carries authority through restraint, not ornamentation. The navy-and-emerald palette grounds every screen in professional confidence without drifting into the cold grey monotony of legacy GRC tools.

The system prioritizes scanability over decoration. Tables, lists, and status indicators are information-dense. Forms, approvals, and signing flows breathe. Every transition is purposeful; nothing moves for the sake of movement.

This is not a startup dashboard trying to look fun. It is not an enterprise tool resigned to looking ugly. It sits in the narrow band of "clearly well-made" that earns trust from compliance professionals who've seen too many tools that look either cheap or overproduced.

**Key Characteristics:**
- Navy anchors identity; emerald signals action and success
- Light mode is the default working mode; dark mode is a fully-designed companion, not an afterthought
- Tight negative letter-spacing on headings for density and authority
- Consistent 12px corner radius on interactive surfaces
- Flat surfaces at rest; elevation earned through interaction
- Motion is functional — ease-out-quart curves, 150-200ms durations, reduced-motion respected

**Design Principles (ranked):**
1. **Clarity over cleverness.** Every element earns its place. If removing it doesn't hurt comprehension, remove it.
2. **Density where scanning, space where deciding.** Data tables pack tight. Approval forms breathe.
3. **Consistency is trust.** A CISO who clicks 30 pages should never wonder "did I switch products?"
4. **Accessible by default.** WCAG AA minimum (4.5:1 text, 3:1 non-text). Focus rings always visible on keyboard navigation.
5. **Performance is respect.** Skeleton screens, not spinners. Lazy loading, not blocking. Sub-300ms transitions.

## 2. Color System

A restrained palette with committed accents. Navy dark is the identity anchor; emerald is the action color. Everything else supports without competing.

### 2.1 Brand Colors

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `navy-dark` | `#0D2137` | `#0D2137` | Brand identity, primary text, secondary button fills, header backgrounds |
| `navy` | `#1A3D5E` | `#1A3D5E` | Hover state for navy-dark surfaces, shield logo gradient |
| `navy-mid` | `#2D5A8A` | `#2D5A8A` | Pressed/active state, tertiary depth in the navy family |
| `navy-light` | `#3A7BC8` | `#3A7BC8` | Links on dark backgrounds, informational accents |
| `emerald` | `#27AE60` | `#27AE60` | Primary buttons, success states, active borders, accent text |
| `emerald-light` | `#34D278` | `#34D278` | Hover/active for emerald, dark-mode accent text |
| `emerald-pale` | `#E8F8EF` | `rgba(39,174,96,0.12)` | Success backgrounds, active item tints |

### 2.2 Surface & Neutral Colors

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `level-0` | `#F5F7FA` | `#0A1929` | Page background (root surface) |
| `level-1` | `#FFFFFF` | `#0D2137` | Cards, modals, sidebar |
| `level-2` | `#FFFFFF` | `#132D4A` | Elevated surfaces (popovers, dropdowns) |
| `level-3` | `#0D2137` | `#1A3D5E` | Dialog overlays, inverted surfaces |

### 2.3 Text Colors

| Token | Light Mode | Dark Mode | Min Contrast | Usage |
|-------|-----------|-----------|-------------|-------|
| `txt-primary` | `#0D2137` | `#E8ECF0` | 7:1 on level-1 | Headings, body text, primary labels |
| `txt-secondary` | `#7A8FA3` | `#7A8FA3` | 4.5:1 on level-1 | Descriptions, help text, metadata |
| `txt-tertiary` | `#7A8FA3` | `#5A6F82` | 3:1 on level-1 | Placeholders, disabled text, timestamps |
| `txt-quaternary` | `#B8C4CE` | `#3A4F62` | 3:1 on level-0 | Very subtle text, watermarks |
| `txt-accent` | `#27AE60` | `#34D278` | 4.5:1 on level-1 | Accent links, success indicators |
| `txt-danger` | `#E74C3C` | `#FF6B6B` | 4.5:1 on level-1 | Error messages, destructive labels |
| `txt-invert` | `#FFFFFF` | `#FFFFFF` | 4.5:1 on primary | Text on filled buttons, dark backgrounds |

### 2.4 Border Colors

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `border-solid` | `#E8ECF0` | `rgba(232,236,240,0.1)` | Card edges, dividers, table borders |
| `border-low` | `rgba(13,33,55,0.08)` | `rgba(232,236,240,0.08)` | Subtle separators |
| `border-mid` | `rgba(13,33,55,0.15)` | `rgba(232,236,240,0.12)` | Emphasized separators |
| `border-strong` | `rgba(13,33,55,0.25)` | `rgba(232,236,240,0.25)` | Active borders, secondary button edges |
| `border-accent` | `#27AE60` | `#34D278` | Focus states, active tab indicators |

### 2.5 Semantic Colors

| Semantic | Background (Light) | Background (Dark) | Text (Light) | Text (Dark) | Border |
|----------|-------------------|-------------------|--------------|-------------|--------|
| Success | `#E8F8EF` | `rgba(39,174,96,0.12)` | `#27AE60` | `#34D278` | `#27AE60` |
| Warning | `#FEF3E2` | `rgba(243,156,18,0.12)` | `#F39C12` | `#F5B041` | `#F39C12` |
| Danger | `#FDECEB` | `rgba(231,76,60,0.15)` | `#E74C3C` | `#FF6B6B` | `#E74C3C` |
| Info | `#E8F0FE` | `rgba(52,152,219,0.15)` | `#3498DB` | `#52A9FF` | `#3498DB` |

### 2.6 Interactive State Colors

Every interactive surface follows a three-state pattern: **rest → hover → pressed**. States are defined at the token level, not per-component.

| Base | Hover | Pressed | Usage |
|------|-------|---------|-------|
| `primary (#0D2137)` | `#1A3D5E` | `#2D5A8A` | Navy-filled surfaces |
| `accent (#27AE60)` | `#34D278` | `#1E9A4A` | Emerald-filled surfaces |
| `secondary (#FFF)` | `#F5F7FA` | `#E8ECF0` | White/light surfaces |
| `subtle (3% navy)` | `5% navy` | `8% navy` | Transparent hover backgrounds |
| `highlight (5% navy)` | `8% navy` | `12% navy` | Quaternary button fills |
| `danger (#E74C3C)` | `#C0392B` | `#A93226` | Destructive actions |

### 2.7 Data Visualization Palette

For charts, graphs, and data-dense views. Colors are ordered by visual weight and designed to be distinguishable for common forms of color blindness.

| Index | Hex | Name | Usage |
|-------|-----|------|-------|
| 1 | `#27AE60` | Emerald | Primary metric, "good" values |
| 2 | `#3498DB` | Blue | Secondary metric, informational |
| 3 | `#F39C12` | Amber | Warnings, attention-needed |
| 4 | `#E74C3C` | Red | Failures, critical items |
| 5 | `#2D5A8A` | Navy Mid | Tertiary groupings |
| 6 | `#9B59B6` | Purple | Additional category |
| 7 | `#1ABC9C` | Teal | Additional category |
| 8 | `#E67E22` | Orange | Additional category |

Always pair with non-color indicators (patterns, labels, icons) per WCAG.

### Named Color Rules

**The Emerald Discipline Rule.** Emerald appears only on interactive elements (buttons, links, active states) and success indicators. It is never decorative. If a surface is emerald, it is clickable or it confirms success.

**The Tinted Neutral Rule.** No pure greys. Every neutral carries a trace of navy hue (chroma ~0.005-0.01 in OKLCH). The hex values in this palette already satisfy this: `#7A8FA3` and `#F5F7FA` both lean blue.

**The No-Pure-Black/White Rule.** Never use `#000000` or `#FFFFFF` as intentional design choices. The palette's tinted neutrals exist for a reason. In dark mode, the deepest surface is `#0A1929` (navy-tinted black). In light mode, card backgrounds use the `level-1` token.

## 3. Typography

**Primary Font:** Inter (with system-ui, sans-serif fallback)
**Mono Font:** JetBrains Mono (with Fira Code, monospace fallback)

**Why Inter:** Inter's mechanical precision and generous x-height make it disappear at body size and command attention at display size. The tight negative tracking on headings (-1.6px at display, -0.5px at headline) gives the type a slightly condensed, authoritative feel without a condensed face. It is the most battle-tested font for data-dense admin UIs.

### 3.1 Type Scale

| Level | Weight | Size | Line Height | Tracking | CSS Class | Usage |
|-------|--------|------|-------------|----------|-----------|-------|
| Display | 700 | 3rem / 48px | 1.0 | -1.6px | `text-5xl` | Page heroes only. Rare. |
| H1 | 700 | 2.25rem / 36px | 1.11 | -1.2px | `text-4xl` | Top-level page titles |
| H2 | 700 | 1.875rem / 30px | 1.2 | -1px | `text-3xl` | Major section headers |
| Headline | 700 | 1.5rem / 24px | 1.33 | -0.5px | `text-2xl` | Section headers, card titles |
| Title | 600 | 1.25rem / 20px | 1.4 | -0.4px | `text-xl` | Subsection headers, modal titles |
| Title Medium | 500 | 1.25rem / 20px | 1.4 | -0.4px | `text-xl-medium` | Medium-weight titles |
| Body Large | 400 | 1.125rem / 18px | 1.56 | 0 | `text-lg` | Feature descriptions, long-form |
| Body | 400 | 1rem / 16px | 1.5 | 0 | `text-base` | Standard reading text |
| Body Small | 400 | 0.875rem / 14px | 1.43 | 0 | `text-sm` | Descriptions, table cells, form help text |
| Label | 400/600 | 0.75rem / 12px | 1.33 | 0 | `text-xs` | Badges, timestamps, metadata, field labels |
| Caption | 400 | 0.6875rem / 11px | 1.27 | 0 | `text-xxs` | Fine print, copyright notices |
| Mono | 400 | 0.875rem / 14px | 1.43 | 0 | `font-mono text-sm` | Code snippets, API keys, GIDs |

### 3.2 Typography Rules

**The Weight Ladder Rule.** Adjacent hierarchy levels must differ by at least one weight step (100 units) or one size step (1.25x). Same-weight, same-size text at different semantic levels is flat hierarchy and always wrong.

**The Max Width Rule.** Body text in long-form contexts caps at 65-75ch. Use `max-w-prose` or equivalent. Data tables and dense layouts are exempt.

**The Tabular Figures Rule.** Use `font-variant-numeric: tabular-nums` for any column of numbers (table cells, prices, counts, IDs). This prevents layout shift as values change.

**The Minimum Size Rule.** No text smaller than 12px (0.75rem) in any context. The `text-xxs` size (11px) is the exception floor, used only for legal fine print and copyright notices.

## 4. Spacing & Layout

### 4.1 Spacing Scale

Built on a 4px base unit. Use these tokens for all padding, margin, and gap values.

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 4px | Tight gaps between inline elements, icon-to-text |
| `sm` | 8px | Compact spacing within components, between list items |
| `md` | 16px | Standard padding inside cards, between form fields |
| `lg` | 24px | Section spacing, card padding |
| `xl` | 32px | Between major sections, page-level vertical rhythm |
| `2xl` | 48px | Hero spacing, large section breaks |
| `3xl` | 64px | Page-level breathing room |

### 4.2 Layout Constants

| Element | Value | Notes |
|---------|-------|-------|
| Header height | 48px | Fixed, `z-20` |
| Sidebar width (open) | 280px | Collapsible, hidden below `lg` breakpoint |
| Content max-width | 1200px | Centered with auto margins |
| Content padding | 16px (mobile) / 24px (sm) / 32px (lg) | Responsive horizontal padding |

### 4.3 Breakpoints

| Name | Width | Usage |
|------|-------|-------|
| `sm` | 640px | Small tablets, large phones landscape |
| `md` | 768px | Tablets portrait |
| `lg` | 1024px | Sidebar visible, desktop layout |
| `xl` | 1280px | Wide desktop |
| `2xl` | 1536px | Ultra-wide |

### 4.4 Z-Index Scale

Defined globally. Never use arbitrary z-index values.

| Layer | Value | Usage |
|-------|-------|-------|
| Base | `0` | Default content |
| Dropdown | `10` | Dropdown menus, popovers |
| Sticky | `20` | Header, sticky table headers |
| Overlay | `30` | Mobile menu backdrop, drawer overlay |
| Modal | `40` | Dialogs, confirm dialogs |
| Toast | `50` | Toast notifications (always on top) |

## 5. Elevation & Shadows

The system is flat by default. Shadows appear only as responses to state, not as decorative layering.

### 5.1 Shadow Scale

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-base` | `0px 1px 3px rgba(13,33,55,0.1), inset 0px -1px 0px rgba(0,0,0,0.1)` | Buttons at rest. The inset bottom edge gives a subtle pressed-plate feel. |
| `shadow-hover` | `0px 2px 6px rgba(13,33,55,0.1), inset 0px -1px 0px rgba(0,0,0,0.1)` | Buttons on hover. Slightly deeper than base. |
| `shadow-focus` | `0px 0px 0px 4px rgba(39,174,96,0.3)` | Focus ring. Emerald glow, always visible on keyboard focus. |
| `shadow-mid` | `0px 2px 4px rgba(13,33,55,0.08), 0px 2px 12px rgba(13,33,55,0.06)` | Dropdowns, popovers, floating elements. |
| `shadow-card-hover` | `0 8px 30px rgba(13,33,55,0.06)` | Cards lift on hover with this diffuse shadow. |
| `shadow-dialog` | `0 16px 48px rgba(13,33,55,0.16), 0 4px 16px rgba(13,33,55,0.08)` | Modal dialogs and sheets. |

### 5.2 Elevation Rules

**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadows appear only as a response to state (hover, focus, elevation change). A card at rest has a 1px border, not a shadow. It earns its shadow on hover.

**The Consistent Focus Rule.** All focus rings use the `shadow-focus` token: `0px 0px 0px 4px rgba(39,174,96,0.3)`. No exceptions, no variations. This consistency is an accessibility commitment.

**The Dark Mode Shadow Rule.** In dark mode, shadows shift to darker values with reduced opacity. The visual effect is subtler because the base surfaces are already dark. Border visibility becomes more important than shadow depth.

## 6. Motion

All transitions use the ease-out-quart curve by default. Motion is functional: it guides attention, confirms actions, and maintains spatial continuity. Nothing moves for decoration.

### 6.1 Duration Tokens

| Token | Duration | Usage |
|-------|----------|-------|
| `instant` | 0ms | Immediate state changes (no transition) |
| `fast` | 100ms | Color changes, opacity toggles |
| `normal` | 150ms | Button hovers, input focus, standard interactions |
| `relaxed` | 200ms | Card hover lifts, dropdown open/close |
| `slow` | 300ms | Sidebar collapse, page transitions |
| `deliberate` | 400ms | Complex layouts, multi-element choreography |

### 6.2 Easing Curves

| Token | Curve | Usage |
|-------|-------|-------|
| `ease-out-quart` | `cubic-bezier(0.25, 1, 0.5, 1)` | Default for all entering transitions |
| `ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | Faster deceleration, for snappy opens |
| `ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Exiting transitions (elements leaving) |
| `spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Subtle overshoot for delight (toggles, checkmarks) |

### 6.3 Motion Rules

**The Functional Motion Rule.** Every animation must express cause-and-effect. If you can't state what the animation communicates ("this element is appearing from below", "this card is lifting to invite interaction"), remove it.

**The Exit Faster Rule.** Exit animations are 60-70% the duration of enter animations. Users don't need to watch things leave.

**The Reduced Motion Rule.** `prefers-reduced-motion: reduce` is always respected. All `animation-duration` and `transition-duration` collapse to near-zero (0.01ms). Scroll behavior becomes `auto`. This is implemented globally in `theme.css`.

**The No Bounce Rule.** No bounce or elastic easing. All transitions use ease-out curves (quart/quint). This is a GRC product — stability and confidence, not playfulness.

**The Transform-Only Rule.** Animate only `transform` and `opacity`. Never animate `width`, `height`, `top`, `left`, or any property that triggers layout reflow.

## 7. Components

### 7.1 Buttons

**Shape:** Generously rounded (12px), substantial padding (12px vertical, 24px horizontal), semibold (600) at 14px.

| Variant | Rest | Hover | Active | Usage |
|---------|------|-------|--------|-------|
| **Primary** | Emerald fill, white text, `shadow-base` | Emerald-light fill, -1px lift, emerald glow `0 4px 12px rgba(39,174,96,0.3)` | Emerald fill, no lift, scale(0.98) | Primary actions, CTAs |
| **Secondary** | White fill, navy-dark text, 2px `border-strong` border, `shadow-base` | Subtle bg, emerald border, `shadow-hover` | Highlight bg, scale(0.98) | Secondary actions |
| **Tertiary** | Transparent, navy-dark text | Text shifts to emerald | Tertiary-pressed bg | Low-emphasis, inline actions |
| **Quaternary** | 5% navy tint bg, navy-dark text | 8% navy tint | 12% navy tint | Lowest priority in dense layouts |
| **Danger** | Red fill, white text, 1px danger border, `shadow-base` | Darker red, `shadow-hover` | Darkest red | Destructive actions only |

**States:**
- **Disabled:** 60% opacity, `cursor-default`, no hover effects
- **Loading:** Button disabled, content replaced with spinner, width preserved
- **Icon-only:** 32x32px square, 8px padding, same variant styles

### 7.2 Badges

**Shape:** Full pill (9999px radius), semibold text.

| Property | sm | md |
|----------|-----|-----|
| Font size | 12px | 14px |
| Padding | 5px 14px | 6px 16px |
| Status dot | 6px circle | 6px circle |

**Variants:** `success`, `warning`, `danger`, `info`, `neutral`, `outline`, `highlight`

Each semantic variant (success/warning/danger/info) includes a 6px colored status dot before the text. The dot reinforces the semantic color for accessibility — color is never the sole indicator.

### 7.3 Cards

| Property | Value |
|----------|-------|
| Corner radius | 12px (`rounded-xl`) |
| Background | `level-1` (white in light, `#0D2137` in dark) |
| Border | 1px solid `border-solid` |
| Shadow at rest | None |
| Hover | -2px translateY, `shadow-card-hover`, 200ms ease-out-quart |
| Padding (padded variant) | 24px |

### 7.4 Inputs

| Property | Value |
|----------|-------|
| Border | 1.5px solid `border-solid` |
| Background | `level-1` |
| Corner radius | 8px (`rounded-lg`) |
| Font size | 14px |
| Padding | 6px 12px |
| Min height | 36px (meets 44px touch target with label) |

**States:**
- **Rest:** 1.5px `border-solid` border
- **Hover:** Border color shifts to `border-strong`
- **Focus:** 2px emerald border + `0 0 0 3px rgba(39,174,96,0.12)` glow ring + `rgba(39,174,96,0.02)` background tint. Transition 200ms ease-out-quart.
- **Invalid:** 2px `danger` border, overrides all hover/focus border treatments
- **Disabled:** Reduced opacity, `cursor-not-allowed`
- **Ghost variant:** No border, no background. For inline editing.
- **Title variant:** Large text (1.5rem), semibold, no border. For editable page titles.

### 7.5 Tabs

**Style:** Bottom-border indicator, no background changes.

| Property | Value |
|----------|-------|
| Text | 14px semibold, `txt-secondary` |
| Active text | `txt-primary` |
| Active indicator | 2px bottom border, `border-active` (navy-dark) |
| Hover text | Shifts toward `txt-primary` |
| Gap between tabs | 24px |
| Vertical padding | 16px |

Tab badges (count indicators) use `text-xs font-semibold`, `rounded-lg`, `bg-highlight` background.

### 7.6 Sidebar

| Property | Value |
|----------|-------|
| Width (open) | 280px |
| Background | `level-0` |
| Border | 1px right border, `border-solid` |
| Padding | 16px horizontal (open), 8px (collapsed) |
| Active item | Emerald accent indicator |
| Top offset | 48px (below fixed header) |
| Collapse/expand | Tertiary button at bottom, persisted to `localStorage` |

On mobile (`< lg`): sidebar hidden, replaced by hamburger menu that opens as a slide-out overlay with `bg-dialog/30` backdrop.

### 7.7 Dialogs

| Property | Value |
|----------|-------|
| Backdrop | `bg-dialog` (navy-dark) at 30% opacity |
| Container | `level-1` background, 12px radius, `shadow-dialog` |
| Max width | 480px (confirm), 640px (form), 800px (detail) |
| Padding | 24px |
| Entry animation | Scale from 0.95 + fade, 200ms ease-out-expo |
| Exit animation | Scale to 0.95 + fade, 140ms ease-in |

**Confirm dialogs** have a clear visual hierarchy: title, description, then action buttons. Destructive actions use the `danger` button variant and are placed on the right.

### 7.8 Dropdowns & Popovers

| Property | Value |
|----------|-------|
| Background | `level-2` |
| Border | 1px `border-solid` |
| Corner radius | 8px |
| Shadow | `shadow-mid` |
| Item padding | 8px 12px |
| Item hover | `bg-highlight` |
| Z-index | `z-dropdown` (10) |

### 7.9 Tables

| Property | Value |
|----------|-------|
| Header text | `text-xs font-semibold text-txt-secondary` uppercase |
| Header background | Transparent |
| Row height | 48px minimum (touch-friendly) |
| Row border | 1px bottom `border-low` |
| Row hover | `bg-subtle` |
| Cell padding | 12px 16px |
| Sortable indicator | Chevron icon, rotates on sort direction |

For dense tables, row height can reduce to 36px with 8px 12px padding. Never go below 36px.

### 7.10 Toasts

| Property | Value |
|----------|-------|
| Position | Bottom-right, 16px from edges |
| Background | `level-1` with `shadow-dialog` |
| Border | 1px `border-solid` |
| Corner radius | 12px |
| Auto-dismiss | 4 seconds |
| Entry | Slide up + fade, 200ms ease-out-expo |
| Exit | Fade out, 150ms ease-in |
| Z-index | `z-toast` (50) |
| Accessibility | `aria-live="polite"`, never steals focus |

### 7.11 Skeletons

| Property | Value |
|----------|-------|
| Background | `bg-highlight` |
| Animation | Pulse (opacity 1 → 0.4 → 1), 1.5s, infinite |
| Corner radius | Same as the element being replaced |
| Reduced motion | Static at 0.6 opacity (no animation) |

Prefer skeleton screens over spinners for content loading. Spinners are reserved for action feedback (button loading, form submission).

### 7.12 Shield Logo (Signature Component)

The brand mark: a shield shape with navy-dark-to-navy gradient fill, 3px navy-mid stroke at 40% opacity, and an emerald gradient checkmark inside. Used at 32-40px in navigation, larger in auth layouts. Text portion uses HTML spans (not SVG text) for proper font rendering: "SOC2" in extrabold, "Start" in light, ".io" in light emerald.

## 8. Dark Mode

Dark mode is a fully-designed companion theme, not an automated inversion. Every token has an intentional dark-mode value.

### 8.1 Surface Strategy

Dark mode uses the navy family as its surface progression, creating depth through subtle lightening rather than shadow.

| Layer | Light | Dark | Purpose |
|-------|-------|------|---------|
| Root (level-0) | `#F5F7FA` | `#0A1929` | Page background |
| Card (level-1) | `#FFFFFF` | `#0D2137` | Primary content surfaces |
| Elevated (level-2) | `#FFFFFF` | `#132D4A` | Popovers, dropdowns |
| Overlay (level-3) | `#0D2137` | `#1A3D5E` | Dialog backdrops, inverted |

### 8.2 Dark Mode Design Rules

**The Semantic Stability Rule.** Token names keep their semantic meaning across themes. `--color-primary` represents the primary interactive color in both modes. In light mode it's navy-dark (for secondary buttons, text). In dark mode, the background IS navy, so primary buttons stay emerald and the "primary" surface role shifts to emerald for interactive contrast. This is intentional — the accent needs to carry more weight in dark mode.

**The Desaturation Rule.** Bright semantic colors (danger, warning, info) use lighter, slightly desaturated variants in dark mode to avoid visual harshness on dark backgrounds. `#E74C3C` → `#FF6B6B`, `#3498DB` → `#52A9FF`.

**The Border Visibility Rule.** Dark mode borders use `rgba(232,236,240,0.1)` — visible but not harsh. Border-dependent layouts (cards, tables) must be tested in dark mode specifically, as borders carry more structural weight when shadows are less effective.

**The Contrast Parity Rule.** Every text/background pair must meet WCAG AA (4.5:1) in BOTH themes. Dark mode is tested independently, not inferred.

## 9. Accessibility

### 9.1 Contrast Requirements

| Element | Minimum Ratio | Standard |
|---------|--------------|----------|
| Body text | 4.5:1 | WCAG AA |
| Large text (≥18px bold or ≥24px) | 3:1 | WCAG AA |
| Non-text elements (icons, borders) | 3:1 | WCAG AA |
| Focus indicators | 3:1 against adjacent colors | WCAG 2.1 |

### 9.2 Focus Management

- All interactive elements show `shadow-focus` on `:focus-visible` (keyboard only, not click)
- Focus ring is 4px emerald glow at 30% opacity
- Tab order matches visual order — never use `tabindex > 0`
- After form submission errors, focus moves to the first invalid field
- After dialog close, focus returns to the trigger element

### 9.3 Screen Reader Support

- All icon-only buttons have `aria-label`
- Status badges include text, not just color
- Loading states use `aria-live="polite"` regions
- Form fields have associated `<label>` elements
- Error messages use `role="alert"` or `aria-live="assertive"`

### 9.4 Reduced Motion

Implemented globally in `theme.css`:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## 10. Responsive Design

### 10.1 Mobile Adaptations

| Element | Desktop (≥1024px) | Tablet (768-1023px) | Mobile (<768px) |
|---------|-------------------|---------------------|-----------------|
| Sidebar | Fixed, 280px | Hidden | Hamburger overlay |
| Content padding | 32px | 24px | 16px |
| Page title | `text-2xl` | `text-2xl` | `text-xl` |
| Tables | Full columns | Horizontal scroll | Card layout or reduced columns |
| Dialogs | Centered, max-width | Centered, 90% width | Full-width, bottom-sheet on small screens |
| Toast position | Bottom-right | Bottom-right | Bottom-center, full-width |

### 10.2 Touch Targets

All interactive elements meet 44x44px minimum touch target size. If the visual element is smaller (e.g., a 32x32px icon button), the hit area extends via padding.

### 10.3 Viewport Rules

- `width=device-width, initial-scale=1` — never disable zoom
- Use `min-h-dvh` instead of `100vh` for full-height layouts
- No horizontal scroll on any viewport width
- `html { background-color: var(--color-level-0) }` prevents white flash on overscroll

## 11. Do's and Don'ts

### Do:

- **Do** use emerald exclusively for interactive and success elements. Its value comes from restraint.
- **Do** use the navy-dark-to-emerald contrast pair as the primary visual signature. Navy anchors; emerald activates.
- **Do** give forms and approval workflows generous vertical spacing (24-32px between groups). CISOs making compliance decisions need room to think, not density.
- **Do** use the 1.5px-to-2px border thickening on focus as the standard input feedback pattern. It is subtle, accessible, and distinctive.
- **Do** design dark mode tokens intentionally. Every color has a deliberate dark-mode counterpart.
- **Do** use skeleton screens for content loading (>300ms). They communicate structure.
- **Do** test every screen in both light and dark mode before shipping.
- **Do** use semantic color tokens throughout — never hardcode hex values in components.

### Don't:

- **Don't** use legacy GRC aesthetics: grey-on-grey surfaces, 11px text walls, modal-on-modal workflows, or tiny click targets. Every element from ServiceNow or OneTrust that makes a CISO sigh is forbidden here.
- **Don't** use the generic SaaS-cream aesthetic: soft beige gradients, same-radius-everything, indistinct brand identity. SOC2Start.io has a specific palette and owns it.
- **Don't** use playful patterns: emoji in UI chrome, pastel palettes, whimsical illustrations. Compliance demands credibility.
- **Don't** use border-left or border-right greater than 1px as a colored accent stripe on cards, list items, or alerts.
- **Don't** use gradient text (`background-clip: text` with gradient).
- **Don't** use glassmorphism, `backdrop-filter: blur()`, or frosted-glass effects decoratively.
- **Don't** use the hero-metric template (big number, small label, gradient accent). If metrics are needed, use inline density, not a card grid.
- **Don't** use bounce or elastic easing. All transitions use ease-out curves.
- **Don't** use pure black (`#000`) or pure white (`#FFF`) as intentional design choices.
- **Don't** use arbitrary z-index values. Use the defined scale.
- **Don't** animate `width`, `height`, `top`, or `left`. Use `transform` and `opacity` only.
- **Don't** ignore dark mode. Every new component ships with both theme variants or it doesn't ship.
- **Don't** use spinners for content loading. Use skeleton screens. Spinners are for action feedback only.
- **Don't** rely on color alone to convey status. Always pair with text, icons, or patterns.

## 12. Implementation Reference

### 12.1 Technology Stack

- **CSS Framework:** Tailwind CSS 4 with `@theme` custom properties
- **Component Variants:** `tailwind-variants` (`tv()`) for type-safe variant composition
- **Component Library:** `@probo/ui` (internal, `packages/ui/`)
- **Icons:** Custom SVG icons in `packages/ui/src/Atoms/Icons/`
- **Fonts:** Google Fonts (Inter, JetBrains Mono) loaded in app `index.html` files
- **Styling Pattern:** Atomic Design (Atoms → Molecules → Layouts)

### 12.2 Token Architecture

All design tokens are defined in `packages/ui/src/theme.css` using CSS custom properties inside a `@theme` block. Dark mode overrides use `@variant dark` inside `@layer theme`.

```
theme.css
├── @theme { }                    # Light mode tokens (default)
│   ├── --color-*                 # Color system
│   ├── --text-*                  # Typography scale
│   ├── --shadow-*                # Shadow scale
│   └── --font-*                  # Font families
├── @layer theme { :root @variant dark { } }  # Dark mode overrides
├── @custom-variant document      # Print/document typography
└── Global styles                 # Focus rings, scrollbar, reduced motion
```

### 12.3 File Organization

```
packages/ui/src/
├── theme.css              # Design tokens (source of truth)
├── Atoms/                 # Primitive components
│   ├── Button/            # Button.tsx
│   ├── Badge/             # Badge.tsx
│   ├── Card/              # Card.tsx
│   ├── Input/             # Input.tsx, DurationInput.tsx
│   ├── Sidebar/           # Sidebar.tsx, SidebarItem.tsx
│   ├── Tabs/              # Tabs.tsx
│   ├── Icons/             # SVG icon components
│   └── ...
├── Molecules/             # Composite components
│   ├── Dialog/            # Dialog.tsx, ConfirmDialog.tsx
│   ├── PageHeader/        # PageHeader.tsx
│   ├── Field/             # Field.tsx (label + input + error)
│   └── ...
└── Layouts/               # Page-level layouts
    ├── Layout.tsx          # Main app shell
    ├── CenteredLayout.tsx  # Auth pages
    └── ErrorLayout.tsx     # Error pages
```
