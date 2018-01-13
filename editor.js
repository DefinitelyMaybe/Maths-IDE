let SCENE_Graph

class Node {
  constructor(nodeType, nodeValue) {
    if (!nodeValue) {
      nodeValue = ""
    }
    this.id = SCENE_Graph.getID()
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
        let x = SCENE_Graph.getNode(this.children[0]).evaluateValue()
        let y = SCENE_Graph.getNode(this.children[1]).evaluateValue()
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
  let id = Document.getElementById( identifier + "id")
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

function saveToJSON() {
  let saveFormTextArea = Document.getElementById("saveFormTextArea")
  let savedNodes = JSON.stringify(SCENE_Graph.nodes)
  saveFormTextArea.value = savedNodes
}

Document.onload = function(){
  SCENE_Graph = new Graph();
  // checking if we need to parse/load some JSON
  let LoadElement = Document.getElementById("saveFormTextArea")
  let LoadValue = LoadElement.value
  if (LoadValue.length > 2) {
    objects = JSON.parse(LoadValue)
    // For the moment assuming everything went perfectly
    for (var i = 0; i < objects.length; i++) {
      let newNode = new Node(objects[i]["type"], objects[i]["value"])
      if (objects[i]["parent"].length > 0) {
        newNode.parent = objects[i]["parent"]
      }
      if (objects[i]["children"].length > 0) {
        newNode.children = objects[i]["children"]
      }
      newNode.updateNodeHtml()
      SCENE_Graph.addNode(newNode)
    }
  }

  // Once things are loaded, we remove them from the display
  LoadElement.innerText = ""

  console.log("hellosz");
}
