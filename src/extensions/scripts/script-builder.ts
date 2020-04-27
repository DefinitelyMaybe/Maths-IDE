import { Graph, GraphParams, Edges } from "../../graph.ts";
import {
  VariableNode,
  VariableNodeParams,
  FunctionNode,
  FunctionNodeParams,
} from "./script-nodes.ts";

interface ScriptBuilderParams extends GraphParams {
  nodes: (VariableNode | FunctionNode)[];
}

// can build some basic scripts
class ScriptBuilder extends Graph {
  nodes: (VariableNode | FunctionNode)[];
  /* takes an in-memory graph and builds an output js */
  constructor(params?: ScriptBuilderParams) {
    super(params);
    this.nodes = [];

    if (params) {
      this.createNodes(params.nodes);
    }
  }

  build(): string {
    // one way to build:
    // create a node type for all of the things
    // functions, variables etc...

    let localvariables = "";
    let localfunctions = "";
    let localcalls = this.createLocalCalls();

    this.nodes.forEach((node) => {
      if (node instanceof VariableNode) {
        localvariables = localvariables.concat(node.toString() + "\n");
      } else if (node instanceof FunctionNode) {
        localfunctions = localfunctions.concat(node.toString() + "\n");
      }
    });
    // then connect things up
    return `${localvariables}${localfunctions}${localcalls}`;
  }

  createNodes(nodes: (VariableNodeParams | FunctionNodeParams)[]) {
    nodes.forEach((obj) => {
      if ("value" in obj) {
        this.addNode(new VariableNode(obj));
      } else if ("args" in obj) {
        this.addNode(new FunctionNode(obj));
      }
    });
  }

  addNode(node: (VariableNode | FunctionNode)) {
    this.nodes.push(node);
  }

  createLocalCalls() {
    // invert edges
    const inverseEdges = this.inverseEdges();

    let output = "";

    // you dont care about any empty lists
    for (const key in inverseEdges) {
      let node = parseInt(key);
      if (inverseEdges[key].length != 0 && this.nodes[node]) {
        // assume function
        // for the moment, not worrying about which
        // args should be in which position

        // need name of node
        const name = this.nodes[node].name;
        let args: string[] = [];

        inverseEdges[key].forEach((n) => {
          // add name to args list
          args.push(this.nodes[n].name);
        });
        // construct call and add to output
        output = output.concat(`${name}(${args.toString()})\n`);
      }
    }

    return output;
  }
}

export { ScriptBuilder, ScriptBuilderParams };
