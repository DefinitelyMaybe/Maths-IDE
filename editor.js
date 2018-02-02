const {
  remote
} = require('electron')
const ipc = require('electron').ipcRenderer

const {
  Menu,
  MenuItem
} = remote

let help = true
let mouse = {
  x: 0,
  y: 0
}
let contextmenutemplate = [{
    label: 'File',
    submenu: [{
        label: 'new',
        click: context,
      },
      {
        label: 'open',
        click: context,
      },
      {
        label: 'save as',
        click: context,
      },
      {
        type: 'separator'
      },
      {
        label: 'exit',
        click: context
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
  },
  {
    label: 'Helpers',
    submenu: [{
      label: 'printGraph',
      click: context
    }]
  }
]
let contextmenu

contextmenu = new Menu()
let optionsContext = new MenuItem(contextmenutemplate[0])
let createContext = new MenuItem(contextmenutemplate[1])
let helpersContext = new MenuItem(contextmenutemplate[2])
contextmenu.append(optionsContext)
contextmenu.append(createContext)
contextmenu.append(helpersContext)

window.addEventListener('contextmenu', (e) => {
  e.preventDefault()
  updateMouse(e)
  contextChange("window")
  contextmenu.popup(remote.getCurrentWindow())
}, false)

// functions
function context(menuItem, browserWindow, e) {
  if (menuItem.label == "variable") {
    ipc.send("create", {
      x: mouse.x,
      y: mouse.y,
      type: "variable"
    })
  } else if (menuItem.label == "add") {
    ipc.send("create", {
      x: mouse.x,
      y: mouse.y,
      type: "add"
    })
  } else if (menuItem.label == "printGraph") {
    ipc.send("help", "print-graph")
  } else if (menuItem.label == "exit") {
    ipc.send("file", "quit")
  } else if (menuItem.label == "open") {
    ipc.send("file", "open")
  } else if (menuItem.label == "save as") {
    ipc.send("file", "save as")
  } else {
    console.log(`The '${menuItem.label}' menu item hasn't been caught.`);
  }
}

function updateMouse(e) {
  mouse.x = e.x
  mouse.y = e.y
}

function contextChange(arg) {
  // args must be an obj with string values i.e. {}
  if (arg == "window") {
    for (var i = 0; i < contextmenu.items.length; i++) {
      contextmenu.items[i].visible = true
    }
  } else {
    for (var i = 0; i < contextmenu.items.length; i++) {
      contextmenu.items[i].visible = false
    }
  }
}
