interface NodeParams {
  id:number
}

class Node {
  id:number
  /* defines the node for the graph */
  constructor (params:NodeParams) {
    this.id = params.id
  }
}

export { Node, NodeParams }