const MORE_ACTIONS = [
  { key: "media", label: "\u56fe\u7247/\u89c6\u9891", icon: "/images/icons/image.svg" },
  { key: "wechat", label: "\u5fae\u4fe1\u804a\u5929\u8bb0\u5f55", icon: "/images/icons/messages-square.svg" },
  { key: "file", label: "\u6587\u4ef6", icon: "/images/icons/file.svg" },
  { key: "location", label: "\u4f4d\u7f6e", icon: "/images/icons/map-pin.svg" },
];

const DRAWER_ENTRIES = [
  { key: "memory", label: "\u8bb0\u5fc6" },
  { key: "skills", label: "\u6280\u80fd" },
  { key: "apps", label: "\u5e94\u7528" },
  { key: "vault", label: "\u4fdd\u7ba1\u7bb1" },
];

function createWelcomeItem() {
  return {
    id: "welcome",
    type: "welcome",
    status: "ready",
    payload: {
      title: "Ready to assist",
      subtitle: Array(100).fill("This is a long line of text to test scrolling behavior.").join("\n"),
      chips: ["Draft a brief", "Analyze data"],
    },
    actions: [],
    meta: {
      source: "system",
    },
  };
}

function createAssistantTextItem(content, status) {
  return {
    id: `assistant-${Date.now()}`,
    type: "assistant_text",
    status: status || "ready",
    payload: {
      title: "ALOHA",
      subtitle: "",
      content,
      fields: [],
      choices: [],
      attachments: [],
    },
    actions: [],
    meta: {
      source: "assistant",
    },
  };
}

function createComposerFromPrompt(prompt) {
  return {
    mode: "text",
    text: prompt,
    placeholder: "Ask ALOHA anything",
    draftSegments: [],
  };
}

function createInitialState() {
  return {
    session: {
      id: `session-${Date.now()}`,
      status: "idle",
    },
    ui: {
      panelState: {
        drawerOpen: false,
        composerOpen: false,
        moreOpen: false,
      },
      composer: {
        mode: "idle",
        text: "",
        placeholder: "Ask ALOHA anything",
        draftSegments: [],
      },
      voice: {
        mode: "idle",
        isPressed: false,
        transcriptLive: "",
        canSlideToEdit: false,
      },
    },
    canvasItems: [createWelcomeItem()],
  };
}

