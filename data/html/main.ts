// @ts-nocheck
import data from './graph.js'
import { HTMLBuilder } from './bundle.htmlbuilder.js'

console.log(data)

const builder = new HTMLBuilder(data)
const container = builder.build()

document.body.appendChild(container)
