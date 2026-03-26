Component({
  properties: {
    open: {
      type: Boolean,
      value: false,
    },
    entries: {
      type: Array,
      value: [],
    },
    user: {
      type: Object,
      value: {},
    },
  },

  methods: {
    onMaskTap() {
      this.triggerEvent("drawerclose");
    },

    onEntryTap(event) {
      const { key, label } = event.currentTarget.dataset;
      this.triggerEvent("drawerselect", { key, label });
    },
  },
});
