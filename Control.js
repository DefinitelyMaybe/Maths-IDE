//================================================================================================
//objects
//================================================================================================

function Scene() {
	this.canvasOffsetX = 8 // 7 or 8
	this.canvasOffsetY = 7 // 6, 7 or 8
	this.cellsize = 32 //cellsize
	this.objectsArray = new MyArray() //objects array
	this.context = null //context gets set in the onload function
	this.width = 0 //width
	this.height = 0 //height
	this.collisionGranularity = 2
}

//------------------------------------------------------------------------------------------------
function User() {
 	this.curObj = null //current object
 	this.curObjRef = null
	this.mouse = { //mouse
		f: false, // for mouse down and hold.
		sameObj: null
	}
}

//------------------------------------------------------------------------------------------------
function MyArray(){
	//These are used as two stacks
	this.objects = []
	this.freeIndices = []
}

MyArray.prototype.length = function() {
	return this.objects.length
}

MyArray.prototype.removeObject = function(arg) {
	if (typeof arg == "number") {
		this.objects[arg] = null
		this.freeIndices.push(arg)
	} else {
		console.log("MyArray could not removeObject at", arg)
	}
}

MyArray.prototype.addObject = function(arg) {
	if (this.freeIndices.length > 0) {
		index = this.freeIndices.pop()
		this.objects[index] = arg
	} else {
		this.objects.push(arg)
	}
}

MyArray.prototype.getObject = function(arg) {
	if (typeof arg == "number") {
		return this.objects[arg]
	} else {
		console.log("MyArray could not getObject at", arg)
		return
	}
}

MyArray.prototype.nextRef = function() {
	if (this.freeIndices.length > 0) {
		return this.freeIndices[this.freeIndices.length-1]
	} else {
		return this.objects.length
	}
}

MyArray.prototype.linearSearch = function(arg) {
	//Linear search that stops on the first object that is equal to arg
	for (var i = 0; i < this.length(); i++) {
		var obj = this.objects[i]
		if (obj) {
			if (obj.equal(arg)) {
				return [obj, i]
			}
		}
	};
}

//------------------------------------------------------------------------------------------------
function Point(x, y) {
	this.x = x
	this.y = y
}

Point.prototype.equal = function(arg) {
	if (this.x == arg.x) {
		if (this.y == arg.y) {
			return true
		}		
	}
	return false
}

Point.prototype.toString = function() {
	return "", this.x, ", ", this.y
}

//------------------------------------------------------------------------------------------------
function Polygon(x, y, w, h) {
	this.x = x
	this.y = y
	this.w = w
	this.h = h
}

Polygon.prototype.equal = function(arg) {
	if (this.x == arg.x) {
		if (this.y == arg.y) {
			if (this.w == arg.w) {
				if (this.h == arg.h) {
					return true
				}
			}
		}		
	}
	return false
}

Polygon.prototype.toString = function() {
	return "", this.x, ", ", this.y, "; ", this.w, ", ", this.h
}

Polygon.prototype.checkPolygon = function(arg) {
	if (arg instanceof Polygon) {
		x = this.findClosestPoints(arg)
		a = new Point(x[0], x[1])
		b = new Point(x[2], x[3])
		return (this.checkPoint(a) || arg.checkPoint(b))
	} else {
		console.log("Polygon.checkPolygon requires a Polygon but got", arg)
		return
	}
}

Polygon.prototype.checkPoint = function(arg) {
	if (arg instanceof Point ) {
		numX = arg.x
		numY = arg.y
		if (this.h >= 0) {
			//height is postive
			if (this.w >= 0) {
				//width is postive
				if ((this.x <= numX) && (this.x + this.w >= numX)) {
					if ((this.y <= numY) && (this.y + this.h >= numY)) {
						return true
					}
				}
			else
				//width is negative
				if ((this.x >= numX) && (this.x + this.w <= numX)) {
					if ((this.y <= numY) && (this.y + this.h >= numY)) {
						return true
					}
				}
			}
		} else {
			//height is negative
			if (this.w >= 0) {
				//width is postive
				if ((this.x <= numX) && (this.x + this.w >= numX)) {
					if ((this.y >= numY) && (this.y + this.h <= numY)) {
						return true
					}
				}
			} else {
				//width is negative
				if ((this.x >= numX) && (this.x + this.w <= numX)) {
					if ((this.y >= numY) && (this.y + this.h <= numY)) {
						return true
					}
				}
			}
		}
		return false
	} else {
		console.log("collision.checkPoint() needed a point but got", arg)
		return
	}
}

