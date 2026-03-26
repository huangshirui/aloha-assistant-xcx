---
name: wechat-miniprogram-automator-testing-aloha
description: WeChat Mini Program automation testing and regression skill for the current ALOHA repository. Use when Codex needs to design, implement, debug, or run end-to-end tests with miniprogram-automator and WeChat DevTools CLI, add stable selectors for testability, investigate homepage interaction regressions, or produce E2E test reports for pages/index/index and related components.
---

# WeChat Mini Program Automator Testing For ALOHA

Use this skill to build stable end-to-end coverage for the current ALOHA WeChat Mini Program.

Start from the real project structure, not a generic mini program template. Read [references/aloha-homepage.md](references/aloha-homepage.md) before writing or debugging homepage tests.

## Work From This Order

1. Confirm scope.
   Decide whether the request is about homepage state transitions, page routing, placeholder capability panels, or infrastructure setup.

2. Read the minimum local context.
   For homepage work, read:
   - `project.config.json`
   - `miniprogram/app.json`
   - `miniprogram/pages/index/index.js`
   - `miniprogram/pages/index/index.wxml`
   - `references/aloha-homepage.md`

3. Verify prerequisites before touching E2E code.
   Check:
   - `project.config.json` exists at repo root
   - WeChat DevTools automation port or CLI auto mode is available
   - Node package management is available in the environment
   - `miniprogram-automator` is installed or needs to be added

4. Prefer testability fixes before brittle tests.
   If the target interaction lacks a stable selector or observable state anchor, patch the mini program first.
   Prefer durable hooks on tappable or asserted elements:
   - `id`
   - stable `data-*` attributes
   - explicit text labels only when the label is product-stable
   Avoid selectors that depend on visual nesting depth or cosmetic class names when a stronger hook can be added cheaply.

5. Keep coverage narrow and high value.
   Cover a few critical paths well instead of trying to automate every UI affordance.
   For this repository, prioritize homepage flows over the `pages/example/index` demo page unless the user explicitly asks otherwise.

## Choose The Right Test Shape

Use three layers:

1. Fast logic checks first.
   If a bug is in page-state transitions or pure helpers, fix or add the smallest possible local verification before opening DevTools.

2. Component-facing checks second.
   If a behavior can be verified by inspecting page data changes or a single component contract, do that before full E2E.

3. Automator E2E last.
   Use automator only for flows that require the real runtime:
   - toolbar interactions
   - drawer open/close
   - composer open/input/submit
   - voice mode state transitions
   - more-panel open/select
   - top-bar derived status changes

## Use One Of Two Connection Modes

Use `launch` when you want one command to start and connect DevTools.

Use `connect` when DevTools is already running in CLI auto mode and you want to reuse the open instance.

If the repository does not yet contain a runner, create one small entry point instead of scattering ad hoc scripts.
Prefer names like:
- `scripts/run-mini-e2e.js`
- `tests/e2e/homepage.spec.js`

## Design Cases Around The Homepage State Machine

Model each test around a user-visible state transition, not around implementation trivia.

Good cases for this repository:
- open drawer from the top-left menu and close it by mask tap
- tap a welcome chip and verify the composer opens with prefilled text
- toggle the text tool open and closed without losing draft text
- submit text and verify the assistant placeholder enters streaming then ready state
- long-press voice, release, and verify listening state returns to idle
- tap voice to enter live recording, tap again to stop, and verify the composer stays editable
- open the more panel and select one placeholder action
- create a new session and verify the welcome card is restored

Do not treat placeholder toast behavior as deep business validation. Validate that the intended control path fires and that the page returns to a coherent state.

## Prefer Observable Assertions

Assert on user-visible or runtime-stable outputs:
- page route
- visible text
- textarea value
- drawer visibility
- panel visibility
- top-bar status text
- count and type of canvas cards

When a flow is driven by `setData`, inspect rendered output first. Read page data directly only when the rendered output is insufficient or unstable.

## Failure Handling

On failure, capture:
- failing step name
- current page path
- selector or text you expected
- screenshot if available
- console or exception logs if available

Retry only infrastructure failures such as:
- launch/connect timeout
- blank runtime
- DevTools attach failure

Do not automatically retry business assertions.

## Reporting

When the user asks for a report, include:
- scope and environment
- covered paths
- pass/fail summary
- highest-risk findings
- missing automation hooks
- artifact paths

Prefer storing reports under `docs/test-reports/` unless the repository already uses another test-report folder.

## Project-Specific Reference

Use [references/aloha-homepage.md](references/aloha-homepage.md) for the current homepage structure, route list, fallback selectors, and recommended first-pass cases.
