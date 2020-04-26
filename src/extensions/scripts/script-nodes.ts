import { Node, NodeParams } from '../../node.ts'

interface VariableNodeParams extends NodeParams {
  name: string
  value: any
}

interface FunctionNodeParams extends NodeParams {
  name: string
  args: string[]
  body: string
}

class VariableNode extends Node {
  name:string
  value: any
  /* defines the node for the graph to be later output with a script */
  constructor (params: VariableNodeParams) {
    super(params)
    this.name = params.name
    this.value = params.value
  }

  toString() {
    return `const ${this.name} = ${this.value}`
  }
}

class FunctionNode extends Node {
  name:string
  args: string[]
  body: string
  /* defines the node for the graph to be later output with a script */
  constructor (params: FunctionNodeParams) {
    super(params)
    this.name = params.name
    this.args = params.args
    this.body = params.body
  }

  toString() {
    return `function ${this.name} (${this.args}) {\n\t${this.body}\n}`
  }
}

export { VariableNode, VariableNodeParams, FunctionNode, FunctionNodeParams}