Polygon.prototype.findClosestPoints = function(arg) {
	var shortestDistance = Infinity
	var closestPoints = []
	if (arg instanceof Point) {
		x2 = arg.x
		y2 = arg.y
		for (var i = 0; i < 4; i++) {
			if (i == 0) {
			   	x1 = this.x
			   	y1 = this.y
			} else if (i == 1) {
				x1 = this.x + this.w
				y1 = this.y
			} else if (i == 2) {
				x1 = this.x
				y1 = this.y + this.h
			} else if (i == 3) {
				x1 = this.x + this.w
				y1 = this.y + this.h
			}
			a = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
			if (a < shortestDistance) {
				shortestDistance = a
				closestPoints = [x2, y2, x1, y1]
			}
		}
		return closestPoints
	} else if (arg instanceof Polygon) {
		for (var i = 0; i < 4; i++) {
			if (i == 0) {
			   	x1 = this.x
			   	y1 = this.y
			} else if (i == 1) {
				x1 = this.x + this.w
				y1 = this.y
			} else if (i == 2) {
				x1 = this.x
				y1 = this.y + this.h
			} else if (i == 3) {
				x1 = this.x + this.w
				y1 = this.y + this.h
			}
			for (var j = 0; j < 4; j++) {
				if (j == 0) {
					x2 = arg.x
					y2 = arg.y
				}else if (j == 1) {
					x2 = arg.x + arg.w
					y2 = arg.y
				} else if (j == 2) {
					x2 = arg.x
					y2 = arg.y + arg.h
				} else if (j == 3) {
					x2 = arg.x + arg.w
					y2 = arg.y + arg.h
				}
				a = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
				if (a < shortestDistance) {
					shortestDistance = a
					closestPoints = [x2, y2, x1, y1]
				}
			}
		}
		return closestPoints
	} else {
		console.log("Polygon.findClosestPoints needs a Point or Polygon but got", arg)
		return
	}
}

//------------------------------------------------------------------------------------------------
function GreyBox(x, y, w, h) {
	Polygon.call(this, x, y, w, h)

	this.focus = true //This is for checking it the user has it selected.
	this.index = null //Stores it's index value inside of scene.objectsArray
}

GreyBox.prototype = Object.create(Polygon.prototype)

GreyBox.prototype.draw = function(arg) {
	if (this.focus) {
		arg.fillStyle = "grey"
	} else {
		arg.fillStyle = "black"
	}
	arg.fillRect(this.x, this.y, this.w, this.h)
}

//------------------------------------------------------------------------------------------------
function CollBox(x, y, w, h) {
	Polygon.call(this, x, y, w, h)

	this.objRefs = []
}

CollBox.prototype = Object.create(Polygon.prototype)

CollBox.prototype.removeIndex = function(arg) {
	if (typeof arg == "number") {
		x = []
		for (var i = 0; i < this.objRefs.length; i++) {
			if (this.objRefs[i] != arg) {
				x[x.length] = this.objRefs[i]
			}
		}
		this.objRefs = x
	} else {
		console.log("CollBox.removeIndex did not remove", arg)
	}
}

CollBox.prototype.draw = function(arg) {
	arg.fillStyle = "#38e1ff"
	arg.fillRect(this.x, this.y, this.w, this.h)
}

//------------------------------------------------------------------------------------------------
function Collision(arg) {
	//This breaks down the screen into smaller squares that store references to the objects within
	//them.
	this.collBoxes = []
	var num = arg.collisionGranularity
	var divW = arg.width / num
	var divH = arg.height / num

	//setup a number of collboxes
	for (var i = 0; i < num; i++) {
		for (var j = 0; j < num; j++) {
			x = Math.ceil(j*divW)
			y = Math.ceil(i*divH)
			this.collBoxes[this.collBoxes.length] = new CollBox(x, y, divW, divH)
		}
	}
}

