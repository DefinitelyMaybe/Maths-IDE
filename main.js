const electron = require('electron')
const path = require('path')
const url = require('url')
const os = require('os')
const fs = require('fs')

const app = electron.app
const Menu = electron.Menu
const BrowserWindow = electron.BrowserWindow
const ipc = electron.ipcMain
const dialog = electron.dialog

//require('electron-reload')(__dirname);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let mainGraph

const template = [
  {
    label: 'Options',
    submenu: [
      {
        label:'open',
        click: openFile,
      },
      {
        label:'save',
        click: saveFile,
      },
      {
        label:'save as',
        click: saveFileAs,
      },
      {type: 'separator'},
      {
        label:'exit',
        click: function () {
          // TODO: Later on could check if current work is saved before quit.
          app.quit()
        },
      }
    ]
  },
  {
    label: 'Calculate',
    submenu: [
      {role: 'print-graph', label:'print graph'},
      {role: 'all-values', label:'values'},
    ]
  },
  {
    label: 'View',
    submenu: [
      {role: 'reload'},
      {role: 'forcereload'},
      {role: 'toggledevtools'},
      {type: 'separator'},
      {role: 'resetzoom'},
      {role: 'zoomin'},
      {role: 'zoomout'},
      {type: 'separator'},
      {role: 'togglefullscreen'}
    ]
  },
]

// Classes
class Node {
  constructor(nodeType, nodeValue) {
    if (!nodeValue) {
      nodeValue = ""
    }
    this.id = mainGraph.getID()
    this.type = nodeType
    this.value = nodeValue
    this.parent = []
    this.children = []
    this.html = this.createNodeHtml()
  }

  createNodeHtml(){
    let newRow = Document.createElement("tr")

    // placeholder for the html table
    let placeholder = Document.createElement("td")
    placeholder.innerText = "Node-Placeholder"
    newRow.appendChild(placeholder)

    // Attributes that we'll use dynamically
    newRow.setAttribute("id", this.id)
    newRow.setAttribute("type", this.type)
    newRow.setAttribute("value", this.value)
    newRow.setAttribute("parent", this.parent)
    newRow.setAttribute("children", this.children)

    // binding event to edit the node
    newRow.addEventListener("click", editNode)

    // Adding the html in so it can be 'seen' and clicked on.
    let table = Document.getElementById('nodeRows')
    table.appendChild(newRow)

    // so we can get the html easily later on
    return newRow
  }

  updateNodeHtml(){
    this.html.setAttribute("value", this.value)
    this.html.setAttribute("parent", this.parent)
    this.html.setAttribute("children", this.children)
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
    this.nextID = 0
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

  addNode(newNode){
    this.nodes.push(newNode)
  }

  editNode(nodeID, newValues){
    let x = getNode(nodeID)

  }

  removeNode(nodeID){
    // removing the html?
    // removing from graph
    let x
    for (var i = 0; i < this.nodes.length; i++) {
      if (this.nodes[i].data.id == nodeID) {
        x = i;
        this.unusedIDS.push(this.nodes[i].data.id)
      }
    }
    let lastHalf = this.nodes.slice(x)
    let firstHalf = this.nodes.slice(0, x)
    console.log("check this at least once");
    console.log(this.nodes);
    this.nodes = firstHalf.concat(lastHalf)
    console.log(this.nodes);
    console.log("The arrays above should differ by only one element");
  }

  findRoots(){
    let roots = []
    for (var i = 0; i < this.nodes.length; i++) {
      let node = this.nodes[i]
      if (node.parent.length == 0) {
        roots.push(node)
      }
    }
    return roots
  }
}

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

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

function openFile() {
  const options = {
    title: 'Open JSON',
    filters: [
      {name: 'Graph', extensions: ['json']}
    ]
  }
  dialog.showOpenDialog(options, function(filenames) {
    if (filenames) {
      // not dealing with opening lots of files at this point
      let fn = filenames[0]
      fs.readFile(fn, "utf8", function(err, data){
        if (err) {
          console.log(err);
        }
        // TODO: send the JSON to the renderer
        console.log(data);
      })
    }
  })
}

function saveFile(filename, data) {
  fs.writeFile(filename, data, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Something may have been saved.");
    }
  })
}

function saveFileAs() {
  const options = {
    title: 'Save json as...',
    filters: [
      {name: 'GraphThingy', extensions: ['json']}
    ]
  }
  dialog.showSaveDialog(options, function (filename) {
    // Using synchronous message for the returnValue instead of making more functions
    let data = JSON.stringify(mainGraph.nodes)
    saveFile(filename, data)
  })
}

// App life cycle
app.on('ready', function () {
  createWindow()
  mainGraph = new Graph()
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

ipc.on('open-file-dialog', function (event) {
  dialog.showOpenDialog({
    properties: ['openFile', 'openDirectory']
  }, function (files) {
    if (files) event.sender.send('selected-directory', files)
  })
})

ipc.on('asynchronous-message', function (event, arg) {
  event.sender.send('asynchronous-reply', 'pong')
})
// "save-data-message"
