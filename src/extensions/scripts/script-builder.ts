import { Graph, GraphParams, Edges } from '../../graph.ts'
import { VariableNode, VariableNodeParams, FunctionNode, FunctionNodeParams } from './script-nodes.ts'

interface ScriptBuilderParams extends GraphParams{
  nodes: (VariableNode|FunctionNode)[]
}

class ScriptBuilder extends Graph {
  /* takes an in-memory graph and builds an output js */
  constructor (params?:ScriptBuilderParams) {
    super(params)
  }

  build() {
    // one way to build:
    // create a node type for all of the things
    // functions, variables etc...

    let localvariables = ''
    let localfunctions = ''
    let localcalls = this.createLocalCalls()

    this.nodes.forEach(node => {
      if (node instanceof VariableNode) {
        localvariables = localvariables.concat(node.toString() + '\n')
      } else if (node instanceof FunctionNode) {
        localfunctions = localfunctions.concat(node.toString() + '\n')
      }
    });
    // then connect things up
    return `${localvariables}${localfunctions}${localcalls}`
  }

  createNodes(nodes:(VariableNodeParams|FunctionNodeParams)[]) {
    nodes.forEach(obj => {
      if ("value" in obj) {
        this.addNode(new VariableNode(obj))
      } else if ("args" in obj) {
        this.addNode(new FunctionNode(obj))
      }
    });
  }

  addNode(node:(VariableNode|FunctionNode)) {
    this.nodes.push(node)
  }

  inverseEdges() {
    let output: Edges = {}
    // init empty lists
    for (let i = 0; i < this.nodes.length; i++) {
      output[i.toString()] = []
    }
    // add inverse edges
    for (const key in this.edges) {
      const node = Number(key)
      this.edges[key].forEach(out => {
        output[out.toString()].push(node)
      });
    }
    return output
  }

  createLocalCalls() {
    // invert edges
    const edges = this.inverseEdges()

    let output = ''

    // you dont care about any empty lists
    for (const key in edges) {
      if (edges[key].length != 0) {
        // assume function
        // for the moment, not worrying about which
        // args should be in which position
        
        // need name of node
        let tmp = ''
        let args = []
        edges[key].forEach(node => {
          // add name to args list
        });
        // construct call
        // add to output
      }
    }

    return output
  }
}

export { ScriptBuilder }