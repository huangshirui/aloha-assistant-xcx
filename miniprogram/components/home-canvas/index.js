Component({
  properties: {
    meta: {
      type: Object,
      value: {},
    },
    state: {
      type: Object,
      value: {},
    },
  },

  methods: {
    onPromptTap(event) {
      const { prompt } = event.currentTarget.dataset;
      this.triggerEvent("prompttap", { prompt });
    },
  },
});