Collision.prototype.addObjectReference = function(collArray, objIndex) {
	if ((Array.isArray(collArray)) && (typeof objIndex == "number")) {
		for (var i = 0; i < collArray.length; i++) {
			x = this.collBoxes[collArray[i]]
			x.objRefs[x.objRefs.length] = objIndex
		}
	} else {
		console.log("Collision.addObjectReference requires two numbers; collArray, objIndex.")
		console.log("Instead it got:", collArray, "and", objIndex)
	}
}

Collision.prototype.removeIndice = function(arg) {
	if (typeof arg == "number") {
		for (var i = 0; i < this.collBoxes.length; i++) {
			this.collBoxes[i].removeIndex(arg)
		}
	} else {
		console.log("Collision.removeIndice requires a number but got", arg)
	}
}

Collision.prototype.checkObject = function(arg) {
	var bool = false
	var collObjRef = null
	var collBoxNums = []
	var collBoxRefs = []
	if (arg instanceof Point) {
		//console.log("checkObj -> point")
		//if bool gets set to a true value then the return will need to been given the
		//index of the object it collided with.
		for (var i = 0; i < this.collBoxes.length; i++) {
			if (this.collBoxes[i].checkPoint(arg)) {
				//console.log("collision evaluated:", arg, " to be inside of", this.collBoxes[i])
				collBoxRefs = collBoxRefs.concat(this.collBoxes[i].objRefs)
				if (collBoxNums.length == 1) {
					console.log(arg, "collided with two or more collboxes")
					console.log("collbox[", i, "] and collbox[", collBoxNums[0], "]")
				}
				collBoxNums = [i] //setting to a list so that when it gets returned can not
				//worry about the number of collpolygons an instance of collpolygon 
				//would've returned
			} else {
				//console.log("collision evaluated:",arg," to NOT be inside of", this.collBoxes[i])
			}
		}
		for (var i = 0; i < collBoxRefs.length; i++) {
			var x = scene.objectsArray.getObject(collBoxRefs[i])
			//if (bool) {
			//	console.log(arg, "collided with two or more objects;", x)
			//}
			if (x.checkPoint(arg)) {
				bool = true
				collObjRef = x.index
			}
		}
		if (bool) {
			return [bool, collObjRef] //return the reference of the obj that we collided with
		} else {
			//console.log("this.collboxes -> false")
			return [bool, collBoxNums] //return the box to add reference to
		}
		
	} else if (arg instanceof Polygon) {
		
		//for (var i = 0; i < this.collBoxes.length; i++) {
		//	if (this.collBoxes[i].checkPolygon(arg)) {
		//		x = x.concat(this.collBoxes[i].getReferences)
		//		if (y == null) {
		//			y = i
		//		} else {
		//			console.log("Collision.getIndices - CollPolygon didn't expect this")
		//			console.log("and might not have given an appropriate result")
		//		}
		//		
		//	}
		//}
		console.log("collision for polygon is not done yet")
	} else {
		console.log("Collision.checkObj requires a point or polygon but got", arg)
	}
}

//------------------------------------------------------------------------------------------------
function Draw(arg) {
	//wants to write a couple of properties from the scene object
	this.ctx = arg.context
	this.cell = arg.cellsize
	this.divWidth = Math.ceil(canvas_1.width/this.cell)
	this.divHeight = Math.ceil(canvas_1.height/this.cell)
}

Draw.prototype.object = function(arg) {
		if (typeof arg.draw == "function") {
			arg.draw(this.ctx)
		} else {
			try {
				arg.draw(this.ctx)
			} catch (e) {

			}
			//console.log("draw type of arg is", typeof(arg.draw))
		}
}

Draw.prototype.background = function() {
	this.ctx.fillStyle = "white"
	this.ctx.fillRect(0, 0, canvas_1.width, canvas_1.height)

	this.ctx.strokeStyle = "black"//"#38e1ff" // black is also a nice colour
	this.ctx.strokeWidth = 5
	this.ctx.beginPath()
	for (var i = 0; i < this.divWidth; i++) {
		this.ctx.moveTo(i * this.cell, 0)
		this.ctx.lineTo(i * this.cell, canvas_1.height)
	}
	for (var i = 0; i < this.divHeight; i++) {
		this.ctx.moveTo(0, i * this.cell)
		this.ctx.lineTo(canvas_1.width, i * this.cell)
	}
	this.ctx.stroke()
}


