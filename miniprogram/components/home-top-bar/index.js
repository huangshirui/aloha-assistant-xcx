Component({
  properties: {
    statusText: {
      type: String,
      value: "ALOHA",
    },
    statusMode: {
      type: String,
      value: "idle",
    },
    metrics: {
      type: Object,
      value: {},
    },
  },

  methods: {
    onMenuTap() {
      this.triggerEvent("menutap");
    },
  },
});
