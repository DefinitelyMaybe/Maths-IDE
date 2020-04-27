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

  // copy main.ts and compiled graph.ts
  const mainData = Deno.readFileSync("./test/html/main.js")
  Deno.writeFileSync("./build/html/main.js", mainData)

  let [diag, emit] = await Deno.compile("./test/html/graph.ts")
  
  // ensuring no diagnostics are returned
  if (diag == null) {
    for (const key in emit) {
      const data = emit[key]
      const name = key.split('/').pop()
      Deno.writeFileSync(`./build/html/${name}`, encoder.encode(data))
    }
  } else {
    // otherwise logging their messages
    diag.forEach(obj => {
      console.log(obj.message) 
    });
  }; 

  // create html-builder.ts
  [diag, emit] = await Deno.bundle("./src/extensions/html-builder.ts")
  
  // ensuring no diagnostics are returned
  if (diag == null) {
    for (const key in emit) {
      const data = emit[key]
      const name = key.split('/').pop()
      Deno.writeFileSync(`./build/html/${name}`, encoder.encode(data))
    }
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
