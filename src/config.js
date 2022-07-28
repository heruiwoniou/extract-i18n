module.exports = {
  runtimeConfig: {
    pattern: "**/locale",
    prefix: "extract-i18n.",
    target: ["en", "zh"],
    template: 't("{{key}}")',
    locales: [],
  },
  langs: {
    zh: "zh-cn",
  },
};
