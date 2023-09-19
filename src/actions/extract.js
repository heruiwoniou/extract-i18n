const vscode = require("vscode");
const { translate } = require("bing-translate-api");
const fs = require("fs-extra");
const camelCase = require("camelcase");
const Config = require("../config");

function getText() {
  const editor = vscode.window.activeTextEditor;
  const doc = editor.document;
  const selection = editor.selection;
  const text = doc.getText(selection);
  let anchor = [selection.anchor.line, selection.anchor.character];
  let active = [selection.active.line, selection.active.character];
  const lineText = doc.lineAt(selection.anchor.line).text;

  if (
    !text.startsWith('"') &&
    !text.startsWith("'") &&
    selection.anchor.character >= 1
  ) {
    const prefix = lineText.charAt(selection.anchor.character - 1);

    if (['"', "'"].includes(prefix)) {
      anchor = [selection.anchor.line, selection.anchor.character - 1];
    }
  }

  if (!text.endsWith('"') && !text.endsWith("'")) {
    const suffix = lineText.charAt(selection.active.character);
    if (['"', "'"].includes(suffix)) {
      active = [selection.active.line, selection.active.character + 1];
    }
  }

  return {
    text: lineText.slice(anchor[1], active[1]),
    selection: new vscode.Selection(anchor[0], anchor[1], active[0], active[1]),
    withParentheses:
      /{\s*$/.test(lineText.slice(0, anchor[1])) &&
      /^\s*}/.test(lineText.slice(active[1])),
  };
}

// eslint-disable-next-line no-unused-vars
async function Extract(ctx, { templateAutoWithParentheses }) {
  const config = Config(ctx);
  try {
    const editor = vscode.window.activeTextEditor;
    const { text, selection, withParentheses } = getText();

    const extractText = text.replace(/((^['"\s]+)|(['"\s]+$))/g, "");

    const response = await translate(
      extractText,
      null,
      config.langs[config.runtimeConfig.target[1]] ||
        config.runtimeConfig.target[1]
    );

    const commonKey = response.translation;

    let paths = vscode.window.activeTextEditor.document.fileName.split("/");
    paths = paths.slice(0, paths.length - 1);
    let localePath;

    do {
      const localePaths = config.locales
        .filter((o) => o.indexOf(paths.join("/")) > -1)
        .sort((a, b) => a.length - b.length);
      if (localePaths.length > 0) {
        localePath = localePaths[0];
        break;
      }
      paths.pop();
    } while (paths.length !== 0);

    if (!localePath) {
      vscode.window.showErrorMessage("Can't find locale path!");
    }

    const transKey = `${config.runtimeConfig.prefix}.${camelCase(commonKey)}`;

    const transList = [[config.runtimeConfig.target[1], commonKey]];
    await Promise.all(
      config.runtimeConfig.target
        .filter((key) => key !== config.runtimeConfig.target[1])
        .map(async (target) => {
          const res = await translate(
            extractText,
            null,
            config.langs[target] || target
          );
          transList.push([target, res.translation]);
        })
    );
    await Promise.all(
      transList.map(async ([target, transText]) => {
        const targetPath = `${localePath}/locales/${target}.json`;
        if (!(await fs.pathExists(targetPath))) {
          await fs.outputFile(targetPath, "{}");
        }
        const locale = await fs.readJson(targetPath);
        locale[transKey] = transText;
        await fs.writeJson(targetPath, locale, { spaces: 2 });
      })
    );
    let template = config.runtimeConfig.template;
    if (templateAutoWithParentheses) {
      template = withParentheses
        ? config.runtimeConfig.template
        : `{${config.runtimeConfig.template}}`;
    }

    editor.edit((editBuilder) => {
      editBuilder.replace(selection, template.replace("{{key}}", transKey));
    });
    vscode.window.showInformationMessage("Extract Success!");
  } catch (err) {
    vscode.window.showErrorMessage(err.message);
  }
}

module.exports = (ctx) => {
  ctx.subscriptions.push(
    vscode.commands.registerCommand("extract-i18n.extract-text", () =>
      Extract(ctx, { templateAutoWithParentheses: false })
    )
  );

  ctx.subscriptions.push(
    vscode.commands.registerCommand(
      "extract-i18n.extract-text-with-auto-brace",
      () => Extract(ctx, { templateAutoWithParentheses: true })
    )
  );
};
