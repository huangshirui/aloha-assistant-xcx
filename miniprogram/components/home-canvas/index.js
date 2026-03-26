Component({
  properties: {
    canvasItems: {
      type: Array,
      value: [],
    },
  },

  methods: {
    onPromptTap(event) {
      const { prompt } = event.currentTarget.dataset;
      this.triggerEvent("prompttap", { prompt });
    },
  },
});
