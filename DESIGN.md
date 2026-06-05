---
name: SOC2Start.io
description: Compliance that feels like competence, not compliance.
colors:
  navy-dark: "#0D2137"
  navy: "#1A3D5E"
  navy-mid: "#2D5A8A"
  emerald: "#27AE60"
  emerald-light: "#34D278"
  emerald-pale: "#E8F8EF"
  slate: "#7A8FA3"
  surface: "#F5F7FA"
  border: "#E8ECF0"
  danger: "#E74C3C"
  info: "#3498DB"
  warning: "#F39C12"
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
  xl: "20px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
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
    rounded: "9999px"
    padding: "5px 14px"
---

# Design System: SOC2Start.io

## 1. Overview

**Creative North Star: "The Assured Advisor"**

SOC2Start.io looks like the tool a seasoned CISO would build for themselves: clean, dense where it matters, spacious where decisions happen. It carries authority through restraint, not ornamentation. The navy-and-emerald palette grounds every screen in professional confidence without drifting into the cold grey monotony of legacy GRC tools.

The system prioritizes scanability over decoration. Tables, lists, and status indicators are information-dense. Forms, approvals, and signing flows breathe. Every transition is purposeful; nothing moves for the sake of movement.

This is not a startup dashboard trying to look fun. It is not an enterprise tool resigned to looking ugly. It sits in the narrow band of "clearly well-made" that earns trust from compliance professionals who've seen too many tools that look either cheap or overproduced.

**Key Characteristics:**
- Navy anchors identity; emerald signals action and success
- Light mode default, dark mode supported via system preference
- Tight negative letter-spacing on headings for density and authority
- Rounded corners (8-12px) soften without becoming playful
- Subtle hover elevation on interactive surfaces

## 2. Colors: The Coastal Palette

A restrained strategy with committed accents. Navy dark is the identity anchor; emerald is the action color. Everything else supports without competing.

