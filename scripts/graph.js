class myNode {
  constructor(nodeID, nodeType) {
    this.id = nodeID
    this.type = nodeType
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

class myGraph {
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

module.exports = {myGraph, myNode}