//================================================================================================
//functions
//================================================================================================

function keyboardMouseSetup(arg) {
	var cell = arg.cellsize
	var offX = arg.canvasOffsetX
	var offY = arg.canvasOffsetY

	$("#canvas_1").mousedown(function(data) {
		user.mouse.f = true
		var sqrX = Math.floor((data.pageX - offX) / cell) * cell
		var sqrY = Math.floor((data.pageY - offY) / cell) * cell

		//This returns a list of values because I dont want to re-calculate some things
		check = collision.checkObject(new Point(data.pageX - offX, data.pageY - offY))
		if (check[0]) {
			//There was something there so grab a reference to use later.
			//console.log("mouse click was evaluated to true")
			obj = scene.objectsArray.getObject(check[1])
			if (user.curObj) {
				//they are currently looking at an object
				if (!user.curObj.equal(obj)) {
					//and it was NOT the same object they collided with 
					user.curObj.focus = false
					//get the existing other one and set in focus
					obj.focus = true
					user.curObj = obj
					user.curObjRef = obj.index
				} else {
					user.mouse.sameObj = true
				}
			} else {
				//user didn't have anything previously selected so just setup the object the
				//mouse click collided with
				obj.focus = true
				user.curObj = obj
				user.curObjRef = obj.index
			}
		} else {
			//if there is no object at that point. create an Grey box.
			//console.log("mouse click was evaluated to false")
			obj = new GreyBox(sqrX, sqrY, cell, cell)
			obj.index = scene.objectsArray.nextRef()
			if (user.curObj) {
				user.curObj.focus = false
			}
			user.curObj = obj
			user.curObjRef = obj.index
			scene.objectsArray.addObject(obj)
			collision.addObjectReference(check[1], obj.index) //CollBox indices and the obj.index
			//Making sure the user object knows there wasn't a collision object to reference
			user.mouse.sameObj = false
		}
	})

	$("#canvas_1").mousemove(function(data) {
		var sqrX = Math.floor((data.pageX - offX) / cell) * cell
		var sqrY = Math.floor((data.pageY - offY) / cell) * cell

		if (user.mouse.f) {
			if (user.curObj) {
				//this will just be moving the currently selected object.
				//fine movement until mouseup at which point, snap to box
				//check = collision.checkPolygon(user.curObj)
				//if (check[0]) {
				//	console.log("HERE!")
				//}
			} else {
				return
			}
		}
	})

	$(document).mouseup(function(data) {
		//user is finishing the click.
		if (user.curObj) {
			//they are currently looking at an object
			if (user.mouse.sameObj) {
				//and it was the same object they collided with 
				if (user.curObj.focus) {
					user.curObj.focus = false
					user.curObj = null
					user.curObjRef = null
				} else {
					user.curObj.focus = true
				}
				//Making sure this loop isn't entered without the correct click conditions.
				user.mouse.sameObj = false
			}
		}
		user.mouse.f = false
	})

	$(document).keydown(function(data) {
		if (user.curObj) {
			if (user.curObj.focus) {
				scene.objectsArray.removeObject(user.curObj.index)
				collision.removeIndice(user.curObj.index)
				user.curObj = null
			}
		}
	})
}

//================================================================================================
//runtime
//================================================================================================

onload = function () {
	scene = new Scene()
	scene.context = document.getElementById("canvas_1").getContext("2d")
	scene.width = document.getElementById("canvas_1").width
	scene.height = document.getElementById("canvas_1").height

	collision = new Collision(scene)

	user = new User()
	draw = new Draw(scene)

	keyboardMouseSetup(scene)

	setInterval(function(){
		draw.background()

		//for (var i = 0; i < collision.collBoxes.length; i++) {
		//	draw.object(collision.collBoxes[i])
		//}
		if (scene.objectsArray.length() > 0) {
			for (var i = 0; i < scene.objectsArray.length(); i++) {
				var x = scene.objectsArray.getObject(i)
				if (x != "undefined") {
					draw.object(x)
				}				
			}
		}
	}, 60)
}
