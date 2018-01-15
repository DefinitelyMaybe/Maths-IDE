const electron = require('electron')
const path = require('path')
const url = require('url')
const os = require('os')

const lib = require('./scripts/lib');

const app = electron.app
const Menu = electron.Menu
const BrowserWindow = electron.BrowserWindow

//require('electron-reload')(__dirname);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let mainGraph

// Functions
function createWindow () {
  // Create the browser window.
  // TODO: frame: false
  mainWindow = new BrowserWindow({width: 800, height: 600, show:false, frame:true})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  mainWindow.once('ready-to-show', function() {
    mainWindow.show()
  })
  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  const menu = Menu.buildFromTemplate(lib.menuTemplate)
  Menu.setApplicationMenu(menu)
}

// App life cycle
app.on('ready', function () {
  createWindow()
  mainGraph = new lib.graph()
})

app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})
