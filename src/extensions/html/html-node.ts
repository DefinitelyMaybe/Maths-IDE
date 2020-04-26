import { Node, NodeParams } from '../../node.ts'

interface HTMLNodeParams extends NodeParams {
  position: number[]
  el: string
}

class HTMLNode extends Node {
  position: Number[]
  el: string
  /* defines the node for the graph to be later output as an html element */
  constructor (params:HTMLNodeParams) {
    super(params)
    this.position = params.position
    this.el = params.el
  }
}

export { HTMLNode, HTMLNodeParams }