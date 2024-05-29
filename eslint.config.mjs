import unjs from "eslint-config-unjs";

export default unjs({
  ignores: [
    // ignore paths
  ],
  rules: {
    "no-this-in-static": ["off", false],
  },
  markdown: {
    rules: {
      // markdown rule overrides
    },
  },
});
