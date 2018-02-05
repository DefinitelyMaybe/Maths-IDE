const {
  remote
} = require('electron')
const ipc = require('electron').ipcRenderer
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
let contextmenu = new Menu()
let mainScene

// classes
class Scene {
  constructor() {
    this.nothing = null
  }

  findNode(id){
    let items = document.getElementsByTagName("details")
    for (var i = 0; i < items.length; i++) {
      if (items[i].getAttribute("id") == id) {
        return items[i];
      }
    }
    return false
  }

  createNodeHtml(args) {
    // the 'detail' html element's default behaviour is useful for it's open and closed states
    let nodeDetails = document.createElement("details")
    let nodeSummary = document.createElement("summary")
    nodeSummary.innerText = "Placeholder"
    nodeDetails.appendChild(nodeSummary)
    nodeDetails.style.left = `${args.x}px`
    nodeDetails.style.top = `${args.y}px`

    // The form for changing node
    let nodeForm = document.createElement("form")
    let formValueLabel = document.createElement("label")
    let formValueInput = document.createElement("input")
    let formbreakline1 = document.createElement("br")
    let formSubmit = document.createElement("button")
    formValueLabel.innerText = "Value"
    formValueInput.setAttribute("id", `${args.id}-form-value`)
    formSubmit.innerText = "submit"
    nodeForm.appendChild(formValueLabel)
    nodeForm.appendChild(formValueInput)
    nodeForm.appendChild(formbreakline1)
    nodeForm.appendChild(formSubmit)
    nodeDetails.appendChild(nodeForm)

    // Attributes that we'll use dynamically
    nodeDetails.setAttribute("id", args.id)
    nodeDetails.setAttribute("type", args.type)
    nodeDetails.setAttribute("value", args.value)
    nodeDetails.setAttribute("parent", args.parent)
    nodeDetails.setAttribute("children", args.children)

    nodeDetails.addEventListener("toggle", function(event) {
      if (nodeDetails.open) {
        // The node has been opened, editing may occur
      } else {
        // just the summary of the node will be seen
        let updateArgs = {id:args.id}
        ipc.send("update", updateArgs)
      }
    })

    // finally adding it to the html
    document.body.appendChild(nodeDetails)
  }

  updateNodeHtml(node) {
    node.setAttribute("value", this.value)
    node.setAttribute("parent", this.parent)
    node.setAttribute("children", this.children)
  }

  editNode() {
    // use form with whos action is to call one of the functions here with payload which will then update the node + html
    // console.log(this) // <- just so your aware of the variable
    let x = document.getElementById("editForm")
    let identifier = "editForm"

    // remove all elements from the form
    removeEditFormChildren()

    // Populate form with appropriate inputs
    // ID and TYPE should not be editable
    let id = document.createElement("p")
    id.setAttribute("id", identifier + "id")
    id.innerText = "ID: " + this.getAttribute("id")
    x.appendChild(id)
    let type = document.createElement("p")
    type.innerText = "TYPE: " + this.getAttribute("type")
    x.appendChild(type)

    // Value and edges should be editable
    let valueLabel = document.createElement("label")
    valueLabel.setAttribute("for", "value")
    valueLabel.innerText = "VALUE:"
    x.appendChild(valueLabel)
    let value = document.createElement("input")
    value.setAttribute("name", "value")
    value.setAttribute("id", identifier + "value")
    value.setAttribute("value", this.getAttribute("value"))
    x.appendChild(value)
    // this is just for looks
    let br1 = document.createElement("br")
    x.appendChild(br1)

    // Later on edges should not be edited this way.
    let parentLabel = document.createElement("label")
    parentLabel.setAttribute("for", "parent")
    parentLabel.innerText = "PARENT:"
    x.appendChild(parentLabel)
    let parent = document.createElement("input")
    parent.setAttribute("name", "value")
    parent.setAttribute("id", identifier + "parent")
    parent.setAttribute("value", this.getAttribute("parent"))
    x.appendChild(parent)
    // this is just for looks
    let br2 = document.createElement("br")
    x.appendChild(br2)

    // Second for child nodes
    let childrenLabel = document.createElement("label")
    childrenLabel.setAttribute("for", "children")
    childrenLabel.innerText = "CHILDREN:"
    x.appendChild(childrenLabel)
    let children = document.createElement("input")
    children.setAttribute("name", "value")
    children.setAttribute("id", identifier + "children")
    children.setAttribute("value", this.getAttribute("children"))
    x.appendChild(children)
    // this is just for looks
    let br3 = document.createElement("br")
    x.appendChild(br3)

    // This is not good user interface to put this button here - given the interfaces current rendering.
    let deleteLabel = document.createElement("label")
    deleteLabel.setAttribute("for", "deleteThingy")
    deleteLabel.innerText = "DELETE?"
    x.appendChild(deleteLabel)
    let deleteThingy = document.createElement("input")
    deleteThingy.setAttribute("type", "radio")
    deleteThingy.setAttribute("id", identifier + "deleteThingy")
    x.appendChild(deleteThingy)
    // this is just for looks
    let br4 = document.createElement("br")
    x.appendChild(br4)

    // finish with the submit button which will send the data to the (Graph or node?)
    let submit = document.createElement("input")
    submit.setAttribute("type", "button")
    submit.setAttribute("value", "submit")
    submit.addEventListener("click", getEditNodeFormVariables)
    x.appendChild(submit)
  }

  removeEditFormChildren() {
    let x = document.getElementById("editForm")
    // remove all elements from the form
    while (x.firstChild) {
      x.removeChild(x.firstChild)
    }
  }

  getEditNodeFormVariables() {
    // get all of the variables from the html
    let x = document.getElementById("editForm")
    let identifier = "editForm"
    let data = {}

    // which node?
    let id = document.getElementById(identifier + "id")
    data["id"] = Number(id.innerText.substr(4))

    // what value?
    let value = document.getElementById(identifier + "value")
    data["value"] = Number(value.value)

    // what edges?
    let parent = document.getElementById(identifier + "parent")
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

    let children = document.getElementById(identifier + "children")
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
}

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

// Events
window.addEventListener('contextmenu', (e) => {
  e.preventDefault()
  updateMouse(e)
  contextChange("window")
  contextmenu.popup(remote.getCurrentWindow())
}, false)

ipc.on("update", function (event, args) {
  let found = mainScene.findNode(args.id)
  if (found) {
    // update the nodes html as per usual
    console.log(`found was true\nthis was there${found}`);
  } else {
    // a node has just been created
    mainScene.createNodeHtml(args)
  }
})

ipc.on("help", function(event, args) {
  console.log(args);
})

// Initialize
mainScene = new Scene()
let optionsContext = new MenuItem(contextmenutemplate[0])
let createContext = new MenuItem(contextmenutemplate[1])
let helpersContext = new MenuItem(contextmenutemplate[2])
contextmenu.append(optionsContext)
contextmenu.append(createContext)
contextmenu.append(helpersContext)
