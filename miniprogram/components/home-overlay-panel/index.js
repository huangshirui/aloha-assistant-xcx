Component({
  properties: {
    panelState: {
      type: Object,
      value: {},
    },
    moreActions: {
      type: Array,
      value: [],
    },
  },

  methods: {
    onMoreActionTap(event) {
      const { key, label } = event.currentTarget.dataset;
      this.triggerEvent("moreaction", { key, label });
    },
  },
});
