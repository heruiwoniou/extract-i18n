// eslint-disable-next-line no-unused-vars
const vscode = require("vscode");
const actions = require("./actions");
const startWatch = require("./watch");
const { watchConfig } = require("./config");

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
  await startWatch(context);
  watchConfig();
  actions.map((action) => action(context));
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
