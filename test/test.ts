// import htmlTestData from "../test/html.ts";
// import ScriptTestData from "../test/script.ts";
// import { HTMLBuilder } from "../src/extensions/html/html-builder.ts";
// import { ScriptBuilder } from "../src/extensions/scripts/script-builder.ts";

// const encoder = new TextEncoder();

// // take script-data input and convert it into a script
// const x = new HTMLBuilder(htmlTestData);
// const y = new ScriptBuilder(ScriptTestData);

// const xd = encoder.encode(JSON.stringify(x, undefined, "\t"));
// const yd = encoder.encode(JSON.stringify(y, undefined, "\t"));

// const sd = encoder.encode(y.build());

// Deno.writeFileSync("./test/output/html.json", xd);
// Deno.writeFileSync("./test/output/script.json", yd);
// Deno.writeFileSync("./test/output/script.js", sd);

// and then check that the outputs are equal to the inputs
//Register test
Deno.test({
  name: "example test",
  fn(): void {
    console.assert("world" === "world", "world test");
    console.assert({ hello: "world" } === { hello: "world" }, "hello world object test");
  },
});

//Run tests
const runInfo = await Deno.runTests() || undefined;
if (runInfo) {
  console.log(runInfo.duration);  // all tests duration, e.g. "5" (in ms)
  console.log(runInfo.passed);  //e.g. 1
  console.log(runInfo.results[0].name);  //e.g. "example test" 
}

export {}