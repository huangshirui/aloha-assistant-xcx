# ALOHA Homepage Implementation Spec

This file bridges `DESIGN.md` and the WeChat Mini Program implementation for the homepage only.

## Scope

Only the homepage is in scope.

- Top region
- Central interaction canvas
- Floating bottom toolbar
- `more` overflow actions attached to the toolbar

Do not extend this spec to history pages, drawers, or detail cards yet.

## Design Intent

The homepage is a quiet workspace, not a chat feed.

- Style: Silent Architect
- Mood: restrained, immersive, editorial, professional
- Base: light paper background
- Hierarchy: tonal layering and spacing, not divider lines
- Toolbar: floating glass layer, secondary to the canvas

## Layout Contract

The homepage is split into exactly three regions.

### 1. Top Region

Purpose:
- Reserve the native status bar area
- Place the menu trigger at the upper-left of the navigation band
- Keep the current state label centered
- Reserve the WeChat capsule area on the right without drawing a fake capsule

Implementation rules:
- Page uses `navigationStyle: "custom"`
- Status bar height comes from system metrics
- Navigation content uses the same unit system as system metrics: `px`
- Center title must be positioned against the full page width, not against the left button
- Left menu and right capsule reserve area must not push the title off-center

Recommended formula:
- `headerHeight = statusBarHeight + navHeight`
- `navTop = statusBarHeight`
- `menuTop = navTop + (navHeight - menuSize) / 2`
- `titleTop = navTop`
- `capsuleTop = navTop + (navHeight - capsuleHeight) / 2`

### 2. Central Canvas

Purpose:
- Everything below the top region and above the floating toolbar is the interaction canvas
- Canvas content may scroll behind the floating toolbar area

Implementation rules:
- Canvas begins immediately below the top region
- Canvas uses a low-contrast surface shift from the page background
- Welcome card sits within the canvas and may float visually above it

### 3. Floating Bottom Toolbar

Purpose:
- Persistent primary controls

Required actions:
- New session
- Text input
- Voice
- Camera
- More

Implementation rules:
- Toolbar is bottom-centered
- Toolbar floats above canvas
- Toolbar does not consume layout space in normal document flow
- Initial state does not highlight the first action by default unless the product explicitly requires it

### 4. More Overflow

Purpose:
- Secondary input sources related to the toolbar

Required actions:
- WeChat chat history
- Images / video
- Files
- Location

Implementation rules:
- Attached visually to the toolbar
- Does not create a new permanent section between canvas and toolbar

## Tokens In Use

- Background: `#f8f9fa`
- Canvas surface: around `#f1f4f5`
- Active card: `#ffffff`
- Primary ink: `#1A1C2E`
- Secondary accent: `#457B9D`

## Engineering Rules

- Do not mix `px` system metrics with `rpx` in the same positioning formula
- Keep title centering independent from left and right controls
- Avoid fake system UI; reserve space for native UI instead
- Prefer one layout model per region over layered ad-hoc offsets
