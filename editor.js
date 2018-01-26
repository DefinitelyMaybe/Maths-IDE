const {remote} = require('electron')

const {Menu, MenuItem} = remote
const ipc = remote.ipcRenderer

let contextmenutemplate = [{
    label: 'Options',
    visible: false,
    submenu: [{
        label: 'delete',
        click: test,
      },
      {
        label: 'edit',
        click: test,
      }
    ]
  },
  {
    label: 'Create',
    visible: false,
    submenu: [{
        label: 'variable',
        click: test
      },
      {
        label: 'add',
        click: test
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
  defaultContext()
  contextmenu.popup(remote.getCurrentWindow())
}, false)

// functions
function test() {
  console.log("nothing");
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

function createNode(nodeType) {
  let newNode = new Node(nodeType)
  SCENE_Graph.addNode(newNode)
}

function editNode(event) {
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

  // finish with the submit button which will send the data to the (graph or node?)
  let submit = Document.createElement("input")
  submit.setAttribute("type", "button")
  submit.setAttribute("value", "submit")
  submit.addEventListener("click", getEditNodeFormVariables)
  x.appendChild(submit)
}

function removeEditFormChildren() {
  let x = Document.getElementById("editForm")
  // remove all elements from the form
  while (x.firstChild) {
    x.removeChild(x.firstChild)
  }
}

function getEditNodeFormVariables() {
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

  let node = SCENE_Graph.getNode(data["id"])
  node.value = data["value"]
  node.parent = data["parent"]
  node.children = data["children"]
  node.updateNodeHtml()

  // Once all that is done, remove the form elements
  removeEditFormChildren()
}

function printGraph() {
  console.log(SCENE_Graph);
}

function calculateGraph() {
  let roots = SCENE_Graph.findRoots()
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
