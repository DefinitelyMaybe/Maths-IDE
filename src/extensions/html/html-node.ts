/// <reference lib="dom" />
import {
  VariableNode,
  VariableNodeParams,
  FunctionNode,
  FunctionNodeParams,
} from "../scripts/script-nodes.ts";

interface HTMLVariableNodeParams extends VariableNodeParams {
  position: number[];
  el: string;
}

class HTMLVariableNode extends VariableNode {
  position: Number[];
  el: string;
  /* defines the node for the graph to be later output as an html element */
  constructor(params: HTMLVariableNodeParams) {
    super(params);
    this.position = params.position;
    this.el = params.el;
  }
  build () {
    return document.createElement(this.el)
  }
}

interface HTMLFunctionNodeParams extends FunctionNodeParams {
  position: number[];
  el: string;
}

class HTMLFunctionNode extends FunctionNode {
  position: Number[];
  el: string;
  /* defines the node for the graph to be later output as an html element */
  constructor(params: HTMLFunctionNodeParams) {
    super(params);
    this.position = params.position;
    this.el = params.el;
  }

  build () {
    return document.createElement(this.el)
  }
}

export {
  HTMLVariableNode,
  HTMLVariableNodeParams,
  HTMLFunctionNode,
  HTMLFunctionNodeParams,
};
