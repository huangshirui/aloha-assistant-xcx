const DEFAULT_STATUS = "ALOHA";

const TOOL_CONFIG = {
  session: {
    title: "Ready to assist",
    subtitle: "Tap below to begin your creative session.",
    hint: "",
    chips: ["Draft a brief", "Map workflow"],
    inputMode: "canvas",
  },
  text: {
    title: "Text input standby",
    subtitle: "A focused writing lane is prepared for structured prompts.",
    hint: "Text composer interface reserved.",
    chips: ["Start outlining", "Refine prompt"],
    inputMode: "text",
  },
  voice: {
    title: "Voice capture standby",
    subtitle: "Hands-free capture is ready for spoken notes and fast ideation.",
    hint: "Voice session state reserved.",
    chips: ["Record idea", "Summarize audio"],
    inputMode: "voice",
  },
  camera: {
    title: "Camera intake standby",
    subtitle: "Visual input can be attached here for analysis or extraction.",
    hint: "Camera and image card hooks reserved.",
    chips: ["Scan document", "Inspect visual"],
    inputMode: "camera",
  },
  more: {
    title: "Workspace extensions",
    subtitle: "Additional tools are available from the dock without breaking focus.",
    hint: "",
    chips: [],
    inputMode: "more",
  },
};

const MORE_ACTIONS = [
  { key: "wechat", label: "\u5fae\u4fe1\u804a\u5929\u8bb0\u5f55", icon: "/images/icons/messages-square.svg" },
  { key: "media", label: "\u56fe\u7247/\u89c6\u9891", icon: "/images/icons/image.svg" },
  { key: "file", label: "\u6587\u4ef6", icon: "/images/icons/file.svg" },
  { key: "location", label: "\u4f4d\u7f6e", icon: "/images/icons/map-pin.svg" },
];

Page({
  data: {
    title: "ALOHA",
    statusText: DEFAULT_STATUS,
    activeTool: "",
    activeToolMeta: TOOL_CONFIG.session,
    navMetrics: {
      statusBarHeight: 20,
      navHeight: 72,
      capsuleWidth: 120,
      capsuleHeight: 40,
      capsuleRight: 24,
    },
    canvasState: {
      mode: "idle",
      cardType: "welcome",
    },
    moreActions: MORE_ACTIONS,
    isMoreOpen: false,
  },

  onLoad() {
    this.syncNavMetrics();
  },

  syncNavMetrics() {
    const systemInfo = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
    const capsule = wx.getMenuButtonBoundingClientRect
      ? wx.getMenuButtonBoundingClientRect()
      : null;

    if (!capsule) {
      return;
    }

    const navHeight = capsule.bottom + capsule.top - systemInfo.statusBarHeight;
    const capsuleRight = systemInfo.windowWidth - capsule.right;

    this.setData({
      navMetrics: {
        statusBarHeight: systemInfo.statusBarHeight,
        navHeight,
        capsuleWidth: capsule.width,
        capsuleHeight: capsule.height,
        capsuleRight,
      },
    });
  },

  handleToolChange(event) {
    const { tool } = event.detail;
    const nextMeta = TOOL_CONFIG[tool] || TOOL_CONFIG.session;

    this.setData({
      activeTool: tool,
      activeToolMeta: nextMeta,
      statusText: DEFAULT_STATUS,
      canvasState: {
        mode: nextMeta.inputMode,
        cardType: tool,
      },
      isMoreOpen: tool === "more",
    });
  },

  handlePromptTap(event) {
    const { prompt } = event.detail;

    this.setData({
      statusText: DEFAULT_STATUS,
      canvasState: {
        mode: this.data.canvasState.mode,
        cardType: this.data.canvasState.cardType,
        lastPrompt: prompt,
      },
    });
  },

  handleMoreAction(event) {
    const { key, label } = event.detail;
    this.setData({
      isMoreOpen: true,
      canvasState: {
        mode: "more",
        cardType: key,
        lastPrompt: label,
      },
    });
    wx.showToast({
      title: `${label}\u9884\u7559\u4e2d`,
      icon: "none",
    });
  },

  handleMenuTap() {
    wx.showToast({
      title: "Menu reserved",
      icon: "none",
    });
  },
});
