/// <reference lib="dom" />
import { Graph } from "../../graph.ts";
import { ScriptBuilderParams } from "../scripts/script-builder.ts";
import {
  HTMLVariableNode,
  HTMLVariableNodeParams,
  HTMLFunctionNode,
  HTMLFunctionNodeParams,
} from "./html-node.ts";

interface HTMLBuilderParams extends ScriptBuilderParams {
  nodes: (HTMLVariableNodeParams | HTMLFunctionNodeParams)[];
}

class HTMLBuilder extends Graph {
  nodes: (HTMLVariableNode | HTMLFunctionNode)[];
  /* takes an in-memory graph and builds an output html */
  constructor(params?: HTMLBuilderParams) {
    params ? super(params) : super();
    this.nodes = [];

    if (params) {
      this.createNodes(params.nodes);
    }
  }

  createNodes(nodes: (HTMLVariableNodeParams | HTMLFunctionNodeParams)[]) {
    nodes.forEach((obj) => {
      if ("value" in obj) {
        this.addNode(new HTMLVariableNode(obj));
      } else if ("args" in obj) {
        this.addNode(new HTMLFunctionNode(obj));
      }
    });
  }

  addNode(node: (HTMLVariableNode | HTMLFunctionNode)) {
    this.nodes.push(node);
  }

  build() {
    // create container
    const container = document.createElement("main");

    // add elements to container
    this.nodes.forEach((obj) => {
      if (obj) {
        // create the node
        const node = obj.build()

        // attach properties
        // attach listeners

        // attach to container
        container.appendChild(node);
      }
    });

    return container;
  }
}

export { HTMLBuilder, HTMLBuilderParams };
