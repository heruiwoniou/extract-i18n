// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const glob = require("glob");
const chokidar = require("chokidar");
const Config = require("./config");

const log = console.log.bind(console);

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
module.exports = function initializeConfig(ctx) {
  return new Promise((resolver) => {
    const config = Config(ctx);
    const directory = config.directory;
    glob(
      `${vscode.workspace.rootPath}/**/${directory}`,
      {
        ignore: ["**/node_modules/**", "**/.git/**"],
      },
      function (err, folders) {
        config.locales = folders.map((o) =>
          o.replace(new RegExp(`/${directory}$`, "gi"), "")
        );
        log(vscode.workspace.rootPath);
        let ready = false;
        chokidar
          .watch(`${vscode.workspace.rootPath}/`, {
            ignored: ["**/node_modules/**", "**/.git/**"],
          })
          .on("addDir", (path) => {
            if (ready && new RegExp(`${directory}$`).test(path)) {
              log("add the cache locales");
              config.locales = Array.from(
                new Set([
                  ...config.locales,
                  path.replace(new RegExp(`/${directory}$`), ""),
                ])
              );
            }
          })
          .on("unlinkDir", (path) => {
            if (ready && new RegExp(`${directory}$`).test(path)) {
              const index = config.locales.indexOf(
                path.replace(new RegExp(`/${directory}$`), "")
              );
              if (index > -1) {
                log("remove the cache locales");
                config.locales.splice(index, 1);
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
