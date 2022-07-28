// eslint-disable-next-line no-unused-vars
const vscode = require("vscode");
const actions = require("./actions");
const startWatch = require("./watch");

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
  await startWatch(context);
  actions.map((action) => action(context));
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
