Component({
  properties: {
    activeTool: {
      type: String,
      value: "session",
    },
    showMore: {
      type: Boolean,
      value: false,
    },
    moreActions: {
      type: Array,
      value: [],
    },
  },

  methods: {
    onToolTap(event) {
      const { tool } = event.currentTarget.dataset;
      this.triggerEvent("toolchange", { tool });
    },

    onMoreActionTap(event) {
      const { key, label } = event.currentTarget.dataset;
      this.triggerEvent("moreaction", { key, label });
    },
  },
});
