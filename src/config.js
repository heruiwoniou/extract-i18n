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
      directory:
        vscode.workspace.getConfiguration().get("extract-i18n.directory") ||
        "locales",
      langs:
        vscode.workspace.getConfiguration().get("extract-i18n.langsMap") || {},
      locales: [],
    };
  }

  return config;
}

Config.update = (key, value, isBase = false) => {
  if (config) {
    if (!isBase) {
      config.runtimeConfig[key] = value;
    } else {
      config[key] = value;
    }
  }
};

module.exports = Config;
module.exports.watchConfig = () => {
  vscode.workspace.onDidChangeConfiguration((event) => {
    [
      { name: "prefix", isBase: false },
      { name: "target", isBase: false },
      { name: "template", isBase: false },
      { name: "directory", isBase: true },
      { name: "langsMap", key: "langs", isBase: true },
    ].forEach((item) => {
      if (event.affectsConfiguration(`extract-i18n.${item.name}`)) {
        const key = item.key || item.name;
        const isBase = item.isBase;
        const value = vscode.workspace
          .getConfiguration()
          .get(`extract-i18n.${item.name}`);
        Config.update(key, value, isBase);
      }
    });
  });
};