Page({
  data: {
    session: createInitialState().session,
    ui: createInitialState().ui,
    canvasItems: createInitialState().canvasItems,
    topBar: {
      text: "ALOHA",
      mode: "idle",
    },
    toolbarVisual: {
      textActive: false,
      voiceActive: false,
      moreActive: false,
    },
    navMetrics: {
      statusBarHeight: 20,
      navHeight: 72,
      capsuleWidth: 120,
      capsuleHeight: 40,
      capsuleRight: 24,
    },
    moreActions: MORE_ACTIONS,
    drawerEntries: DRAWER_ENTRIES,
    user: {
      name: "Aloha User",
      avatarText: "A",
    },
  },

  onLoad() {
    this.syncNavMetrics();
    this.syncDerivedState();
  },

  onUnload() {
    this.clearAssistantTimer();
  },

  clearAssistantTimer() {
    if (this.assistantTimer) {
      clearTimeout(this.assistantTimer);
      this.assistantTimer = null;
    }
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

  deriveTopBarState(nextData) {
    const state = nextData || this.data;
    const voiceMode = state.ui.voice.mode;
    const hasStreamingItem = state.canvasItems.some((item) => item.status === "streaming");

    if (voiceMode === "hold_recording" || voiceMode === "live_recording") {
      return { text: "\u6b63\u5728\u542c", mode: "listening" };
    }

    if (state.session.status === "thinking" || hasStreamingItem) {
      return { text: "ALOHA \u6b63\u5728\u8f93\u5165", mode: "thinking" };
    }

    return { text: "ALOHA", mode: "idle" };
  },

  deriveToolbarVisual(nextData) {
    const state = nextData || this.data;
    const voiceMode = state.ui.voice.mode;
    const composerOpen = state.ui.panelState.composerOpen;
    const moreOpen = state.ui.panelState.moreOpen;
    const isTextEditing = state.ui.composer.mode === "text";

    return {
      textActive: !moreOpen && voiceMode === "idle" && composerOpen && isTextEditing,
      voiceActive: voiceMode === "hold_recording" || voiceMode === "live_recording",
      moreActive: moreOpen,
    };
  },

  syncDerivedState(nextPartial) {
    const nextState = {
      session: nextPartial && nextPartial.session ? nextPartial.session : this.data.session,
      ui: nextPartial && nextPartial.ui ? nextPartial.ui : this.data.ui,
      canvasItems: nextPartial && nextPartial.canvasItems ? nextPartial.canvasItems : this.data.canvasItems,
    };

    this.setData({
      topBar: this.deriveTopBarState(nextState),
      toolbarVisual: this.deriveToolbarVisual(nextState),
    });
  },

  commitState(patch) {
    const nextState = {
      session: patch.session || this.data.session,
      ui: patch.ui || this.data.ui,
      canvasItems: patch.canvasItems || this.data.canvasItems,
    };

    this.setData({
      session: nextState.session,
      ui: nextState.ui,
      canvasItems: nextState.canvasItems,
      topBar: this.deriveTopBarState(nextState),
      toolbarVisual: this.deriveToolbarVisual(nextState),
    });
  },

  handleMenuTap() {
    this.commitState({
      ui: {
        ...this.data.ui,
        panelState: {
          ...this.data.ui.panelState,
          drawerOpen: true,
        },
      },
    });
  },

  handleDrawerClose() {
    this.commitState({
      ui: {
        ...this.data.ui,
        panelState: {
          ...this.data.ui.panelState,
          drawerOpen: false,
        },
      },
    });
  },

  handleDrawerSelect(event) {
    const { label } = event.detail;
    this.handleDrawerClose();
    wx.showToast({
      title: `${label}\u9884\u7559\u4e2d`,
      icon: "none",
    });
  },

  handlePromptTap(event) {
    const { prompt } = event.detail;
    this.commitState({
      ui: {
        ...this.data.ui,
        panelState: {
          drawerOpen: false,
          composerOpen: true,
          moreOpen: false,
        },
        composer: createComposerFromPrompt(prompt),
        voice: {
          ...this.data.ui.voice,
          mode: "idle",
          isPressed: false,
          transcriptLive: "",
        },
      },
    });
  },

  handleToolChange(event) {
    const { tool } = event.detail;

    if (tool === "session") {
      this.handleNewSession();
      return;
    }

    if (tool === "text") {
      this.toggleTextComposer();
      return;
    }

    if (tool === "voice") {
      this.toggleVoiceTap();
      return;
    }

    if (tool === "camera") {
      this.commitState({
        ui: {
          ...this.data.ui,
          panelState: {
            ...this.data.ui.panelState,
            drawerOpen: false,
            moreOpen: false,
          },
        },
      });
      wx.showToast({
        title: "\u76f8\u673a\u80fd\u529b\u9884\u7559\u4e2d",
        icon: "none",
      });
      return;
    }

    if (tool === "more") {
      const nextOpen = !this.data.ui.panelState.moreOpen;
      this.commitState({
        ui: {
          ...this.data.ui,
          panelState: {
            drawerOpen: false,
            composerOpen: false,
            moreOpen: nextOpen,
          },
          composer: nextOpen
            ? { ...this.data.ui.composer, mode: "idle" }
            : this.data.ui.composer,
          voice: {
            ...this.data.ui.voice,
            mode: "idle",
            isPressed: false,
          },
        },
      });
    }
  },

  toggleTextComposer() {
    const nextOpen = !this.data.ui.panelState.composerOpen;

    this.commitState({
      ui: {
        ...this.data.ui,
        panelState: {
          drawerOpen: false,
          composerOpen: nextOpen,
          moreOpen: false,
        },
        composer: {
          ...this.data.ui.composer,
          mode: "text",
          placeholder: "Ask ALOHA anything",
        },
        voice: {
          ...this.data.ui.voice,
          mode: "idle",
          isPressed: false,
          transcriptLive: "",
        },
      },
    });
  },

  handleVoiceHoldStart() {
    this.commitState({
      ui: {
        ...this.data.ui,
        panelState: {
          drawerOpen: false,
          composerOpen: true,
          moreOpen: false,
        },
        composer: {
          ...this.data.ui.composer,
          mode: "text",
          text: this.data.ui.composer.text,
        },
        voice: {
          mode: "hold_recording",
          isPressed: true,
          transcriptLive: "\u6b63\u5728\u542c\u5199\u2026",
          canSlideToEdit: true,
        },
      },
    });
  },

  handleVoiceHoldEnd() {
    const currentText = this.data.ui.composer.text || "\u8bf7\u5e2e\u6211\u8bb0\u4e00\u4e0b\u4eca\u5929\u7684\u4f1a\u8bae\u91cd\u70b9";
    this.commitState({
      ui: {
        ...this.data.ui,
        panelState: {
          ...this.data.ui.panelState,
          composerOpen: false,
          moreOpen: false,
        },
        composer: {
          ...this.data.ui.composer,
          mode: "text",
          text: currentText,
          draftSegments: [],
        },
        voice: {
          mode: "idle",
          isPressed: false,
          transcriptLive: "",
          canSlideToEdit: false,
        },
      },
    });

    this.simulateAssistantReply(currentText);
  },

  toggleVoiceTap() {
    const isLiveRecording = this.data.ui.voice.mode === "live_recording";

    if (isLiveRecording) {
      this.commitState({
        ui: {
          ...this.data.ui,
          panelState: {
            ...this.data.ui.panelState,
            composerOpen: true,
            moreOpen: false,
          },
          composer: {
            ...this.data.ui.composer,
            mode: "text",
            text: this.data.ui.composer.text,
          },
          voice: {
            mode: "idle",
            isPressed: false,
            transcriptLive: "",
            canSlideToEdit: false,
          },
        },
      });
      return;
    }

    this.commitState({
      ui: {
        ...this.data.ui,
        panelState: {
          drawerOpen: false,
          composerOpen: true,
          moreOpen: false,
        },
        composer: {
          ...this.data.ui.composer,
          mode: "text",
          text: this.data.ui.composer.text,
        },
        voice: {
          mode: "live_recording",
          isPressed: false,
          transcriptLive: "\u5b9e\u65f6\u8f6c\u5199\u4e2d",
          canSlideToEdit: true,
        },
      },
    });
  },

  handleComposerInput(event) {
    const { value } = event.detail;
    this.commitState({
      ui: {
        ...this.data.ui,
        composer: {
          ...this.data.ui.composer,
          mode: "text",
          text: value,
        },
      },
    });
  },

  handleComposerSubmit() {
    const content = (this.data.ui.composer.text || "").trim();

    if (!content) {
      wx.showToast({
        title: "\u8bf7\u5148\u8f93\u5165\u5185\u5bb9",
        icon: "none",
      });
      return;
    }

    this.commitState({
      ui: {
        ...this.data.ui,
        panelState: {
          ...this.data.ui.panelState,
          composerOpen: false,
          moreOpen: false,
        },
        composer: {
          ...this.data.ui.composer,
          mode: "text",
          text: "",
          draftSegments: [],
        },
        voice: {
          mode: "idle",
          isPressed: false,
          transcriptLive: "",
          canSlideToEdit: false,
        },
      },
    });

    this.simulateAssistantReply(content);
  },

  handleMoreAction(event) {
    const { label } = event.detail;

    this.commitState({
      ui: {
        ...this.data.ui,
        panelState: {
          ...this.data.ui.panelState,
          moreOpen: false,
        },
      },
    });

    wx.showToast({
      title: `${label}\u9884\u7559\u4e2d`,
      icon: "none",
    });
  },

  handleNewSession() {
    this.clearAssistantTimer();
    const initial = createInitialState();

    this.commitState({
      session: {
        ...initial.session,
        id: `session-${Date.now()}`,
      },
      ui: initial.ui,
      canvasItems: initial.canvasItems,
    });
  },

  simulateAssistantReply(content) {
    this.clearAssistantTimer();

    this.commitState({
      session: {
        ...this.data.session,
        status: "thinking",
      },
      canvasItems: [createAssistantTextItem("\u6b63\u5728\u6574\u7406\u56de\u590d\u2026", "streaming")],
    });

    this.assistantTimer = setTimeout(() => {
      this.commitState({
        session: {
          ...this.data.session,
          status: "idle",
        },
        canvasItems: [
          createAssistantTextItem(
            `\u5df2\u6536\u5230\uff1a${content}\n\n\u8fd9\u662f\u9996\u9875\u4ea4\u4e92\u9aa8\u67b6\u7684\u6a21\u62df\u56de\u590d\u3002\u540e\u7eed\u8fd9\u91cc\u4f1a\u63a5\u5165\u771f\u5b9e\u7684 ALOHA \u56de\u590d\u5361\u7247\u6d41\u3002`,
            "ready"
          ),
        ],
      });
    }, 900);
  },
});
