import { Node, NodeParams } from "./node.ts";

interface GraphParams {
  nodes: NodeParams[];
  edges: Edges;
}

interface Edges {
  [index: string]: (number)[];
}

//defines graph using an adjacency list
class Graph {
  nodes: (Node)[];
  edges: Edges;
  deletedNodes: number[];

  constructor(params?: GraphParams) {
    this.nodes = [];
    this.edges = params ? params.edges : {};
    this.deletedNodes = [];

    if (params) {
      this.createNodes(params.nodes);
    }
  }

  // Graph operations
  createNodes(nodes: NodeParams[]) {
    nodes.forEach((obj) => {
      this.addNode(new Node(obj));
    });
  }

  // addition
  addNode(node: Node) {
    this.nodes.push(node);
  }

  addEdge(from: string, to: number) {
    this.edges[from].push(to);
  }

  // subtraction
  delNode(node: number) {
    // loop through edges lists looking for
    // particular node and removing it
    for (const key in this.edges) {
      if (this.edges[key].includes(node)) {
        // delete the node
        const index = this.edges[key].indexOf(node);
        this.edges[key].splice(index, 1);
      }
    }
    // find the node and delete it
    delete this.nodes[node];
    delete this.edges[node.toString()];
    // add that node index to the delete index
    // i.e. for later use
    this.deletedNodes.push(node);
  }

  delEdge(from: string, to: number) {
    if (this.edges[from].includes(to)) {
      const index = this.edges[from].indexOf(to);
      this.edges[from].splice(index, 1);
    } else {
      console.warn(`${to} is not an edge within ${this.edges[from]}`);
    }
  }

  inverseEdges() {
    let output: Edges = {};
    // init empty lists
    for (let i = 0; i < this.nodes.length; i++) {
      output[i.toString()] = [];
    }
    // add inverse edges
    for (const key in this.edges) {
      const node = Number(key);
      this.edges[key].forEach((out) => {
        output[out.toString()].push(node);
      });
    }
    return output;
  }

  // other possible operations

  //search
  depthFirstSearch() {}
  breadthFirstSearch() {}

  // contraction
  contractEdge() {}

  // transform the graph repr so that some operations are faster
  changeRepr() {}

  // reverse all of the edges
  transpose() {}

  // fills all missing edges and then takes away initial edges
  complement() {}

  // Graph^n connects existing nodes to all other nodes that are n edges away
  power() {}

  // minimum number of additions, subtractions, contractions,
  editDistance() {}
}

export { Graph, GraphParams, Edges };
