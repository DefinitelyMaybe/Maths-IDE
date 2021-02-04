/// <reference lib="dom" />
import { create, Tweakpane } from "./deps";

const pane = new Tweakpane.default()
const f = pane.addFolder({
  title: "My Folder",
  expanded: true,
})

const params = {
  text: "hello world",
  number: 104,
  float: 0.1,
  bool: false,
  color: "#000000"
}

f.addInput(params, 'text')
f.addInput(params, 'number', {step:10, min:10, max:300})
f.addInput(params, 'float')
f.addInput(params, 'bool')
f.addInput(params, 'color', {input:'color'})
const tweakBtn1 = f.addButton({title:"increment"})
tweakBtn1.on("click", () => {
  params.float += 10
})
const tweakBtn2 = f.addButton({title:"decrement"})
tweakBtn2.on("click", () => {
  params.float -= 10
})
f.addSeparator()
f.addMonitor(params, 'float', {view:'graph'})

const canvas = document.querySelector("canvas") as HTMLCanvasElement
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const confetti = create(canvas, {
  resize:true,
  useWorker:true
})

const confettiBtn = document.querySelector("button") as HTMLButtonElement

confettiBtn.addEventListener("click", () => {
  confetti({particleCount:params.number, spread:360})
})

// The minimum prediction confidence.
// const threshold = 0.9;

// const toxicity = new ToxicityClassifier(threshold)
// const sentences = ['you suck'];

// async function main() {
//   await toxicity.load()
//   const predictions = await toxicity.classify(sentences)

//   predictions.forEach( pred => {
//     console.log(`${pred.label} - ${pred.results[0].match}`);
//   });
// }

// main()
