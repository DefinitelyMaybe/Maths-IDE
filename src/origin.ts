import { ensureDirSync } from 'https://deno.land/std/fs/mod.ts'

const decoder = new TextDecoder()
const encoder = new TextEncoder()

function main() {
  
  console.log("main")
  HTMLBuild();
}

async function HTMLBuild() {
  // ensure output folder
  ensureDirSync('./build/html')

  // compile main.ts and graph.ts
  // const graphData = Deno.readFileSync("./test/html/graph.ts")
  // const graphString = decoder.decode(graphData)

  // const mainData = Deno.readFileSync("./test/html/main.ts")
  // const mainString = decoder.decode(mainData)

  const [diag, emitMap] = await Deno.compile("./test/html/main.ts")//, undefined, {"lib":["dom", "deno.ns"]});
  
  // ensuring no diagnostics are returned
  if (diag == null) {
    console.log(emitMap)
    // output these files to the build folder
    // const mainScript = encoder.encode(emitMap["main.js"])
    // const graphScript = encoder.encode(emitMap["graph.js"])
    
    // Deno.writeFileSync("./build/html/main.js", mainScript)
    // Deno.writeFileSync("./build/html/graph.js", graphScript)
  } else {
    // otherwise logging their messages
    diag.forEach(obj => {
      console.log(obj.message) 
    });
  }; 

  // copy .html file from test/html folder to output folder
  const htmlData = Deno.readFileSync("./test/html/index.html")
  Deno.writeFileSync("./build/html/index.html", htmlData)
  
}

// if (import.meta.main) {
//   main()
// }

main()

export {};
