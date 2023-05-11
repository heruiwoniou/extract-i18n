const vscode = require("vscode");

let config;

// eslint-disable-next-line no-unused-vars
function Config(ctx) {
  if (!config) {
    config = {
      runtimeConfig: {
        prefix:
          vscode.workspace.getConfiguration().get("extract-i18n.prefix") ||
          "extract-i18n",
        target: vscode.workspace
          .getConfiguration()
          .get("extract-i18n.target") || ["en", "zh"],
        template:
          vscode.workspace.getConfiguration().get("extract-i18n.template") ||
          't("{{key}}")',
      },
      pattern:
        vscode.workspace.getConfiguration().get("extract-i18n.pattern") ||
        "**/locales",
      langs:
        vscode.workspace.getConfiguration().get("extract-i18n.langsMap") || {},
      locales: [],
    };
  }

  return config;
}

Config.update = (key, value) => {
  if (config) {
    config.runtimeConfig[key] = value;
  }
};

module.exports = Config;
