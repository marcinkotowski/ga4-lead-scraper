const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");

const isDev = process.env.NODE_ENV !== "development";

function createWindow() {
  const win = new BrowserWindow({
    title: "Google maps lead scrapper",
    width: isDev ? 1000 : 500,
    height: 500,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Disable menu
  Menu.setApplicationMenu(null);

  // Open devtools if in dev env
  if (isDev) {
    win.webContents.openDevTools();
  }

  win.loadFile(path.join(__dirname, "./renderer/index.html"));
}

app.whenReady().then(() => {
  createWindow();

  // MacOS apps generally continue running even without any windows open
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Terminate app on Windows & Linux
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
