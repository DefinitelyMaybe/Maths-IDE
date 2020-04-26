import { Graph, GraphParams } from '../../graph.ts'
import { HTMLNode, HTMLNodeParams } from './html-node.ts'

interface HTMLBuilderParams extends GraphParams {
  nodes: HTMLNodeParams[]
}

class HTMLBuilder extends Graph {
  /* takes an in-memory graph and builds an output html */
  constructor (params?: HTMLBuilderParams) {
    params? super(params) : super()
  }

  createNodes(nodes:HTMLNodeParams[]) {
    nodes.forEach(obj => {
      this.addNode(new HTMLNode(obj))
    });
  }

  addNode(node:HTMLNode) {
    this.nodes.push(node)
  }
}

export { HTMLBuilder, HTMLBuilderParams }