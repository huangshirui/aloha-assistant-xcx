Component({
  properties: {
    title: {
      type: String,
      value: "ALOHA",
    },
    statusText: {
      type: String,
      value: "",
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
