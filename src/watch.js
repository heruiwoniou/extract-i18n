// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const glob = require("glob");
const chokidar = require("chokidar");
const { runtimeConfig } = require("./config");

const log = console.log.bind(console);

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
module.exports = function initializeConfig() {
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
        log(vscode.workspace.rootPath);
        let ready = false;
        chokidar
          .watch(`${vscode.workspace.rootPath}/`, {
            ignored: ["**/node_modules/**", "**/.git/**"],
          })
          .on("addDir", (path) => {
            if (ready && /locales$/.test(path)) {
              log("add the cache locales");
              runtimeConfig.locales = Array.from(
                new Set([
                  ...runtimeConfig.locales,
                  path.replace(/\/locales$/gi, ""),
                ])
              );
            }
          })
          .on("unlinkDir", (path) => {
            if (ready && /locales$/.test(path)) {
              const index = runtimeConfig.locales.indexOf(
                path.replace(/\/locales$/gi, "")
              );
              if (index > -1) {
                log("remove the cache locales");
                runtimeConfig.locales.splice(index, 1);
              }
            }
          })
          .on("ready", () => {
            ready = true;
          });
        log("Extract i18n Activated!");
        resolver();
      }
    );
  });
};
