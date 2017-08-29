//these two lines would only be appropriate if I needed access to a db or similar.
//const remote = require('electron').remote;
//const main = remote.require('./main.js');
const $ = require('jquery');

//------------------Globals------------------
let mainScene

//------------------Classes------------------
class ReferenceStack {
  constructor() {
    this.boxRefs = []
    this.freeBoxRefs = []

    this.matRefs = []
    this.freeMatRefs = []
  }

  createRef(type){
    switch (type) {
      case "matrix":
        if (this.freeMatRefs.length > 0) {
          return this.freeMatRefs.pop()
        } else {
          let a = "matrix" + this.matRefs.length
          this.matRefs.push(a)
          return a
        }
        break;
      default:
        //default will create an empty 1x1 box.
        if (this.freeBoxRefs.length > 0) {
          return this.freeBoxRefs.pop()
        } else {
          let a = "box" + this.boxRefs.length
          this.boxRefs.push(a)
          return a
        }
    }
  }
}

class Scene {
  constructor(cellSize) {
    this.refStack = new ReferenceStack()

  	this.ghostObject = null
  	this.currentObject = null

  	this.cellSize = cellSize
  }
}

//------------------Functions------------------
function test1() {
  console.log("test complete.");
}
function create(type) {
  //creates an html object and returns a reference to that object
  let ref
  let x
  let y
  switch (type) {
    case "matrix":
      ref = mainScene.refStack.createRef("box")
      //create the html object
      x = document.createElement("table")
      $(x).attr("id", ref)
      $(x).addClass("box")
      y = document.createElement("td")
      y.innerHTML = "Matrix"
      x.appendChild(y)
      document.body.appendChild(x)
      $("#"+ref).click( function(){
        //console.log(ref + " was clicked.");
      });
      return ref
      break;
    default:
      //by default will create a empty 1x1 box
      ref = mainScene.refStack.createRef("box")
      //create the html object
      x = document.createElement("table")
      $(x).attr("id", ref)
      $(x).addClass("box")
      y = document.createElement("td")
      y.innerHTML = "Placeholder text."
      x.appendChild(y)
      document.body.appendChild(x)
      $("#"+ref).click( function(){
        //console.log(ref + " was clicked.");
      });
      return ref

  }
}

function getClosestBoxRef(element) {
  let closest = $(element).closest(".box")
  if (closest.length === 1) {
    box = closest[0]
    return $(box).attr("id")
  }
}

//document.customElements.whenDefined('origin-node').then(() => {console.log('origin-node defined.');});

//------------------binding callbacks/initialization------------------
mainScene = new Scene(40)
//customElements.define("origin-node", Node);

$("body").on("click", function(event){
  let key = event.which
  let type = event.type

  //console.log(type + " " + key);
  let ctx = $("#contextmenu")

  if (ctx) {
    console.log("yup");
    ctx.hide()
  } else {
    console.log("nupe");
  }

  if (type === "click" && key === 1) {
    // TODO: if location is free then create new box otherwise select box
    //Does (x, y) collide with any objects in the scene?
    //If this function returns something other than undefined then yes (x, y) hit an object
    let rootBox = getClosestBoxRef(event.target)

    if (rootBox) {
      //yes? select it.
      mainScene.currentObject = rootBox
    } else {
      // TODO: Left click on screen does...
      //let refx = create("box")
      //$("#"+refx).css({"top": y+"px", "left": x+"px",})
      //mainScene.currentObject = refx
    }
  }
});

$("body").contextmenu(function(){
  console.log("right click?");
  let x = Math.floor(event.pageX/mainScene.cellSize) * mainScene.cellSize
  let y = Math.floor(event.pageY/mainScene.cellSize) * mainScene.cellSize
  $("#contextmenu").css({"top": y+"px", "left": x+"px",})
  $("#contextmenu").show()
});

$(document).ready(function(){
 console.log("Ready!");

});
