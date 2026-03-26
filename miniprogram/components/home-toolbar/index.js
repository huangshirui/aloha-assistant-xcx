Component({
  properties: {
    toolbarVisual: {
      type: Object,
      value: {},
    },
    panelState: {
      type: Object,
      value: {},
    },
    composer: {
      type: Object,
      value: {},
    },
    voice: {
      type: Object,
      value: {},
    },
  },

  data: {
    voiceHolding: false,
  },

  methods: {
    onToolTap(event) {
      const { tool } = event.currentTarget.dataset;

      if (tool === "voice" && this.data.voiceHolding) {
        return;
      }

      this.triggerEvent("toolchange", { tool });
    },

    onVoiceHoldStart() {
      this.setData({
        voiceHolding: true,
      });
      this.triggerEvent("voiceholdstart");
    },

    onVoiceHoldEnd() {
      if (!this.data.voiceHolding) {
        return;
      }

      this.setData({
        voiceHolding: false,
      });
      this.triggerEvent("voiceholdend");
    },

    onComposerInput(event) {
      this.triggerEvent("composerinput", { value: event.detail.value });
    },

    onComposerSubmit() {
      this.triggerEvent("composersubmit");
    },
  },
});
