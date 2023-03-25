const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    title: "Google maps lead scrapper",
    width: 500,
    height: 600,
  });

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
