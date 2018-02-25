const electron = require('electron');
const path = require('path');
const url = require('url');
const os = require('os');
const fs = require('fs');

const app = electron.app
const Menu = electron.Menu
const BrowserWindow = electron.BrowserWindow
const dialog = electron.dialog
const ipc = electron.ipcMain

// Globals
let mainWindow
let mainGraph
let template = [
  {
    label: 'file',
    submenu: [
      {
        label: 'open',
        click: openFile,
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
        role: 'close'
      }
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

// Classes
class Node {
  constructor(args) {
    // args is expected to be a {key:value}
    this.id = args.id
    this.type = args.type
    this.x = args.x
    this.y = args.y
    this.value = args.value || ""
    // may be useful later
    //this.parent = []
    //this.children = []
  }

  evaluateValue(){
    if (this.type == "variable") {
      return this.value
    } else if (this.type == "add") {
      if (this.children.length != 2) {
        return undefined
      } else {
        let x = mainGraph.getNode(this.children[0]).evaluateValue()
        let y = mainGraph.getNode(this.children[1]).evaluateValue()
        console.log("node " + this.id + ":", x+y);
        return x + y
      }
    }
  }
}

class Graph {
  constructor() {
    this.nextID = 1
    this.unusedIDS = []
    this.nodes = []
  }

  getID(){
    if (this.unusedIDS.length == 0) {
      this.nextID += 1
      return this.nextID - 1
    } else {
      return this.unusedIDS.pop()
    }
  }

  getNode(nodeID){
    for (var i = 0; i < this.nodes.length; i++) {
      if (this.nodes[i].id == nodeID) {
        return this.nodes[i];
      }
    }
  }

  removeNode(nodeID){
    // removing the html?
    // removing from Graph
    let x
    for (var i = 0; i < this.nodes.length; i++) {
      if (this.nodes[i].data.id == nodeID) {
        x = i;
        this.unusedIDS.push(this.nodes[i].data.id)
      }
    }
    let lastHalf = this.nodes.slice(x)
    let firstHalf = this.nodes.slice(0, x)
    this.nodes = firstHalf.concat(lastHalf)
  }
}

// Functions
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    show: false,
    frame: true
  })
  mainGraph = new Graph()

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
  mainWindow.on('closed', function() {
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
        // resetting the old graph for the new data because our scene may have things in it already
        mainGraph = new Graph()
        // expecting the data to be JSON
        mainWindow.webContents.send("load", JSON.parse(data))
      })
    }
  })
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
      let data = JSON.stringify(mainGraph.nodes)
      fs.writeFile(filename, data, function(err) {
        if (err) {
          console.warn(err);
        } else {
          console.info(`The following was just saved to: ${filename}:\n${data}`)
        }
      })
    }
  })
}

// Events
app.on('ready', function() {
  createWindow()
})

app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

ipc.on("create", function(event, args) {
  if (args.type) {
    // TODO: Loading arg id's nicely
    args.id = mainGraph.getID()

    if (!args.x) {
      args.x = 0
    }
    if (!args.y) {
      args.y = 0
    }
    let node = new Node(args)
    mainGraph.nodes.push(node)
    event.sender.send("update", args)
  }
})

ipc.on("update", function(event, args) {
  // It turns out that 0 is false
  if (args.id) {
    // later I may need to add a check here that the node was found.
    console.log("updating");
    let node = mainGraph.getNode(args.id)
    console.log(node);
    if (args.value) {
      node.value = args.value
    }
    /*if (args.children) {
      node.children = args.children
    }
    if (args.parent) {
      node.parent = args.parent
    }*/
    if (args.x) {
      node.x = args.x
    }
    if (args.y) {
      node.y = args.y
    }
    event.sender.send("update", args)
  } else {
    console.log(`tired to update but there was no id.`);
  }
})

ipc.on("help", function(event, args) {
  let payload = {}
  switch (args) {
    case "print-graph":
      payload = {
        case:"print",
        data:mainGraph
      }
      event.sender.send("help", payload)
      break;
    case "display-markdown":
      payload = {
        case:"display",
        data:"lol"
      }
      event.sender.send("help", payload)
      break;
    default:
      event.sender.send("help", "with what?")
  }
})

ipc.on("file", function(event, args) {
  switch (args) {
    default:
      console.log("nothing in the likes");
  }
})

// Initialize
