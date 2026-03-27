# Design System Document: The Immersive Intelligence Framework

## 1. Overview & Creative North Star: "The Digital Ethereal"
The North Star for this design system is **"The Digital Ethereal."** We are moving away from the "chat bubble in a box" paradigm toward a borderless, cinematic experience where the AI feels integrated into the user's environment rather than partitioned off. 

By leveraging **intentional asymmetry**, **glassmorphism**, and **tonal depth**, we create an interface that feels like a high-end editorial piece. We reject the rigid, grid-locked look of standard SaaS apps in favor of breathing room and sophisticated layering. The goal is "Soft Minimalism"—an interface that is powerful but feels quiet, responsive, and human.

---

## 2. Colors & Surface Philosophy
This system utilizes a deep-sea palette (`#0b0e14`) contrasted with vibrant, electric accents (`#8ff5ff`). 

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to section content. Boundaries must be defined through:
- **Background Shifts:** Placing a `surface-container-low` element against a `surface` background.
- **Tonal Transitions:** Using subtle gradients to guide the eye.
- **Negative Space:** Relying on the `Spacing Scale` (e.g., `spacing-8`) to define groupings.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of semi-translucent materials.
- **Base Layer:** `surface` (#0b0e14)
- **Secondary Depth:** `surface-container-low` (#10131a)
- **Active Elements:** `surface-container-high` (#1c2028)
- **Interaction Layer:** `surface-bright` (#282c36)

### The "Glass & Gradient" Rule
To achieve the premium "AI-Generated" feel, use **Glassmorphism** for all floating UI.
- **Formula:** `surface-variant` at 40% opacity + 20px backdrop-blur.
- **Signature Texture:** Primary CTAs should use a linear gradient from `primary` (#8ff5ff) to `primary-container` (#00eefc) at a 135-degree angle to provide "visual soul."

---

## 3. Typography: Editorial Authority
We pair the approachable **Plus Jakarta Sans** for high-impact display moments with the utilitarian precision of **Inter** for functional reading.

| Role | Font | Size | Weight | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Display-LG** | Plus Jakarta Sans | 3.5rem | 700 | Immersive greetings ("ALOHA") |
| **Headline-MD** | Plus Jakarta Sans | 1.75rem | 600 | Sub-headers and feature callouts |
| **Title-LG** | Inter | 1.375rem | 500 | Message headers / User names |
| **Body-LG** | Inter | 1.0rem | 400 | Chat messages / Primary reading |
| **Label-MD** | Inter | 0.75rem | 600 | Status indicators / Metadata |

*Design Note: Use `display-lg` for the "ALOHA" header to create an immediate sense of scale and friendliness upon entry.*

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are too "heavy" for this system. We use light to define height.

*   **The Layering Principle:** Instead of a shadow, place a `surface-container-lowest` (#000000) element inside a `surface-container-high` (#1c2028) area to create a "recessed" look.
*   **Ambient Shadows:** For floating elements (like the Input Capsule), use a shadow color tinted with `surface-tint` (#8ff5ff) at 5% opacity, with a blur of 40px and Y-offset of 20px.
*   **The Ghost Border:** If accessibility requires a stroke, use `outline-variant` at 15% opacity. Never use a 100% opaque border.

---

## 5. Components

### The Floating Input Capsule (Signature Component)
The core of the experience. 
- **Shape:** Pill-shaped (`rounded-full`).
- **Surface:** Glassmorphism (semi-transparent `surface-container` with 32px blur).
- **Shadow:** Ambient soft-glow shadow.
- **Interaction:** On focus, the `outline` token glows softly at 20% opacity.

### Pill-Shaped Action Chips
- **Container:** `surface-container-high`.
- **Typography:** `label-md`.
- **Edge:** `rounded-full`.
- **Animation:** Subtle 2px lift on hover using `surface-bright`.

### Conversational Lists
- **Layout:** Forbid dividers. Use `spacing-6` between messages.
- **AI Responses:** Distinct background using a subtle gradient from `surface-container-low` to `surface-container-highest`.
- **User Messages:** Right-aligned, utilizing the `secondary-container` color with `on-secondary-container` text.

### Immersive Header
- **Layout:** `title-lg` for "ALOHA," center-aligned.
- **Icons:** Minimalist 24px stroke icons using `outline` token.
- **Status:** A small pulse animation on the `primary` color dot to indicate "AI is thinking."

---

## 6. Do's and Don'ts

### Do
- **Do** use `display-lg` for empty states to make the screen feel intentional and curated.
- **Do** allow background images to bleed through the UI using glassmorphism.
- **Do** use `primary-fixed-dim` for secondary buttons to maintain a sophisticated, low-contrast look.
- **Do** prioritize white space over lines. If it feels too empty, increase the font size of the `display` text rather than adding a box.

### Don't
- **Don't** use pure white (#FFFFFF) for text on dark themes; use `on-surface` (#ecedf6) to reduce eye strain.
- **Don't** use 90-degree corners. Everything must follow the `Roundedness Scale` (minimum `md`: 1.5rem).
- **Don't** use standard "blue" for links. Use the `tertiary` (#65afff) color for a custom, bespoke feel.
- **Don't** stack more than three levels of surface nesting. If depth is still needed, use a `backdrop-blur` overlay.

---

## 7. Implementation Note: AI-Generated Themes
When generating a **Custom Theme** based on a background image:
1. Extract the dominant vibrant color and map it to `primary`.
2. Extract the darkest muted tone and map it to `surface`.
3. Apply a 60% opacity overlay of the `surface` color over the background image to ensure `on-surface` text remains WCAG AAA compliant.