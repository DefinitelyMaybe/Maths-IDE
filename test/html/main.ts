import data from './graph.ts'
import { HTMLBuilder } from '../../src/extensions/html/html-builder.ts'

console.log(data)

const builder = new HTMLBuilder(data)
const container = builder.build()

document.body.appendChild(container)