### Primary
- **Navy Dark** (#0D2137): The identity color. Used for primary text, secondary button fills, header backgrounds, and the dialog overlay. Carries the brand's authority.
- **Emerald** (#27AE60): The action color. Primary buttons, success states, active borders, accent text. Its rarity makes it meaningful; overuse would dilute its signal.
- **Emerald Light** (#34D278): Hover/active state for emerald. Also used for dark-mode accent text where base emerald lacks contrast.

### Secondary
- **Navy** (#1A3D5E): Hover state for navy-dark surfaces. Used in the shield logo gradient start.
- **Navy Mid** (#2D5A8A): Pressed/active state for primary surfaces. The tertiary depth in the navy family.

### Neutral
- **Slate** (#7A8FA3): Secondary and tertiary text. The workhorse neutral: readable against both light and dark backgrounds.
- **Surface** (#F5F7FA): Page-level background (level-0). Warm enough to avoid clinical sterility, cool enough to stay professional.
- **Border** (#E8ECF0): Solid borders and dividers. Visible but never heavy.

### Semantic
- **Danger** (#E74C3C): Destructive actions, error states, failed badges.
- **Info** (#3498DB): Informational badges, link-adjacent highlights.
- **Warning** (#F39C12): Caution states, pending reviews.

### Named Rules
**The Emerald Discipline Rule.** Emerald appears only on interactive elements (buttons, links, active states) and success indicators. It is never decorative. If a surface is emerald, it is clickable or it confirms success.

**The Tinted Neutral Rule.** No pure greys. Every neutral carries a trace of navy hue (chroma ~0.005-0.01 in OKLCH terms). The hex values in this palette already satisfy this: #7A8FA3 and #F5F7FA both lean blue.

## 3. Typography

**Body Font:** Inter (with system-ui, sans-serif fallback)
**Mono Font:** JetBrains Mono (with Fira Code, monospace fallback)

**Character:** Inter's mechanical precision and generous x-height make it disappear at body size and command attention at display size. The tight negative tracking on headings (-1.6px at display, -0.5px at headline) gives the type a slightly condensed, authoritative feel without a condensed face.

### Hierarchy
- **Display** (700, 3rem/48px, line-height 1, tracking -1.6px): Page heroes only. Rare; most pages use Headline as their top level.
- **Headline** (700, 1.5rem/24px, line-height 1.33, tracking -0.5px): Section headers, page titles, card titles.
- **Title** (600, 1.25rem/20px, line-height 1.4, tracking -0.4px): Subsection headers, modal titles, sidebar group labels.
- **Body** (400, 0.875rem/14px, line-height 1.43): Primary reading text. Descriptions, table cells, form help text. Max width 65-75ch for long-form content.
- **Label** (400, 0.75rem/12px, line-height 1.33): Badges, timestamps, metadata, field labels. Also available as semibold (600) for emphasis.
- **Mono** (400, 0.875rem/14px, line-height 1.43): Code snippets, API keys, GID identifiers, CLI output.

### Named Rules
**The Weight Ladder Rule.** Adjacent hierarchy levels must differ by at least one weight step (100 units) or one size step (1.25x). Same-weight, same-size text at different semantic levels is flat hierarchy and always wrong.

## 4. Elevation

The system is flat by default. Shadows appear only as responses to state, not as decorative layering.

### Shadow Vocabulary
- **Base** (`0px 1px 3px rgba(13,33,55,0.1), inset 0px -1px 0px rgba(0,0,0,0.1)`): Buttons at rest. The inset bottom edge gives a subtle pressed-plate feel.
- **Hover** (`0px 2px 6px rgba(13,33,55,0.1), inset 0px -1px 0px rgba(0,0,0,0.1)`): Buttons on hover. Slightly deeper than base.
- **Focus** (`0px 0px 0px 4px rgba(39,174,96,0.3)`): Focus ring. Emerald glow, always visible on keyboard focus.
- **Mid** (`0px 2px 4px rgba(13,33,55,0.08), 0px 2px 12px rgba(13,33,55,0.06)`): Dropdowns, popovers, floating elements.
- **Card Hover** (`0 8px 30px rgba(13,33,55,0.06)`): Cards lift on hover with -translate-y-0.5 and this diffuse shadow.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadows appear only as a response to state (hover, focus, elevation change). A card at rest has a 1px border, not a shadow. It earns its shadow on hover.

## 5. Components

### Buttons
- **Shape:** Generously rounded (12px), substantial padding (12px 24px), semibold (600) at 14px
- **Primary:** Emerald fill, white text. Hovers to emerald-light with a subtle lift (-1px translateY) and emerald glow shadow. Active snaps back to emerald with no lift.
- **Secondary:** White fill with 2px navy-dark border. Hover inverts to navy-dark fill with white text. Active darkens to navy-mid.
- **Tertiary:** Transparent, navy-dark text. Hover shifts text to emerald. No border, no shadow.
- **Quaternary:** Subtle navy-tinted background (5% opacity). Hover deepens to 8%. For low-priority actions in dense layouts.
- **Danger:** Red fill, white text, 1px danger border. Shadow matches primary pattern.

### Badges
- **Shape:** Full pill (9999px radius), semibold text
- **Sizes:** sm (12px text, 5px/14px padding) and md (14px text, 6px/16px padding)
- **Status dot:** 6px colored circle before text for success/warning/danger/info/neutral variants. The dot reinforces the semantic color for accessibility.
- **Variants:** Success (emerald-tinted bg), warning (amber-tinted bg), danger (red-tinted bg), info (blue-tinted bg), neutral (subtle bg), outline (border only), highlight (navy-tinted bg)

### Cards
- **Corner Style:** Moderately rounded (12px)
- **Background:** Level-1 (white in light mode, #0D2137 in dark)
- **Shadow Strategy:** None at rest; 1px solid border provides the edge. On hover: lifts 2px with diffuse 30px-spread shadow.
- **Border:** 1px border-solid (#E8ECF0)
- **Internal Padding:** 24px when padded variant is used; otherwise content-controlled

### Inputs
- **Style:** 1.5px solid border, level-1 background, rounded-lg (8px), 14px text
- **Focus:** Border thickens to 2px emerald with a 3px emerald glow ring (10% opacity). Smooth 150ms transition.
- **Invalid:** 2px danger border, overrides all hover/focus border treatments
- **Ghost variant:** No border, no background. Used for inline editing (table cells, titles).

### Navigation
- **Sidebar:** Navy-dark background in light mode. Active item indicated by emerald accent, not by background highlight.
- **Tabs:** Bottom-border style. Active tab has 2px emerald bottom border. Inactive tabs are slate text, hovering shifts toward primary.

### Shield Logo (Signature Component)
The brand mark: a shield shape with navy-dark-to-navy gradient fill, 3px navy-mid stroke at 40% opacity, and an emerald gradient checkmark inside. Used at 32-40px in navigation, larger in auth layouts. Text portion uses HTML spans (not SVG text) for proper font rendering: "SOC2" in extrabold, "Start" in light, ".io" in light emerald.

## 6. Do's and Don'ts

### Do:
- **Do** use emerald exclusively for interactive and success elements. Its value comes from restraint.
- **Do** use the navy-dark-to-emerald contrast pair as the primary visual signature. Navy anchors; emerald activates.
- **Do** give forms and approval workflows generous vertical spacing (24-32px between groups). CISOs making compliance decisions need room to think, not density.
- **Do** use the 1.5px-to-2px border thickening on focus as the standard input feedback pattern. It is subtle, accessible, and distinctive.
- **Do** support system dark mode. The dark palette inverts the navy family while preserving emerald as the accent.

### Don't:
- **Don't** use legacy GRC aesthetics: grey-on-grey surfaces, 11px text walls, modal-on-modal workflows, or tiny click targets. Every element from ServiceNow or OneTrust that makes a CISO sigh is forbidden here.
- **Don't** use the generic SaaS-cream aesthetic: soft beige gradients, same-radius-everything, indistinct brand identity. SOC2Start.io has a specific palette and owns it.
- **Don't** use playful patterns: emoji in UI chrome, pastel palettes, whimsical illustrations. Compliance demands credibility.
- **Don't** use border-left or border-right greater than 1px as a colored accent stripe on cards, list items, or alerts.
- **Don't** use gradient text (background-clip: text with gradient).
- **Don't** use glassmorphism, backdrop-blur, or frosted-glass effects decoratively.
- **Don't** use the hero-metric template (big number, small label, gradient accent). If metrics are needed, use inline density, not a card grid.
- **Don't** use bounce or elastic easing. All transitions use ease-out curves (quart/quint).
- **Don't** use pure black (#000) or pure white (#fff) as intentional design choices. The palette's tinted neutrals exist for a reason.
