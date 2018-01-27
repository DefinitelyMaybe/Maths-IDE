const {remote} = require('electron')
const {graph, node} = require('./graph');

const {Menu, MenuItem} = remote
const ipc = remote.ipcRenderer

let mouse = {
  x:0,
  y:0
}
let contextmenutemplate = [{
    label: 'Options',
    submenu: [{
        label: 'delete',
        click: context,
      },
      {
        label: 'edit',
        click: context,
      }
    ]
  },
  {
    label: 'Create',
    submenu: [{
        label: 'variable',
        click: context
      },
      {
        label: 'add',
        click: context
      },
    ]
  }
]
let contextmenu
contextmenu = new Menu()
contextmenu.append(new MenuItem(contextmenutemplate[0]))
contextmenu.append(new MenuItem(contextmenutemplate[1]))

window.addEventListener('contextmenu', (e) => {
  e.preventDefault()
  updateMouse(e)
  defaultContext()
  contextmenu.popup(remote.getCurrentWindow())
}, false)

// functions
function context(menuItem, browserWindow, e) {
  if (menuItem.label == "variable") {
    console.log("Lets create a variable");
    // send a message back into main to create this node
    // main creates the things
    // receive a message to update html or update html from main?
  } else if (menuItem.label == "add") {
    console.log("Lets add things together");
  } else {
    console.log("The ${menuItem.label} hasn't been caught.");
  }
}

function updateMouse(e) {
  mouse.x = e.x
  mouse.y = e.y
}

function defaultContext() {
  for (var i = 0; i < contextmenu.items.length; i++) {
    if (contextmenu.items[i].label == "Create") {
      contextmenu.items[i].visible = true
    } else {
      contextmenu.items[i].visible = false
    }
  }
}

function additionalContext(args) {
  // args must be an obj with string values i.e. {}
  if (args) {
    for (var i = 0; i < contextmenu.items.length; i++) {
      contextmenu.items[i].visible = true
    }
  } else {
    defaultContext()
  }
}
