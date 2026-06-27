# Design System: Trikala Architects

## 1. Visual Theme & Atmosphere

A gallery-airy architecture studio interface with confident asymmetric layouts and fluid spring-physics motion. The atmosphere is warm and material — like a well-lit model-making atelier where drawings, timber samples, and project photography share the same quiet confidence. Density sits at daily-app balance (4/10); variance is high (8/10) with offset grids and generous whitespace on one side; motion is fluid (6/10) with weighty springs and staggered reveals.

## 2. Color Palette & Roles

- **Canvas Grey** (#F5F5F5) — Primary page background, section surface
- **Pure Surface** (#FFFFFF) — Elevated panels, image frames
- **Charcoal Ink** (#1A1A1A) — Primary text, dark approach band (`black` token)
- **Deep Earth** (#170800) — Deep contrast accents (`custom-db`)
- **Muted Steel** (#71717A) — Secondary text, descriptions, metadata
- **Warm Sand** (#D1C1A4) — Soft highlight, decorative rules (`custom-premium`)
- **Terracotta Accent** (#774931) — Single accent for CTAs, active THRIVE letters, focus rings (`custom-lb`)
- **Whisper Border** (rgba(226,232,240,0.5)) — Structural 1px dividers

Max 1 accent (Terracotta). Saturation below 80%. No purple, blue neon, or gradient glows.

## 3. Typography Rules

- **Display:** Silver Queen (`font-silver`) — Track-tight headlines, weight-driven hierarchy, controlled scale (`text-4xl md:text-5xl lg:text-7xl`)
- **Body:** Arial / system sans — Relaxed leading (`leading-relaxed`), 65ch max-width, Muted Steel secondary color
- **Mono:** Geist Mono — Admin dashboard only; not used on public marketing pages
- **Banned:** Inter, generic system fonts for premium display contexts, generic serifs (Times, Georgia, Garamond)

## 4. Component Stylings

- **Buttons:** Flat, no outer glow. Tactile `-translate-y-[1px]` on active. Terracotta fill for primary; ghost/outline for secondary.
- **Cards:** Used only when elevation communicates hierarchy. Generously rounded (`rounded-[2.5rem]`) with diffused whisper shadow tinted to canvas hue. THRIVE principles use `border-l` dividers instead of card boxes.
- **Inputs:** Label above, error below. Focus ring in Terracotta Accent. No floating labels.
- **Loaders:** Skeletal shimmer matching exact layout dimensions. No circular spinners.
- **Empty States:** Composed compositions indicating how to populate data.

## 5. Layout Principles

- CSS Grid over flexbox percentage math — no `calc()` width hacks
- Asymmetric split Hero: left-aligned copy, right full-bleed project image
- Inline image typography in Hero headline — small rounded photo between words at cap-height
- Max-width containment: `max-w-[1400px] mx-auto`
- Full-height sections: `min-h-[100dvh]` — never `h-screen`
- Single-column collapse below 768px — no horizontal scroll on mobile
- Centered Hero sections banned — force split screen or left-aligned asymmetric whitespace
- Generic 3-column equal card rows banned — use 2-column zig-zag or left-rail + panel

## 6. Motion & Interaction

- **Spring physics default:** `stiffness: 100, damping: 20` — premium, weighty feel
- **Heading reveals:** Staggered word blur-in via existing `Heading` component
- **THRIVE panel:** `layoutId` shared element transitions between principle content
- **Active letter pulse:** Perpetual subtle scale/opacity loop on selected THRIVE letter
- **Staggered orchestration:** Cascade delays on section mount (`staggerChildren`)
- **Performance:** Animate exclusively via `transform` and `opacity`. Grain/noise on fixed pseudo-elements only.

## 7. Anti-Patterns (Banned)

- No emojis anywhere
- No Inter font
- No pure black (#000000) — use Charcoal Ink (#1A1A1A)
- No neon/outer glow shadows
- No oversaturated accents or purple/blue AI aesthetic
- No excessive gradient text on large headers
- No custom mouse cursors
- No overlapping elements — clean spatial separation always
- No 3-column or 6-column equal card/tab grids
- No centered Hero sections
- No generic names ("John Doe", "Acme", "Nexus")
- No fake round numbers (`99.99%`, `50%`)
- No AI copywriting clichés ("Elevate", "Seamless", "Unleash", "Next-Gen", "Holistic Innovation")
- No filler UI text: "Scroll to explore", "Swipe down", scroll arrows, bouncing chevrons
- No broken Unsplash links — use project DB images or `/static/` assets
