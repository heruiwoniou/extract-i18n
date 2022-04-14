// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const glob = require("glob");
const fsExtra = require("fs-extra");
const pify = require("pify");
const translate = require("translate-google");
const camelCase = require("camelcase");
const fs = pify(fsExtra);
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */

const langs = {
  zh: "zh-cn",
};

const runtimeConfig = {
  manually: null,
  prefix: "extract-i18n.",
  target: ["en-US", "zh-CN"],
	template: "t(\"{{key}}\")",
  locales: [],
};

function initializeConfig() {
  return new Promise((resolver) => {
    glob(
      `${vscode.workspace.rootPath}/**/locales`,
      {
        ignore: ["**/node_modules/**", "**/.git/**"],
      },
      function (err, folders) {
        runtimeConfig.locales = folders.map((o) =>
          o.replace(/\/locales$/gi, "")
        );
        resolver();
      }
    );
  });
}

async function activate(context) {
  await initializeConfig();
  console.log("Extract i18n Activated!");
  let disposable = vscode.commands.registerCommand(
    "extract-i18n.extract-i18n",
    async function () {
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
          localePath = runtimeConfig.locales.find(
            (o) => o.indexOf(paths.join("/")) > -1
          );
          if (localePath) {
            break;
          }
          paths.pop();
        } while (paths.length !== 0);

        if (!localePath) {
          vscode.window.showErrorMessage("Can't find locale path!");
        }

        const transKey =
          runtimeConfig.prefix +
          localePath
            .replace(vscode.workspace.rootPath + "/", "")
            .split("/")
            .join(".") +
          "." +
          camelCase(commonKey);

        await Promise.all(
          runtimeConfig.target.map(async (target) => {
            const [type] = target.split("-");
            const transText = await translate(extractText, {
              to: langs[type] || type,
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
				editor.edit(editBuilder => {
					editBuilder.replace(selection, transKey);
				})
        vscode.window.showInformationMessage("Extract Success!");
      } catch (err) {
        vscode.window.showErrorMessage(err.message);
      }
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
