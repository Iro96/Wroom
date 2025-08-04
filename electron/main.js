const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true
    }
  });

  win.loadFile("index.html");

  // Handle file open
  ipcMain.handle("dialog:openFile", async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        { name: "Text or Markdown Files", extensions: ["txt", "md"] }
      ]
    });
    if (!canceled && filePaths.length > 0) {
      return fs.readFileSync(filePaths[0], "utf8");
    }
    return "";
  });

  // Handle file save
  ipcMain.handle("dialog:saveFile", async (event, content) => {
    const { canceled, filePath } = await dialog.showSaveDialog({
      defaultPath: "untitled.txt",
      filters: [{ name: "Text File", extensions: ["txt"] }]
    });
    if (!canceled && filePath) {
      fs.writeFileSync(filePath, content, "utf8");
      return "saved";
    }
    return "cancelled";
  });
}

app.whenReady().then(createWindow);
