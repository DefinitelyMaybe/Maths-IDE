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
    // must haves
    this.id = args.id
    this.type = args.type
    this.x = args.x
    this.y = args.y
    // might haves
    this.value = ""
    this.parent = []
    this.children = []
    //this.html = this.createNodeHtml()
  }

  /*
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
  */

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

  loadGraph(data){
    // assuming the data has already been through JSON.parse()
    console.log(data);
  }

  editNode(event) {
    // use form with whos action is to call one of the functions here with payload which will then update the node + html
    // console.log(this) // <- just so your aware of the variable
    let x = Document.getElementById("editForm")
    let identifier = "editForm"

    // remove all elements from the form
    removeEditFormChildren()

    // Populate form with appropriate inputs
    // ID and TYPE should not be editable
    let id = Document.createElement("p")
    id.setAttribute("id", identifier + "id")
    id.innerText = "ID: " + this.getAttribute("id")
    x.appendChild(id)
    let type = Document.createElement("p")
    type.innerText = "TYPE: " + this.getAttribute("type")
    x.appendChild(type)

    // Value and edges should be editable
    let valueLabel = Document.createElement("label")
    valueLabel.setAttribute("for", "value")
    valueLabel.innerText = "VALUE:"
    x.appendChild(valueLabel)
    let value = Document.createElement("input")
    value.setAttribute("name", "value")
    value.setAttribute("id", identifier + "value")
    value.setAttribute("value", this.getAttribute("value"))
    x.appendChild(value)
    // this is just for looks
    let br1 = Document.createElement("br")
    x.appendChild(br1)

    // Later on edges should not be edited this way.
    let parentLabel = Document.createElement("label")
    parentLabel.setAttribute("for", "parent")
    parentLabel.innerText = "PARENT:"
    x.appendChild(parentLabel)
    let parent = Document.createElement("input")
    parent.setAttribute("name", "value")
    parent.setAttribute("id", identifier + "parent")
    parent.setAttribute("value", this.getAttribute("parent"))
    x.appendChild(parent)
    // this is just for looks
    let br2 = Document.createElement("br")
    x.appendChild(br2)

    // Second for child nodes
    let childrenLabel = Document.createElement("label")
    childrenLabel.setAttribute("for", "children")
    childrenLabel.innerText = "CHILDREN:"
    x.appendChild(childrenLabel)
    let children = Document.createElement("input")
    children.setAttribute("name", "value")
    children.setAttribute("id", identifier + "children")
    children.setAttribute("value", this.getAttribute("children"))
    x.appendChild(children)
    // this is just for looks
    let br3 = Document.createElement("br")
    x.appendChild(br3)

    // This is not good user interface to put this button here - given the interfaces current rendering.
    let deleteLabel = Document.createElement("label")
    deleteLabel.setAttribute("for", "deleteThingy")
    deleteLabel.innerText = "DELETE?"
    x.appendChild(deleteLabel)
    let deleteThingy = Document.createElement("input")
    deleteThingy.setAttribute("type", "radio")
    deleteThingy.setAttribute("id", identifier + "deleteThingy")
    x.appendChild(deleteThingy)
    // this is just for looks
    let br4 = Document.createElement("br")
    x.appendChild(br4)

    // finish with the submit button which will send the data to the (Graph or node?)
    let submit = Document.createElement("input")
    submit.setAttribute("type", "button")
    submit.setAttribute("value", "submit")
    submit.addEventListener("click", getEditNodeFormVariables)
    x.appendChild(submit)
  }

  removeEditFormChildren() {
    let x = Document.getElementById("editForm")
    // remove all elements from the form
    while (x.firstChild) {
      x.removeChild(x.firstChild)
    }
  }

  getEditNodeFormVariables() {
    // get all of the variables from the html
    let x = Document.getElementById("editForm")
    let identifier = "editForm"
    let data = {}

    // which node?
    let id = Document.getElementById(identifier + "id")
    data["id"] = Number(id.innerText.substr(4))

    // what value?
    let value = Document.getElementById(identifier + "value")
    data["value"] = Number(value.value)

    // what edges?
    let parent = Document.getElementById(identifier + "parent")
    data["parent"] = parent.value.split(",")
    if (data["parent"].length > 0) {
      if (data["parent"].length > 1) {
        // It is easy to produces strange results from this piece of code. It is not intended to stay.
        for (var i = 0; i < data["parent"].length; i++) {
          data["parent"][i] = Number(data["parent"][i])
        }
      } else {
        if (data["parent"][0] == "") {
          data["parent"].pop()
        } else {
          data["parent"][0] = Number(data["parent"][0])
        }
      }
    }

    let children = Document.getElementById(identifier + "children")
    data["children"] = children.value.split(",")
    if (data["children"].length > 0) {
      if (data["children"].length > 1) {
        // It is easy to produces strange results from this piece of code. It is not intended to stay.
        for (var i = 0; i < data["children"].length; i++) {
          data["children"][i] = Number(data["children"][i])
        }
      } else {
        if (data["children"][0] == "") {
          data["children"].pop()
        } else {
          data["children"][0] = Number(data["children"][0])
        }
      }
    }

    let node = this.getNode(data["id"])
    node.value = data["value"]
    node.parent = data["parent"]
    node.children = data["children"]
    node.updateNodeHtml()

    // Once all that is done, remove the form elements
    removeEditFormChildren()
  }

  calculateGraph() {
    let roots = this.findRoots()
    for (var i = 0; i < roots.length; i++) {
      let root = roots[i]
      if (root.children.length > 0) {
        root.value = root.evaluateValue()
        root.updateNodeHtml()
      } else {
        root.value = ""
        root.updateNodeHtml()
      }
    }
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
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    show: false,
    frame: false
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
        mainGraph.loadGraph(JSON.parse(data))
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

function createNode(event, args){
  if (args.type) {
    if (!args.id) {
      args.id = mainGraph.getID()
    }
    if (!args.x) {
      args.x = 0
    }
    if (!args.y) {
      args.y = 0
    }
    let node = new Node(args)
    let contents = mainWindow.webContents
    console.log(contents)
    mainGraph.nodes.push(node)
  } else {
    console.log(`Nothing was created.\nThis needed a type:\n ${args}\n`);
  }
}

// Initialize

// App life cycle
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

ipc.on("create", createNode)

ipc.on("help", function(event, args) {
  console.log(args);
  if (args == "print-graph") {
    console.log(mainGraph.nodes);
  }
})

ipc.on("file", function(event, args) {
  switch (args) {
    case "open":
      openFile()
      break;
    case "save as":
      saveFileAs()
      break;
    case "quit":
      app.quit()
      break;
    default:
      console.log("nothing in the likes");
  }
})
