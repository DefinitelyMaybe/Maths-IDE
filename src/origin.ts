import { ensureDirSync } from 'https://deno.land/std@v0.41.0/fs/mod.ts'
import { ScriptBuilder } from './extensions/scripts/script-builder.ts'
import data from '../data/scripts/graph.ts'

//const decoder = new TextDecoder()
const encoder = new TextEncoder()

function main() {
  console.log("origin is building out examples")
  ScriptBuild()
  HTMLBuild();
}

function ScriptBuild() {
  // make sure the folders exist
  ensureDirSync('./build/script')

  // load up the graph
  const builder = new ScriptBuilder(data)
  // build the output script
  const outdata = builder.build()
  // save the ouput script and the in memory descriptions of the builder
  Deno.writeFileSync("./build/script/script.js", encoder.encode(outdata))
  Deno.writeFileSync("./build/script/builder.json", encoder.encode(JSON.stringify(builder, undefined, '\t')))
}

async function HTMLBuild() {
  // ensure output folder
  ensureDirSync('./build/html')

  // copy main.ts and compiled graph.ts
  const mainData = Deno.readFileSync("./data/html/main.ts")
  Deno.writeFileSync("./build/html/main.js", mainData)

  // copy style.css
  const styleData = Deno.readFileSync("./data/html/style.css")
  Deno.writeFileSync("./build/html/style.css", styleData)

  const [diag, emit] = await Deno.compile("./data/html/graph.ts")
  
  // // ensuring no diagnostics are returned
  if (diag == null) {
    for (const key in emit) {
      const data = emit[key]
      const name = key.split('/').pop()
      Deno.writeFileSync(`./build/html/${name}`, encoder.encode(data))
    }
  } else {
    console.log("diag1")
    diag.forEach(obj => {
      console.log(obj.message)
    });
  };

  // bundle html-builder.js
  const [diag2, emit2] = await Deno.bundle(
    "src/extensions/html/html-builder.ts",
    undefined,
    {
      lib: ["esnext"]
    }
  )
  
  // ensuring no diagnostics are returned
  if (diag2 == null) {
    // for (const key in emit2) {
    //   const data = encoder.encode(emit[key])
    //   const name = key.split('/').pop()
    //   Deno.writeFileSync(`./build/${name}`, data)
    // }
    Deno.writeFileSync(`./build/html/bundle.htmlbuilder.js`, encoder.encode(emit2))
  } else {
    console.log("diag2")
    diag2.forEach(obj => {
      console.log(obj.message)
    });
  };

  // copy .html file from test/html folder to output folder
  const htmlData = Deno.readFileSync("./data/html/index.html")
  Deno.writeFileSync("./build/html/index.html", htmlData)
  
}

if (import.meta.main) {
  main()
}

export {};
