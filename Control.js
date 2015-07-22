//================================================================================================
//objects
//================================================================================================

function Scene() {
	this.cellsize = 32 //cellsize
	this.objectsArray = new MyArray() //objects array
	this.context = null //context gets set in the onload function
	this.width = 0 //width
	this.height = 0 //height
	//change this to be relative to the cells?
	this.collisionGranularity = 3
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
	//These are used as a stack and an array.
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
			if (shortestDistance == 0) {
				return closestPoints
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
		//if bool gets set to a true value then the return will need to been given the
		//index of the object it collided with.
		for (var i = 0; i < this.collBoxes.length; i++) {
			if (this.collBoxes[i].checkPoint(arg)) {
				collBoxRefs = collBoxRefs.concat(this.collBoxes[i].objRefs)
				if (collBoxNums.length == 1) {
					console.log(arg, "collided with two or more collboxes")
					console.log("collbox[", i, "] and collbox[", collBoxNums[0], "]")
				}
				collBoxNums = [i] //setting to a list so that when it gets returned can not
				//worry about the number of collpolygons an instance of collpolygon 
				//would've returned
			}
		}
		for (var i = 0; i < collBoxRefs.length; i++) {
			var x = scene.objectsArray.getObject(collBoxRefs[i])
			if (x.checkPoint(arg)) {
				bool = true
				collObjRef = x.index
			}
		}
		if (bool) {
			//return the reference of the obj that we collided with
			return [bool, collObjRef]
		} else {
			//return the box to add reference to
			return [bool, collBoxNums]
		}
		
	} else if (arg instanceof Polygon) {
		
		for (var i = 0; i < this.collBoxes.length; i++) {
			if (this.collBoxes[i].checkPolygon(arg)) {
				collBoxRefs = collBoxRefs.concat(this.collBoxes[i].objRefs)
				collBoxNums[collBoxNums.length] = i
			}
		}
		for (var i = 0; i < collBoxRefs.length; i++) {
			x = scene.objectsArray.getObject(collBoxRefs[i])
			if (x.checkPolygon(arg)) {
				bool = true
			}
		}
		if (bool) {
			//return the reference of the obj that we collided with
			return [bool, collObjRef]
		} else {
			//return the boxes to add reference to
			return [bool, collBoxNums]
		}
	} else {
		console.log("Collision.checkObj requires a point or polygon but got", arg)
	}
}

//------------------------------------------------------------------------------------------------
function Draw(arg) {
	//wants to write a couple of properties from the scene object
	this.ctx = arg.context
	this.cell = arg.cellsize
	this.width = arg.width
	this.height = arg.height
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
	var divWidth = Math.ceil(this.width/this.cell)
	var divHeight = Math.ceil(this.height/this.cell)
	this.ctx.fillStyle = "white"
	this.ctx.fillRect(0, 0, canvas.width, canvas.height)

	this.ctx.strokeStyle = "#38e1ff" // black is also a nice colour
	this.ctx.strokeWidth = 5
	this.ctx.beginPath()
	for (var i = 0; i < divWidth + this.cell; i++) {
		this.ctx.moveTo(i * this.cell, 0)
		this.ctx.lineTo(i * this.cell, canvas.height)
	}
	for (var i = 0; i < divHeight; i++) {
		this.ctx.moveTo(0, i * this.cell)
		this.ctx.lineTo(canvas.width, i * this.cell)
	}
	this.ctx.stroke()
}


//================================================================================================
//functions
//================================================================================================

function keyboardMouseSetup(arg) {
	var cell = arg.cellsize

	$("#canvas").mousedown(function(data) {
		user.mouse.f = true
		var sqrX = Math.floor(data.pageX / cell) * cell
		var sqrY = Math.floor(data.pageY / cell) * cell

		//This returns a list of values because I dont want to re-calculate some things
		check = collision.checkObject(new Point(data.pageX, data.pageY))
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

	$("#canvas").mousemove(function(data) {
		var sqrX = Math.floor(data.pageX / cell) * cell
		var sqrY = Math.floor(data.pageY / cell) * cell

		if (user.mouse.f) {
			if (user.curObj) {
				oldX = user.curObj.x
				oldY = user.curObj.y
				//this will move the currently selected object to a new box,
				//unless there was a collision.
				user.curObj.x = sqrX
				user.curObj.y = sqrY
				check = collision.checkObject(user.curObj)
				if (check) {
					console.log("collision undetected.")
				} else {
					console.log("Collision detected.")
					user.curObj.x = oldX
					user.curObj.y = oldY
				}
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
		//There is a problem here somewhere.
		if (user.curObj) {
			if (user.curObj.focus) {
				scene.objectsArray.removeObject(user.curObj.index)
				collision.removeIndice(user.curObj.index)
				user.curObj = null
			}
		}
	})
}

function ScreenChecker(arg) {
	x = arg.width
	y = arg.height
	if (x > window.outerWidth - 20 || x < window.outerWidth - 20) {
		canvas.width = window.outerWidth - 20
		scene.width = canvas.width
		draw.width = canvas.width
	}
	if (y > window.outerHeight - 117 || y < window.outerHeight - 117) {
		canvas.height = window.outerHeight - 117
		scene.height = canvas.height
		draw.divHeight = canvas.height
	}
}

//================================================================================================
//runtime
//================================================================================================

onload = function () {
	canvas.width = window.outerWidth - 20 // the last values before scroll bars.
	canvas.height = window.outerHeight - 117 // the last values before scroll bars.

	scene = new Scene()
	scene.context = document.getElementById("canvas").getContext("2d")
	scene.width = document.getElementById("canvas").width
	scene.height = document.getElementById("canvas").height

	collision = new Collision(scene)

	user = new User()
	draw = new Draw(scene)

	keyboardMouseSetup(scene)

	setInterval(function(){
		//This just resizes things it the screen gets moved around.
		ScreenChecker(scene)

		draw.background()

		if (scene.objectsArray.length() > 0) {
			for (var i = 0; i < scene.objectsArray.length(); i++) {
				var x = scene.objectsArray.getObject(i)
				if (x) {
					draw.object(x)
				}				
			}
		}
	}, 30)
}
