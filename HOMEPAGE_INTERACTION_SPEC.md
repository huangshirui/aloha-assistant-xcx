# ALOHA Homepage Interaction Spec

This file defines the interaction architecture for the homepage of the ALOHA WeChat Mini Program.

It complements `HOMEPAGE_SPEC.md` and the visual system in `DESIGN.md`.

## Goal

The homepage is a single immersive workspace.

It is not a chat message feed.

The page is driven by one page-level state model, and all visible regions respond to that state.

## Scope

This spec only covers the homepage.

Included:
- Top region
- Central canvas
- Floating bottom toolbar
- Drawer from the top-left menu
- Composer panel
- More panel
- First-stage voice and text interaction skeleton

Not included yet:
- History page
- Card detail page
- Full annotation editor
- Actual backend model integration
- Real speech-to-text service
- Real camera upload flow
- Real more-panel capability integrations

## Core Architecture

The homepage uses a single-page state machine architecture.

Rules:
- Do not split the homepage into multiple routes.
- All UI regions respond to one shared page state.
- Components do not invent private business states.
- Top bar status is derived from page state.
- Text input and voice input share one composer system.
- Canvas renders structured items, not a traditional message stream.

## Layout Regions

The homepage contains exactly three major visible regions:

1. Top region
2. Central interaction canvas
3. Floating bottom toolbar

Additional UI appears only as overlays attached to this page:
- Left drawer
- Composer panel
- More panel

The preferred direction for the composer is an integrated toolbar expansion state rather than a permanently separate floating sheet.

## Page State Model

The page owns one root state object.

Recommended shape:

```js
{
  session: {
    id: "session-001",
    status: "idle"
  },
  ui: {
    activeTool: "",
    panelState: {
      drawerOpen: false,
      composerOpen: false,
      moreOpen: false
    },
    composer: {
      mode: "idle",
      text: "",
      placeholder: "",
      draftSegments: []
    },
    voice: {
      mode: "idle",
      isPressed: false,
      transcriptLive: "",
      canSlideToEdit: false
    }
  },
  canvasItems: [],
  user: {
    name: "",
    avatar: ""
  }
}
```

## State Responsibilities

### 1. `activeTool`

Purpose:
- Represents which main control the user is currently engaging with.

Allowed values:
- `""`
- `"session"`
- `"text"`
- `"voice"`
- `"camera"`
- `"more"`

Rules:
- `activeTool` is a UI affordance, not the whole interaction state.
- It may highlight the current tool, but must not be the only source of truth.

### 2. `panelState`

Purpose:
- Tracks which overlay panel is visible.

Shape:

```js
panelState: {
  drawerOpen: false,
  composerOpen: false,
  moreOpen: false
}
```

Rules:
- `composerOpen` and `moreOpen` should not both be true at the same time.
- Drawer is independent from the toolbar, but should generally close when the user starts a composing action.
- `composerOpen` means the toolbar has expanded into input mode.
- Closing the expanded composer should not clear draft text by default.

### 3. `composer`

Purpose:
- Shared input system for text and voice.

Shape:

```js
composer: {
  mode: "idle",
  text: "",
  placeholder: "Ask ALOHA anything",
  draftSegments: []
}
```

Allowed `composer.mode` values:
- `idle`
- `text`
- `voice_editing`
- `submitting`

Rules:
- Text and voice use the same composer panel.
- Voice transcription writes into the same composer text pipeline.
- Releasing hold-to-talk may submit immediately.
- Canceling hold-to-talk may return into editable text mode.
- The composer is visually part of the toolbar expansion state.
- Toggling the text tool should open and close the composer without clearing draft text.
- Retained draft text does not by itself define the active input mode.
- When expanded, the composer and toolbar must read as one unified rounded-rectangle container.
- The expanded composer must not appear as two separate stacked floating cards.

### 4. `voice`

Purpose:
- Tracks voice capture behavior separately from the shared composer content.

Shape:

```js
voice: {
  mode: "idle",
  isPressed: false,
  transcriptLive: "",
  canSlideToEdit: false
}
```

Allowed `voice.mode` values:
- `idle`
- `hold_recording`
- `live_recording`

Rules:
- Voice mode only describes recording behavior.
- Final composed text still belongs to `composer.text`.
- "Send on release", "cancel to edit", and "return to editing" are transition outcomes, not persistent voice states.

### 5. `canvasItems`

Purpose:
- Structured render pipeline for everything shown in the canvas.

Rules:
- The canvas is not a chat list.
- The canvas renders a card-oriented content stream.
- Each item must be self-describing.

Minimum item protocol:

```js
{
  id: "item-001",
  type: "assistant_text",
  status: "ready",
  payload: {},
  actions: [],
  meta: {}
}
```

Common item contract:

```js
{
  id: "item-001",
  type: "assistant_text",
  status: "ready",
  payload: {
    title: "",
    subtitle: "",
    content: "",
    fields: [],
    choices: [],
    attachments: []
  },
  actions: [
    {
      id: "action-001",
      type: "confirm",
      label: "Confirm",
      value: "confirm"
    }
  ],
  meta: {
    createdAt: 0,
    source: "assistant"
  }
}
```

