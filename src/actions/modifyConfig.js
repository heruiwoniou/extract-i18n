const vscode = require("vscode");
const Config = require("../config");

// eslint-disable-next-line no-unused-vars
async function ModifyPrefix(ctx) {
  const config = Config(ctx);
  const value = await vscode.window.showInputBox({
    title: "Modify prefix",
    value: config.runtimeConfig.prefix,
  });

  if (value) {
    Config.update("prefix", value);
  }
}
// eslint-disable-next-line no-unused-vars
async function ModifyTarget(ctx) {
  const config = Config(ctx);
  const value = await vscode.window.showInputBox({
    title: "Modify target",
    value: JSON.stringify(config.runtimeConfig.target),
  });

  if (value) {
    Config.update("target", JSON.parse(value));
  }
}
// eslint-disable-next-line no-unused-vars
async function ModifyTemplate(ctx) {
  const config = Config(ctx);
  const value = await vscode.window.showInputBox({
    title: "Modify template",
    value: JSON.stringify(config.runtimeConfig.template),
  });

  if (value) {
    Config.update("template", value);
  }
}

module.exports = (ctx) => {
  ctx.subscriptions.push(
    vscode.commands.registerCommand("extract-i18n.modifyPrefix", () =>
      ModifyPrefix(ctx)
    )
  );
  ctx.subscriptions.push(
    vscode.commands.registerCommand("extract-i18n.modifyTarget", () =>
      ModifyTarget(ctx)
    )
  );
  ctx.subscriptions.push(
    vscode.commands.registerCommand("extract-i18n.modifyTemplate", () =>
      ModifyTemplate(ctx)
    )
  );
};
