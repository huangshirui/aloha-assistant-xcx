# ALOHA Homepage Test Reference

Use this file only when the task is about the current homepage or when you need concrete anchors for automator coverage.

## Routes

- Main page: `pages/index/index`
- Example page: `pages/example/index`

Read route registration from `miniprogram/app.json`.

## Core Files

- Page logic: `miniprogram/pages/index/index.js`
- Page template: `miniprogram/pages/index/index.wxml`
- Toolbar template: `miniprogram/components/home-toolbar/index.wxml`
- Drawer template: `miniprogram/components/home-drawer/index.wxml`
- More panel template: `miniprogram/components/home-overlay-panel/index.wxml`
- Canvas template: `miniprogram/components/home-canvas/index.wxml`
- Top bar template: `miniprogram/components/home-top-bar/index.wxml`
- Behavior spec: `HOMEPAGE_INTERACTION_SPEC.md`
- Visual/layout spec: `HOMEPAGE_SPEC.md`

## Current Homepage Model

The homepage is a single-route state machine.

The page owns:
- `session`
- `ui.panelState`
- `ui.composer`
- `ui.voice`
- `canvasItems`
- derived `topBar`
- derived `toolbarVisual`

The most important regression risk is mismatch between derived UI state and the actual visible component state.

## Primary User Flows

### Drawer

Expected path:
- tap top-left menu
- drawer opens
- tap an entry or the mask
- drawer closes

Observable signals:
- `home-drawer` exists only when `open` is true
- title text `Workspace`
- entry labels `记忆`, `技能`, `应用`, `保管箱`

### Welcome Chip To Composer

Expected path:
- welcome card is present on a fresh session
- chip tap triggers `handlePromptTap`
- composer opens
- textarea is prefilled from the chip text

Observable signals:
- welcome title `Ready to assist`
- chip text like `Draft a brief` or `Analyze data`
- composer textarea value equals tapped chip text

### Text Composer

Expected path:
- tap keyboard tool
- composer opens
- input text
- tap send
- composer closes
- assistant placeholder shows streaming state
- final assistant text is rendered after timer completion

Observable signals:
- textarea placeholder `Ask ALOHA anything`
- empty submit shows toast `请先输入内容`
- final rendered content starts with `已收到：`

### Voice Hold

Expected path:
- long-press voice button
- top bar changes to listening state
- release ends recording
- composer closes
- assistant reply simulation runs

Observable signals:
- top-bar status text `正在听`
- temporary live transcript text `正在听写…`
- final composer text defaults to `请帮我记一下今天的会议重点` when empty

### Voice Tap

Expected path:
- tap voice button once
- live recording starts
- tap again
- recording stops and composer stays open in text mode

Observable signals:
- live transcript `实时转写中`
- microphone active icon state
- composer remains visible after stop

### More Panel

Expected path:
- tap more button
- overflow panel opens
- select one action
- panel closes
- placeholder toast appears

Observable labels:
- `图片/视频`
- `微信聊天记录`
- `文件`
- `位置`

### New Session

Expected path:
- create some temporary state
- tap new session
- state resets
- welcome card returns

Observable signals:
- one welcome card with `Ready to assist`
- top bar returns to `ALOHA`
- composer closes
- more panel closes

## Fallback Selector Anchors

These are current template anchors. Treat them as fallback selectors, not permanent contracts.

### Top Bar

- `.menu-button`
- `.brand-block__title`

### Toolbar

- `.toolbar__item[data-tool="session"]`
- `.toolbar__item[data-tool="text"]`
- `.toolbar__item[data-tool="voice"]`
- `.toolbar__item[data-tool="camera"]`
- `.toolbar__item[data-tool="more"]`
- `.toolbar-composer__textarea`
- `.toolbar-composer__send`

### Drawer

- `.drawer-shell`
- `.drawer-mask`
- `.drawer-panel`
- `.drawer-panel__entry`

### More Panel

- `.overlay-panel`
- `.overlay-panel__action`
- `.overlay-panel__label`

### Canvas

- `.canvas__card--welcome`
- `.canvas__chip`
- `.canvas__card--assistant`
- `.canvas__assistant-text`

If a requested test will live for more than a short debugging session, add explicit stable hooks in WXML instead of relying only on these selectors.

## Good First Automation Targets

Start with these in order:

1. Fresh session renders welcome card.
2. Text tool opens and closes composer without clearing draft text.
3. Welcome chip pre-fills composer.
4. Submit text and verify assistant response rendering.
5. More panel opens and closes.
6. Drawer opens and closes.
7. New session resets page state.

Add voice coverage after the basic text flow is stable because long-press handling is usually more timing-sensitive.

## Known Implementation Details

- The page simulates assistant output with a `setTimeout(..., 900)`.
- `handleComposerSubmit` trims input and blocks empty submissions.
- `handleDrawerSelect`, `handleMoreAction`, and camera selection currently show placeholder toasts.
- The top bar text is derived from `voice.mode`, `session.status`, and `canvasItems`.
- The toolbar active styles are derived from `toolbarVisual`, not directly from button taps.

## Recommended Testability Patches

If you need to harden automation, prefer adding:
- stable ids to the five toolbar buttons
- stable ids to the menu button, drawer mask, and each welcome chip
- stable ids to the composer textarea and send button
- stable ids or data hooks to the more-panel actions
- optional `data-testid` or equivalent hooks on status text and assistant cards

Keep names semantic, for example:
- `toolbar-text`
- `toolbar-voice`
- `topbar-status`
- `welcome-chip-draft-brief`
- `composer-send`
