import htmlTestData from '../test/html.ts'
import ScriptTestData from '../test/script.ts'
import { HTMLBuilder } from './extensions/html/html-builder.ts'
import { ScriptBuilder } from './extensions/scripts/script-builder.ts'

const encoder = new TextEncoder()

function main(): void {
  // take script-data input and convert it into a script
  const x = new HTMLBuilder(htmlTestData)
  const y = new ScriptBuilder(ScriptTestData)

  const xd = encoder.encode(JSON.stringify(x, undefined, '\t'))
  const yd = encoder.encode(JSON.stringify(y, undefined, '\t'))

  const sd = encoder.encode(y.build())
  
  Deno.writeFileSync('./test/output/html.json', xd)
  Deno.writeFileSync('./test/output/script.json', yd)
  Deno.writeFileSync('./test/output/script.js', sd)
}


if (import.meta.main) {
  main()
}

export {  }