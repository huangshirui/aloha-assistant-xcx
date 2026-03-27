# 视觉风格重构计划：从 "Light Paper" 到 "Digital Ethereal"

## 1. 目标描述与范围
将当前基于 `HOMEPAGE_SPEC.md` 的浅色系“纸张”设计风格，在**完全不改变**现有页面结构和交互逻辑（单页状态机、画布流、浮动工具栏模式）的前提下，重构为 `DESIGN.md` 中定义的“数字空灵（The Digital Ethereal）”深色高级质感风格。此重构仅涉及 CSS 变量更替、WXSS 类的更新和少量结构/内联样式的清理，不涉及 JS 业务逻辑如状态流转或功能增减。

## 2. 核心视觉变更归纳
- **全局色彩模式翻转**：从浅色主题（`#f8f9fa` 纸张背景，`#1A1C2E` 深色墨水文字）切换为沉浸式深海主题（`#0b0e14` 深背景，搭配 `#8ff5ff` 高亮强调色）。
- **去除所有实线边框 (The "No-Line" Rule)**：所有原有的 `1px solid` 边框、分割线必须废除。视觉边界通过背景色阶差（Surface Hierarchy）、空间留白（Spacing Scale）和渐变来区分。
- **全局采用毛玻璃质感 (Glassmorphism)**：所有弹窗、浮动工具栏、面板背景等浮层元素，摒弃纯色覆盖，改用半透明带背景模糊（`backdrop-filter: blur`）。
- **字体与排版权威感 (Typography)**：引入 `Plus Jakarta Sans` 用于头部展示大字（Display/Headline），用 `Inter` 替换普通文本和标签（Title/Body/Label）。
- **重定义空间高度与阴影 (Tonal Layering)**：弃用传统的重灰阴影。改用暗色“内陷”效果（嵌套 `surface-container-lowest`）或亮色漂浮的“微光投影”（包含 `surface-tint`，低透明度且大半径模糊）。

## 3. 按组件重构方案 (自顶向下)

我们将重构分为全局基础设施建设和局部组件的逐个击破：

### 阶段一：全局基础设施 (Global Tokens & app.wxss)
- **建立色板变量**：在全局配置好 `--surface: #0b0e14;`、`--surface-container-low: #10131a;`、`--surface-container-high: #1c2028;`、`--surface-bright: #282c36;`。
- **建立字体类**：全局引入字库。设定 `.display-lg`、`.headline-md`、`.title-lg`、`.body-lg`、`.label-md` 的字号、字宽参数，强制不使用纯白（保留最高 `#ecedf6` 于 `--on-surface` 文字）。

### 阶段二：局部视图的重装 (Views & Components)

#### 1. 顶部状态栏 (home-top-bar)
- 原先：保留系统原生带左侧菜单触发器形态。
- **调整**：
  - 提取背景为 `--surface` 或跟随内容的完全透明玻璃态。
  - "ALOHA" 标题必须使用 `.title-lg` (`Inter` 500, `#ecedf6`)，保持绝对剧中。
  - 右侧/左侧图标改为 24px 极简描边，使用 `.outline` 色值。
  - “思考中”状态指示器原使用普通圆点，改用基于 `--primary` (`#8ff5ff`) 的微光律动（Pulse）动画。

#### 2. 中央交互画布 (home-canvas)
- 原先：背景为 `#f1f4f5` 表盘风格，卡片白色 `#ffffff`。
- **调整**：
  - **画板底色**：变更为深邃的 `--surface` (`#0b0e14`)。
  - **消息与卡片**：
    - 去除四周方角，所有内容应用圆角约束（不低于 1.5rem / 24px）。
    - 绝不允许使用分隔横线，改用增大段落间距（`spacing-6`）。
    - **系统/AI 回复**：摒弃白底，增加轻柔渐变（`surface-container-low` 到 `surface-container-highest`）。
    - **用户气泡**：底色调为 `secondary-container` 并居右。
  - **选项胶囊 (Action Chips)**：由方框按钮改为全面圆角 (`rounded-full`)，外覆 `surface-container-high`，悬停或触发时附加 `surface-bright` 层以产生抬升感。

#### 3. 浮动工具栏与输入舱 (home-toolbar & home-composer)
- 原先：独立底部浮动带状矩形区，主动作无特别光泽。
- **调整为“浮动输入舱 (Floating Input Capsule)”**：
  - **形状与材质**：外轮廓变为终极圆角药丸形 (`rounded-full`)。背景注入玻璃态魔法（`surface-variant` 透明度 40% + 模糊 `blur(32px)`）。
  - **高级阴影**：不再有黑色投影。改用注入了 `--primary` 蓝色调（5% 不透明度），且 Y 轴极低、极其发散模糊的光晕阴影。
  - **聚焦态**：当它展开成文本输入（composer 模式）时，边框赋予一层 20% 透明度的 `outline` 软发光，拒绝传统细线边框。
  - **高亮元素**：当前激活的主体按钮（如有）使用 `primary` (#8ff5ff) 到 `primary-container` (#00eefc) 单角度（135度）线性渐变，增添“赛博机能”的呼吸感。

#### 4. 浮层菜单/抽屉 (home-drawer & home-overlay-panel)
- **调整**：
  - 替换之前的所有白色背景卡片，面板底色统一采用带毛玻璃质感的 `--surface-container` 之类叠加色，并可能带有幽灵边框（`outline-variant` 15% 透明度）来区分层叠高度。
  - 确保内部文本的纯白色一律降级到 `on-surface`，以维护护眼需求。

## 4. 后续落地步骤 (Action Items)
如果在接下来的对话中，我们需要在不影响已有功能的情况下实施这段 UI 改造，建议步骤：
1. **注入基础设施**：在 `app.wxss` 中加盖这些 CSS Custom Properties (颜色、毛玻璃 mixin 等)。
2. **重铸 Page**：将主控页面 (`index.wxml`/`index.wxss`) 的全屏底色、字体等全局继承更改。
3. **清洗分步组件**：
   - 更新 `home-top-bar.wxss`
   - 更新 `home-canvas.wxss` 和内嵌 Card UI
   - 更新 `home-toolbar.wxss` (胶囊化和发光特效)
   - 更新其他面板（如抽屉菜单 `home-drawer`）
4. 校验 `project.config` 或运行时中对系统原生深浅色跟随的功能是否会导致样式突变（在小程序框架中可直接将 `.json` 设为固定暗色模式，或者在 `app.wxss` 中固定 `:root` 色彩，不再写两套以贴合此特殊质感）。
