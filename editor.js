const {
  remote
} = require('electron')
const ipc = require('electron').ipcRenderer
const mathjax = require('mathjax');
const $ = require('jquery');
const {
  Menu,
  MenuItem
} = remote

// Globals
let help = true
let mouse = {
  x: 0,
  y: 0
}
let contextmenutemplate = [{
    label: 'create',
    click: context
  },
  {
    label: 'helpers',
    submenu: [{
      label: 'printGraph',
      click: context
    }]
  }
]
let contextmenu = new Menu()
let mainScene

// classes
class Scene {
  constructor() {
    this.draggedElement = ""
    this.candrop = false
    this.dx = 0;
    this.dy = 0;
  }

  findNode(id){
    let items = document.getElementsByClassName("node")
    for (var i = 0; i < items.length; i++) {
      if (items[i].getAttribute("id") == id) {
        return items[i];
      }
    }
    return false
  }

  createNodeHtml(args) {
    let node = document.createElement("div")
    let nodeDetails = document.createElement("textarea")
    let nodeSummary = document.createElement("summary")
    node.appendChild(nodeDetails)
    node.appendChild(nodeSummary)

    nodeSummary.setAttribute("draggable", "true")
    nodeDetails.setAttribute("draggable", "false")
    node.setAttribute("class", "node")
    // by default when a node is created the details will be shown first
    if (args.value) {
      nodeDetails.value = args.value
    }

    // Attributes that we'll use dynamically
    node.setAttribute("id", args.id)
    node.setAttribute("type", args.type)
    node.setAttribute("parent", args.parent)
    node.setAttribute("children", args.children)
    node.style.left = `${args.x}px`
    node.style.top = `${args.y}px`

    node.addEventListener("toggle", function(event) {
      //assuming that the textarea will be the first and summary is the last
      let details = event.target.firstElementChild
      let summary = event.target.lastElementChild

      summary.innerText = details.value
      typesetMath(summary)
      if (details.value.trim().length == 0) {
        // placeholder text if only whitespace within textarea
        nodeSummary.innerText = "{ }"
        nodeDetails.value = "{ }"
      }
      $(nodeDetails).hide()
      $(nodeSummary).show()

      let updateArgs = {
        id:args.id,
        value:nodeDetails.value
      }
      ipc.send("update", updateArgs)
    })

    nodeSummary.addEventListener("dblclick", function(event) {
      $(nodeDetails).show()
      $(nodeSummary).hide()
    })

    nodeDetails.addEventListener("focusout", function(event){
      // we the user stops editing the node.
      let e = new Event("toggle")
      node.dispatchEvent(e)
    })

    // finally adding it to the html
    document.body.appendChild(node)
  }
}

// functions
function context(menuItem, browserWindow, e) {
  switch (menuItem.label) {
    case "create":
      ipc.send("create", {
        x: mouse.x,
        y: mouse.y,
        type: "text"
      })
      break;
    case "printGraph":
      ipc.send("help", "print-graph")
      break;
    default:
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

function typesetMath(container, callback){
  try {
    if (typeof callback === "function") {
      MathJax.Hub.Queue(["Typeset", MathJax.Hub, container], callback);
    } else {
      MathJax.Hub.Queue(["Typeset", MathJax.Hub, container]);
    }
  } catch (e) {
    throw new Error(error.message, "typesetMath");
  }
}

// Events
document.addEventListener('contextmenu', (e) => {
  e.preventDefault()
  // TODO: could setup icons and positions here?
  updateMouse(e)
  contextChange("window")
  contextmenu.popup(remote.getCurrentWindow())
})

document.addEventListener("dragstart", function( event ) {
  //console.log(event);
  mainScene.draggedElement = event.target.parentElement;
  mainScene.dragID = event.target.parentElement.getAttribute("id");

  let parent = event.target.parentElement
  // console.log("dragend fired.");
  let lenX = parent.style.left.length
  let lenY = parent.style.top.length
  let x2 = Number(parent.style.left.slice(0,lenX-2))
  let y2 = Number(parent.style.top.slice(0,lenY-2))
  mainScene.dx = x2 - event.x
  mainScene.dy = y2 - event.y
});

document.addEventListener("dragend", function( event ) {
  // reset the transparency
  mainScene.draggedElement.style.opacity = "";
  if (mainScene.candrop) {
    let payload = {
      id:mainScene.draggedElement.getAttribute("id"),
      x:event.x + mainScene.dx,
      y:event.y + mainScene.dy
    }
    ipc.send("update", payload)
  }
});

document.addEventListener("dragenter", function( event ) {
  // highlight potential drop target when the draggable element enters it
  let parent = event.target.parentElement
  if (parent.getAttribute("class") == "node" ) {
    if (parent.getAttribute("id") != mainScene.dragID) {
      mainScene.draggedElement.style.opacity = "";
      mainScene.candrop = false
    }
  } else {
    mainScene.draggedElement.style.opacity = .5;
    mainScene.candrop = true
  }
});

document.addEventListener("dragleave", function( event ) {
  // reset background of potential drop target when the draggable element leaves it
  let parent = event.target.parentElement
  if (parent.getAttribute("class") == "node") {
    if (parent.getAttribute("id") == mainScene.dragID) {
      mainScene.draggedElement.style.opacity = .5;
      mainScene.candrop = true
    }
  }
});

ipc.on("update", function (event, args) {
  let node = mainScene.findNode(args.id)
  if (node) {
    // update the nodes html as per usual
    console.log("Editing the document node");
    // console.log(args);
    if (args.x) {
      node.style.left = `${args.x}px`
    }
    if (args.y) {
      node.style.top = `${args.y}px`
    }
  } else {
    console.log("Did not find a node.");
    console.log("Creating one instead.");
    mainScene.createNodeHtml(args)
  }
})

ipc.on("load", function (event, args) {
  for (var i = 0; i < args.length; i++) {
    ipc.send("create", args[i])
  }
})

ipc.on("help", function(event, args) {
  switch (args.case) {
    case "print":
      console.log(args.data);
      break;
    case "display":
      console.log(args.data);
      let box = document.createElement("p")
      box.innerText = args.data
      document.appendChild(box)
      break;
    default:
      console.log("You may have wanted something else to happen.");
  }
})

// Initialize
mainScene = new Scene()
let createContext = new MenuItem(contextmenutemplate[0])
let helpersContext = new MenuItem(contextmenutemplate[1])
contextmenu.append(createContext)
contextmenu.append(helpersContext)
// JQuery.fx.off = true