Recommended `type` values for phase one:
- `welcome`
- `assistant_text`
- `assistant_card`
- `choice_group`
- `confirm_card`
- `annotation_entry`
- `system_hint`

Recommended `status` values:
- `idle`
- `draft`
- `streaming`
- `ready`
- `waiting_user`
- `confirmed`
- `error`

Payload examples:

### `assistant_text`

```js
{
  id: "item-101",
  type: "assistant_text",
  status: "ready",
  payload: {
    title: "",
    subtitle: "",
    content: "Here is a concise answer.",
    fields: [],
    choices: [],
    attachments: []
  },
  actions: [],
  meta: {
    source: "assistant"
  }
}
```

### `assistant_card`

```js
{
  id: "item-102",
  type: "assistant_card",
  status: "ready",
  payload: {
    title: "New schedule draft",
    subtitle: "Please review before saving",
    content: "",
    fields: [
      { key: "date", label: "Date", value: "Tomorrow" },
      { key: "time", label: "Time", value: "10:00" }
    ],
    choices: [],
    attachments: []
  },
  actions: [
    { id: "confirm", type: "confirm", label: "Confirm", value: "confirm" },
    { id: "edit", type: "secondary", label: "Edit", value: "edit" }
  ],
  meta: {
    source: "assistant"
  }
}
```

### `choice_group`

```js
{
  id: "item-103",
  type: "choice_group",
  status: "waiting_user",
  payload: {
    title: "Choose one option",
    subtitle: "",
    content: "",
    fields: [],
    choices: [
      { id: "a", label: "Option A", value: "a" },
      { id: "b", label: "Option B", value: "b" }
    ],
    attachments: []
  },
  actions: [],
  meta: {
    source: "assistant"
  }
}
```

### `confirm_card`

```js
{
  id: "item-104",
  type: "confirm_card",
  status: "waiting_user",
  payload: {
    title: "Create this event?",
    subtitle: "",
    content: "",
    fields: [
      { key: "title", label: "Title", value: "Design review" }
    ],
    choices: [],
    attachments: []
  },
  actions: [
    { id: "confirm", type: "confirm", label: "Confirm", value: "confirm" },
    { id: "cancel", type: "secondary", label: "Cancel", value: "cancel" }
  ],
  meta: {
    source: "assistant"
  }
}
```

## Derived UI State

Some UI must be derived from the root state instead of stored separately.

### Top Bar Status

Top bar status must be derived, not manually controlled by the top bar component.

Derived mapping:
- If `voice.mode` is `hold_recording` or `live_recording`: show listening state
- Else if `session.status` is `thinking` or any canvas item is `streaming`: show assistant typing state
- Else: show `ALOHA`

Text editing rule:
- If `composer.mode` is `text_editing`, the top bar still shows `ALOHA`

This prevents the top bar from becoming a second state source.

### Toolbar Highlight State

Toolbar icon highlighting must also be derived from root state.

Derived rules:
- If `voice.mode` is `hold_recording` or `live_recording` and `panelState.composerOpen` is true, highlight the voice icon
- Else if `panelState.moreOpen` is true, highlight the more icon
- Else if `composer.mode` is `text` and `voice.mode` is `idle` and `panelState.composerOpen` is true, highlight the text icon
- Else no input tool remains highlighted
- New session and camera do not keep a persistent highlighted state

Visual rule:
- Highlight is expressed primarily by icon color change
- Container background change may be used as a weak supporting cue only
- Draft text persistence does not create a persistent highlighted keyboard state when the composer is closed
- In text input state, the composer area and the lower toolbar area should share the same surface color
- The divider between composer content and toolbar controls should be a very soft separator, not a hard boxed split
- Expanded and collapsed toolbar states should share the same corner language
- The expanded state should not feel sharper than the collapsed state

## Component Responsibilities

### `home-top-bar`

Owns:
- More button trigger
- Center status display
- Right-side WeChat capsule reserve area

Does not own:
- Session logic
- Voice logic
- Thinking logic

Inputs:
- Derived top bar display state
- Layout metrics
- User summary for future drawer entry state

Outputs:
- `menutap`

### `home-canvas`

Owns:
- Rendering `canvasItems`
- Welcome state card
- Structured content cards
- Selection and confirm action callbacks

Does not own:
- Toolbar logic
- Input mode logic

Inputs:
- `canvasItems`
- session state

Outputs:
- `itemaction`
- `prompttap`

### `home-toolbar`

Owns:
- Five primary buttons
- Highlight affordance only
- Expanded visual container for the composer

Does not own:
- Business state transitions
- Final composing behavior

Inputs:
- `activeTool`
- `panelState`
- `composer`
- `voice`

Outputs:
- `toolchange`
- `voiceholdstart`
- `voiceholdend`
- `voicetap`

### `home-overlay-panel`

Owns:
- More panel

Does not own:
- Canvas rendering
- Top bar state

Inputs:
- `panelState`
- `moreActions`

