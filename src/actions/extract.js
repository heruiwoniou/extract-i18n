const vscode = require("vscode");
const translate = require("translate-google");
const fs = require("fs-extra");
const camelCase = require("camelcase");
const Config = require("../config");

// eslint-disable-next-line no-unused-vars
async function Extract(ctx) {
  const config = Config(ctx);
  try {
    const editor = vscode.window.activeTextEditor;
    const doc = editor.document;
    const selection = editor.selection;
    const extractText = doc
      .getText(editor.selection)
      .replace(/((^['"\s]+)|(['"\s]+$))/, "");

    const commonKey = await translate(extractText, { to: "en" });

    let paths = vscode.window.activeTextEditor.document.fileName.split("/");
    paths = paths.slice(0, paths.length - 1);
    let localePath;

    do {
      localePath = config.locales.find((o) => o.indexOf(paths.join("/")) > -1);
      if (localePath) {
        break;
      }
      paths.pop();
    } while (paths.length !== 0);

    if (!localePath) {
      vscode.window.showErrorMessage("Can't find locale path!");
    }

    const transKey = `${config.runtimeConfig.prefix}.${camelCase(commonKey)}`;

    await Promise.all(
      config.runtimeConfig.target.map(async (target) => {
        const [type] = target.split("-");
        const transText = await translate(extractText, {
          to: config.langs[type] || type,
        });
        const targetPath = `${localePath}/locales/${target}.json`;
        if (!(await fs.pathExists(targetPath))) {
          await fs.outputFile(targetPath, "{}");
        }
        const locale = await fs.readJson(targetPath);
        locale[transKey] = transText;
        await fs.writeJson(targetPath, locale, { spaces: 2 });
      })
    );
    editor.edit((editBuilder) => {
      editBuilder.replace(
        selection,
        config.runtimeConfig.template.replace("{{key}}", transKey)
      );
    });
    vscode.window.showInformationMessage("Extract Success!");
  } catch (err) {
    vscode.window.showErrorMessage(err.message);
  }
}

module.exports = (ctx) => {
  ctx.subscriptions.push(
    vscode.commands.registerCommand("extract-i18n.extract-i18n", () =>
      Extract(ctx)
    )
  );
};
