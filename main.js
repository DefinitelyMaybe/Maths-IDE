const electron = require('electron');
const path = require('path')
const url = require('url')
const os = require('os')
const dataInterface = require('./scripts/interface');
const fs = require('fs');

const app = electron.app
const Menu = electron.Menu
const BrowserWindow = electron.BrowserWindow
const dialog = electron.dialog

//require('electron-reload')(__dirname);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let template = [{
    label: 'Options',
    submenu: [{
        label: 'open',
        click: openFile,
      },
      {
        label: 'save',
        click: saveFile,
      },
      {
        label: 'save as',
        click: saveFileAs,
      },
      {
        type: 'separator'
      },
      {
        label: 'exit',
        click: function() {
          // TODO: Later on could check if current work is saved before quit.
          app.quit()
        },
      }
    ]
  },
  {
    label: 'Calculate',
    submenu: [{
        role: 'print-graph',
        label: 'print graph'
      },
      {
        role: 'all-values',
        label: 'values'
      },
    ]
  },
  {
    label: 'View',
    submenu: [{
        role: 'reload'
      },
      {
        role: 'forcereload'
      },
      {
        role: 'toggledevtools'
      },
      {
        type: 'separator'
      },
      {
        role: 'resetzoom'
      },
      {
        role: 'zoomin'
      },
      {
        role: 'zoomout'
      },
      {
        type: 'separator'
      },
      {
        role: 'togglefullscreen'
      }
    ]
  },
]
let dataInt = new dataInterface()

// Functions
function createWindow () {
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

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

function openFile() {
  const options = {
    title: 'Open JSON',
    filters: [{
      name: 'Graph',
      extensions: ['json']
    }]
  }
  dialog.showOpenDialog(options, function(filenames) {
    if (filenames) {
      // not dealing with opening lots of files at this point
      let fn = filenames[0]
      fs.readFile(fn, "utf8", function(err, data) {
        if (err) {
          console.warn(err);
        }
        dataInt.loadGraph(JSON.parse(data))
      })
    }
  })
}

function saveFile(filename, data) {
  if (!(typeof filename == "string")) {
    saveFileAs()
  } else {
    fs.writeFile(filename, data, function(err) {
      if (err) {
        console.warn(err);
      } else {
        console.info("The following was just saved to ${filename}:\n${data}")
      }
    })
  }
}

function saveFileAs() {
  const options = {
    title: 'Save json as...',
    filters: [{
      name: 'Graph',
      extensions: ['json']
    }]
  }
  dialog.showSaveDialog(options, function(filename) {
    // Using synchronous message for the returnValue instead of making more functions
    if (filename) {
      let data = JSON.stringify(dataInt.graph.nodes)
      saveFile(filename, data)
    }
  })
}

// App life cycle
app.on('ready', function () {
  createWindow()
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