Outputs:
- `moreaction`

### `home-drawer`

Owns:
- Left-side drawer
- User profile footer
- Navigation entries for memory and tools

Required entries:
- Memory
- Skills
- Apps
- Vault

Footer:
- Avatar
- User name
- Profile/settings trigger

Outputs:
- `drawerclose`
- `drawerselect`
- `profiletap`

## Event Model

The page should transition state through explicit events.

Recommended event names:
- `NEW_SESSION`
- `OPEN_DRAWER`
- `CLOSE_DRAWER`
- `OPEN_TEXT_COMPOSER`
- `CLOSE_COMPOSER`
- `UPDATE_COMPOSER_TEXT`
- `SUBMIT_COMPOSER`
- `VOICE_HOLD_START`
- `VOICE_HOLD_END`
- `VOICE_HOLD_CANCEL_TO_EDIT`
- `VOICE_TAP_START`
- `VOICE_TAP_STOP`
- `OPEN_MORE_PANEL`
- `CLOSE_MORE_PANEL`
- `SELECT_MORE_ACTION`
- `OPEN_CAMERA`
- `CANVAS_ITEM_ACTION`
- `TRANSCRIPT_UPDATED`
- `ASSISTANT_RESPONSE_RECEIVED`
- `ASSISTANT_RESPONSE_FAILED`
- `CANVAS_ITEM_CONFIRMED`

Rules:
- Components emit UI events.
- The page maps events to state transitions.
- Side effects are triggered after state is valid.
- Text tool toggles composer expansion on and off.
- Collapsing composer preserves draft text unless a new session explicitly resets state.

## Interaction Flows

### Flow A: New Session

1. User taps new session.
2. Page emits `NEW_SESSION`.
3. Canvas clears current items.
4. Welcome item is restored.
5. Composer closes.
6. More panel closes.
7. Top bar returns to `ALOHA`.

### Flow B: Text Input

1. User taps text tool.
2. Page emits `OPEN_TEXT_COMPOSER`.
3. Toolbar expands into composer mode as one integrated control surface.
4. The expanded state is rendered as a single rounded rectangle with a soft internal separator between input content and control row.
5. User types text.
6. User submits.
7. Page emits `SUBMIT_COMPOSER`.
8. User prompt item may be represented internally, but UI remains card-based.
9. Assistant placeholder item enters `streaming`.
10. Top bar shows typing state.
11. Assistant item becomes `ready`.

Text toggle behavior:
- Tapping the text tool again collapses the composer.
- Collapsing the composer does not clear draft text.
- Reopening the composer restores the previous draft text.
- While the composer is open and voice is idle, the keyboard icon is highlighted.
- If the composer is closed, the keyboard icon is not highlighted even if draft text still exists.

### Flow C: Voice Hold

1. User presses and holds voice button.
2. Page emits `VOICE_HOLD_START`.
3. Composer opens.
4. `voice.mode = hold_recording`
5. Top bar shows listening state.
6. Transcript appears progressively in the shared composer.
7. On release:
   - emit `VOICE_HOLD_END`
   - if normal release, submit immediately
   - if upward cancel gesture, move to editable text mode

### Flow D: Voice Tap

1. User taps voice button.
2. Page emits `VOICE_TAP_START`.
3. `voice.mode = live_recording`
4. Composer opens.
5. Top bar shows listening state.
6. Second tap emits `VOICE_TAP_STOP`.
7. Voice mode stops and returns to editable composer state.
8. While voice recording is active, the microphone icon is highlighted instead of the keyboard icon.

### Flow E: More Panel

1. User taps more.
2. Page emits `OPEN_MORE_PANEL`.
3. More panel opens above toolbar.
4. Available actions:
   - Images / video
   - WeChat chat history
   - Files
   - Location
5. Selecting one action emits `SELECT_MORE_ACTION`.
6. In phase one, these actions are placeholders only and do not require real integration.

## First-Phase Deliverable

Phase one should implement the skeleton only.

Required in phase one:
- Single-page state model
- Derived top bar status
- Drawer skeleton
- Toolbar-integrated composer skeleton
- More panel skeleton
- New session clearing behavior
- Text composer open/close/send skeleton
- Voice mode state transitions without real STT backend
- Canvas item protocol and welcome item

Not required in phase one:
- Real AI request
- Real speech recognition
- Real annotation editor
- Real profile editing
- Real history page
- Real more-panel integrations

## Implementation Guardrails

- Do not fall back to a message-bubble feed
- Do not create separate text and voice input systems
- Do not let components maintain duplicate business state
- Do not make top bar state manually mutable inside `home-top-bar`
- Do not let toolbar directly mutate canvas business data
- Do not separate the long-term composer design from the toolbar visual system

## Suggested Build Order

1. Refactor homepage into a single root state model
2. Convert canvas rendering to `canvasItems`
3. Add derived top bar state
4. Add drawer component skeleton
5. Add shared composer panel skeleton
6. Add more panel integration
7. Implement new session behavior
8. Implement voice state transitions
9. Connect real service integrations later
