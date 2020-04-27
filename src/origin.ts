import htmlTestData from "../test/html.ts";
import { HTMLBuilder } from "./extensions/html/html-builder.ts";

function main(): void {
  const builder = new HTMLBuilder(htmlTestData);
  console.log(JSON.stringify(builder));
}

if (import.meta.main) {
  main();
}

export {};
