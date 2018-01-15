class Node {
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

module.exports = Node;
