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
    label: 'file',
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
    label: 'create',
    click: context
  },
  {
    label: 'helpers',
    submenu: [{
      label: 'printGraph',
      click: context
    },
    {
      label: 'markdownTest',
      click: context
    },
  ]
  }
]
let contextmenu = new Menu()
let mainScene

// classes
class Scene {
  constructor() {
    this.dragging = ""
    this.candrop = false
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
    node.setAttribute("open", "true")

    // Attributes that we'll use dynamically
    node.setAttribute("id", args.id)
    node.setAttribute("type", args.type)
    node.setAttribute("value", args.value)
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
      if (summary.innerText.length == 0) {
        // placeholder text to begin with
        nodeSummary.innerText = "{ }"
        /*
        \begin{align}
        \dot{x} & = \sigma(y-x) \\
        \dot{y} & = \rho x - y - xz \\
        \dot{z} & = -\beta z + xy
        \end{align}
        */
      }
      $(nodeDetails).hide()
      $(nodeSummary).show()

      // updating text - need to be careful of backslashes
      // TODO: need to update node value
      //let updateArgs = {id:args.id}
      //ipc.send("update", updateArgs)
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
    case "exit":
      ipc.send("file", "quit")
      break;
    case "open":
      ipc.send("file", "open")
      break;
    case "save as":
      ipc.send("file", "save as")
      break;
    case "markdownTest":
      ipc.send("help", "display-markdown")
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
}, false)

document.addEventListener("dragstart", function( event ) {
  mainScene.dragging = event.target;
  mainScene.dragID = event.target.getAttribute("id");
}, false);

document.addEventListener("dragend", function( event ) {
    // reset the transparency
    event.target.style.opacity = "";
    // console.log("dragend fired.");
    //console.log(event);
    let payload = {
      id:event.target.parentElement.getAttribute("id"),
      x:event.x,
      y:event.y
    }
    ipc.send("update", payload)
}, false);

document.addEventListener("dragenter", function( event ) {
    // highlight potential drop target when the draggable element enters it
    if ( event.target.className == "node" ) {
      if (event.target.getAttribute("id") != mainScene.dragID) {
        event.target.style.opacity = .5;
        mainScene.candrop = false
      }
    }

}, false);

document.addEventListener("dragleave", function( event ) {
    // reset background of potential drop target when the draggable element leaves it
    if ( event.target.className == "node" ) {
      if (event.target.getAttribute("id") != mainScene.dragID) {
        event.target.style.opacity = "";
        mainScene.candrop = true
      }
    }

}, false);

document.addEventListener("drop", function( event ) {
    // prevent default action (open as link for some elements)
    event.preventDefault();
    console.log("drop fired.");
    if (mainScene.candrop) {

      ipc.send("update")
    }
}, false);

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
let optionsContext = new MenuItem(contextmenutemplate[0])
let createContext = new MenuItem(contextmenutemplate[1])
let helpersContext = new MenuItem(contextmenutemplate[2])
contextmenu.append(optionsContext)
contextmenu.append(createContext)
contextmenu.append(helpersContext)
// JQuery.fx.off = true
