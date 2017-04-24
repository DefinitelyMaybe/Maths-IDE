//these two lines would only be appropriate if I needed access to a db or similar.
//const remote = require('electron').remote;
//const main = remote.require('./main.js');
const $ = require('jquery');

//-----------------------------------------------------------------------
//Globals
let mainScene

//-----------------------------------------------------------------------
//Classes
class ReferenceStack {
  constructor() {
    this.boxRefs = []
    this.freeBoxRefs = []
  }
  createBoxRef(){
    if (this.freeBoxRefs.length > 0) {
      return this.freeBoxRefs.pop()
    } else {
      let a = "box" + this.boxRefs.length
      this.boxRefs.push(a)
      return a
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

//-----------------------------------------------------------------------
//Functions
function createBox() {
  let ref = mainScene.refStack.createBoxRef()
  //create the html object
  let x = document.createElement("table")
  $(x).attr("id", ref)
  $(x).addClass("box")
  let y = document.createElement("td")
  y.innerHTML = "Placeholder text."
  x.appendChild(y)
  document.body.appendChild(x)
  $("#"+ref).click( function(){
    console.log(ref + " was clicked.");
  });
  return ref
}

function getClosestBoxRef(element) {
  let closest = $(element).closest(".box")
  if (closest.length === 1) {
    box = closest[0]
    return $(box).attr("id")
  }
}
//-----------------------------------------------------------------------
//window life cycle
mainScene = new Scene(40)

$("body").on("click", function(event){
  let key = event.which
  let type = event.type

  console.log(type + " " + key);

  if (type === "click" && key === 1) {
    // TODO: if location is free then create new box otherwise select box
    //Does (x, y) collide with any objects in the scene?
    //If this function returns something other than undefined then yes (x, y) hit an object
    let rootBox = getClosestBoxRef(event.target)

    if (rootBox) {
      //yes? select it.
      mainScene.currentObject = rootBox
    } else {
      //no? create a new box
      let x = Math.floor(event.pageX/mainScene.cellSize) * mainScene.cellSize
      let y = Math.floor(event.pageY/mainScene.cellSize) * mainScene.cellSize
      let refx = createBox()
      $("#"+refx).css({"top": y+"px", "left": x+"px",})
      mainScene.currentObject = refx
    }
  }
});

$(document).ready(function(){
 console.log("here we go!");
});
