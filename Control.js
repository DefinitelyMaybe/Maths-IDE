//================================================================================================
//objects
//================================================================================================

function Scene() {
	this.canvasOffset = 10
	this.cellsize = 32 //cellsize
	this.objectsArray = new MyArray() //objects array
	this.context = null //context gets set in the onload function
	this.width = 0 //width
	this.height = 0 //height
	this.collisionGranularity = 2
}

function User() {
 	this.curObj = null //current object
	this.mouse = { //mouse
		f: false // for mouse down and hold.
	}
}

function Point(x, y) {
	this.xPos = x
	this.yPos = y

	this.x = function(arg) {
		if (typeof arg === "number") {
			this.xPos = arg
		} else {
			return this.xPos
		} 
	}

	this.y = function(arg) {
		if (typeof arg === "number") {
			this.yPos = arg
		} else {
			return this.yPos
		} 
	}
}

function Polygon(x, y, w, h) {

	this.xPos = x
	this.yPos = y
	this.width = w
	this.height = h

	this.x = function(arg) {
		if (typeof arg === "number") {
			this.xPos = arg
		} else {
			return this.xPos
		} 
	}

	this.y = function(arg) {
		if (typeof arg === "number") {
			this.yPos = arg
		} else {
			return this.yPos
		} 
	}

	this.w = function(arg) {
		if (typeof arg === "number") {
			this.width = arg
		} else {
			return this.width
		} 
	}

	this.h = function(arg) {
		if (typeof arg === "number") {
			this.height = arg
		} else {
			return this.height
		} 
	}

	this.equal = function (arg) {
		if (this.x() == arg.x()) {
			if (this.y() == arg.y()) {
				if (this.w() == arg.w()) {
					if (this.h() == arg.h()) {
						return true
					}
				}
			}		
		}
		return false
	}

	this.toString = function() {
		return "Polygon: ", this.xPos + ", " + this.yPos + "; " + this.width + ", " + this.height
	}
}

function CollPolygon(x, y, w, h) {
	Polygon.call(this)

	this.xPos = x
	this.yPos = y
	this.width = w
	this.height = h

	this.collides = function(arg) {
		if (arg instanceof CollPolygon) {
			x = this.findClosestPoints(arg)
			a = new Point(x[0], x[1])
			b = new Point(x[2], x[3])
			return (this.pointIn(a) || arg.pointIn(b))
		} else {
			try {
				throw "CollPolygon: collides requires an instance of CollPolygon"
			} catch (e) {
				return
			}
			
			
		}
	}

	this.pointIn = function (arg) {
		if (arg instanceof Point || CollPolygon) {
			numX = arg.x()
			numY = arg.y()
			if (this.height >= 0) {
				//height is postive
				if (this.width >= 0) {
					//width is postive
					if ((this.xPos <= numX) && (this.xPos + this.width >= numX)) {
						if ((this.yPos <= numY) && (this.yPos + this.height >= numY)) {

							return true
						}
					}
				else
					//width is negative
					if ((this.xPos >= numX) && (this.xPos + this.width <= numX)) {
						if ((this.yPos <= numY) && (this.yPos + this.height >= numY)) {
							return true
						}
					}
				}
			} else {
				//height is negative
				if (this.width >= 0) {
					//width is postive
					if ((this.xPos <= numX) && (this.xPos + this.width >= numX)) {
						if ((this.yPos >= numY) && (this.yPos + this.height <= numY)) {
							return true
						}
					}
				} else {
					//width is negative
					if ((this.xPos >= numX) && (this.xPos + this.width <= numX)) {
						if ((this.yPos >= numY) && (this.yPos + this.height <= numY)) {
							return true
						}
					}
				}
			}
			return false
		} else {
			console.log("collision: pointIn requires an instance of Point")
			return
		}
	}

	this.findClosestPoints = function(arg) {
		shortestDistance = Infinity
		points = []
		if (arg instanceof Point) {
			x2 = arg.x()
			y2 = arg.y()
			for (var i = 0; i < 4; i++) {
				if (i == 0) {
				   	x1 = this.x()
				   	y1 = this.y()
				} else if (i == 1) {
					x1 = this.x() + this.w()
					y1 = this.y()
				} else if (i == 2) {
					x1 = this.x()
					y1 = this.y() + this.h()
				} else if (i == 3) {
					x1 = this.x() + this.w()
					y1 = this.y() + this.h()
				}
				a = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
				if (a < shortestDistance) {
					shortestDistance = a
					points = [x2, y2, x1, y1]
				}
			}
			return points
		} else if (arg instanceof CollPolygon) {
			for (var i = 0; i < 4; i++) {
				if (i == 0) {
				   	x1 = this.x()
				   	y1 = this.y()
				} else if (i == 1) {
					x1 = this.x() + this.w()
					y1 = this.y()
				} else if (i == 2) {
					x1 = this.x()
					y1 = this.y() + this.h()
				} else if (i == 3) {
					x1 = this.x() + this.w()
					y1 = this.y() + this.h()
				}
				for (var j = 0; j < 4; j++) {
					if (j == 0) {
						x2 = arg.x()
						y2 = arg.y()
					}else if (j == 1) {
						x2 = arg.x() + arg.w()
						y2 = arg.y()
					} else if (j == 2) {
						x2 = arg.x()
						y2 = arg.y() + arg.h()
					} else if (j == 3) {
						x2 = arg.x() + arg.w()
						y2 = arg.y() + arg.h()
					}
					a = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
					if (a < shortestDistance) {
						shortestDistance = a
						points = [x2, y2, x1, y1]
					}
				}
			}
			return points
		} else {
			try {
				throw "CollPolygon: arg was not an instance of Point or CollPolygon"
	
			} catch (e) {
				return
			}
		}
	}
}

CollPolygon.prototype = Object.create(Polygon.prototype)

function GreyBox(x, y, w, h) {
	CollPolygon.call(this)
	//I re-added these variables because I couldn't figure out how to pass the GreyBox function
	//inputs in as Polygon function inputs

	this.xPos = x
	this.yPos = y
	this.width = w
	this.height = h

	this.focus = true //This is for checking it the user has it selected.
	this.index = null //Stores it's index value when inside scene.objectsArray

	this.toggleFocus = function() {
		if (this.focus) {
			this.focus = false
		} else {
			this.focus = true
		}
	}

	this.draw = function(ctx) {
		if (this.focus) {
			ctx.fillStyle = "grey"
		} else {
			ctx.fillStyle = "black"
		}
		ctx.fillRect(this.xPos, this.yPos, this.width, this.height)
	}
}

GreyBox.prototype = Object.create(CollPolygon.prototype)

function CollBox(x, y, w, h) {
	CollPolygon.call(this)

	this.xPos = x
	this.yPos = y
	this.width = w
	this.height = h

	this.objRefs = []

	this.addReference = function(arg) {
		if (typeof arg != "number") {
			console.log("CollBox addReference did not add", arg)
			return
		} else {
			this.objRefs[this.objRefs.length] = arg
		}
	}

	this.getReferences = function() {
		return this.objRefs
	}

	this.removeIndex = function(arg) {
		if (typeof arg == "number") {
			x = []
			for (var i = 0; i < this.objRefs.length; i++) {
				if (this.objRefs[i] != arg) {
					x = x.concat([this.objRefs[i]])
				}
			}
			this.objRefs = x
		} else {
			console.log("CollBox.removeIndex did not remove", arg)
		}
		
	}
	this.draw = function(ctx) {
		ctx.fillStyle = "#38e1ff"
		ctx.fillRect(this.xPos, this.yPos, this.width, this.height)
	}
}

CollBox.prototype = Object.create(CollPolygon.prototype)

function MyArray(){
	this.objects = []
	this.freeIndices = []

	this.addObject = function(item){
		if (this.freeIndices.length > 0) {
			index = this.freeIndices.pop()
			this.objects[index] = item
		} else {
			this.objects.push(item)
		}
	}

	this.removeObject = function(index){
		if (typeof index !== "number") {
			console.log("MyArray could not removeObject at", index)
			return
		} else {
			this.objects[index] = null
			this.freeIndices.push(index)
		}
		
	}

	this.getObject = function(index) {
		if (typeof index !== "number") {
			console.log("MyArray could not getObject at", index)
			return
		} else {
			x = this.objects[index]
			return x
		}
	}

	this.length = function(){
		return this.objects.length
	}

	this.nextRef = function() {
		if (this.freeIndices.length > 0) {
			return this.freeIndices[this.freeIndices.length-1]
		} else {
			return this.objects.length
		}
	}

	this.linearSearch = function(args) {
		for (var i = 0; i < this.length(); i++) {
			var obj = this.objects[i]
			if (obj) {
				if (obj.equal(args)) {
					return [obj, i]
				}
			}
		};
	}
}

function Collision(arg) {
	this.box = []

	num = arg.collisionGranularity
	divW = arg.width / num
	divH = arg.height / num

	for (var i = 0; i < num; i++) {
		for (var j = 0; j < num; j++) {
			x = Math.ceil(j*divW)
			y = Math.ceil(i*divH)
			this.box[this.box.length] = new CollBox(x, y, divW, divH)
		}
	}

	this.removeIndice = function(arg) {
		for (var i = 0; i < this.box.length; i++) {
			this.box[i].removeIndex(arg)
		}
	}

	this.getIndices = function(arg) {
		if (arg instanceof Point) {
			x = []
			y = []
			for (var i = 0; i < this.box.length; i++) {
				if (this.box[i].pointIn(arg)) {
					//console.log("b:",x)
					x = x.concat(this.box[i].objRefs)
					y = y.concat([i])
					//console.log("a:",x)
				}
			}
			return [x, y]
		} else if (arg instanceof CollPolygon) {
			x = []
			y = null
			for (var i = 0; i < this.box.length; i++) {
				if (this.box[i].collides(arg)) {
					x = x.concat(this.box[i].getReferences)
					if (y == null) {
						y = i
					} else {
						console.log("Collision.getIndices will need to be done differently")
					}
					
				}
			}
			return [x, y]
		} else {
			console.log("Collision.getIndices requires a Point or CollPolygon")
			return
		}
	}

	this.checkPoint = function(arg) {
		if (arg instanceof Point) {
			x = this.getIndices(arg)
			objectIndex = x[0]
			//console.log("index: ", objectIndex)
			nums = x[1]
			//console.log("box: ", nums)
			if (scene.objectsArray.length() > 0) {
				for (var i = 0; i < objectIndex.length; i++) {
					if (scene.objectsArray.getObject(objectIndex[i]).pointIn(arg)) {
						return [false, objectIndex[i]]
					}
				}
			}
			return [true, nums]
		} else {
			console.log("Collision: checkPoint requires arg to be an instance of Point")
			return
		}
	}
	this.checkPolygon = function(arg) {
		x = this.getIndices(arg)
		objectIndices = x[0]
		//console.log("indices: ", objectIndices)
		nums = x[1]
		//console.log("box: ", nums)
		if (scene.objectsArray.length() > 0) {
			for (var i = 0; i < objectIndices.length; i++) {
				if (scene.objectsArray.getObject(objectIndices[i]).collides(arg)) {
					return false
				}
			}
		}
		//About to return true so add this index to objRefs
		this.box[nums[0]].addReference(arg.index)
		return true
	}

	this.addObjectReference = function(args) {
		this.box[args[1]].addReference(args[0])
	}
}

function Draw(arg) {
	//wants to write a couple of properties from the scene object
	var ctx = arg.context
	var cell = arg.cellsize
	var divWidth = Math.ceil(canvas_1.width/cell)
	var divHeight = Math.ceil(canvas_1.height/cell)

	this.background = function() {
		ctx.fillStyle = "white"
		ctx.fillRect(0, 0, canvas_1.width, canvas_1.height)

		ctx.strokeStyle = "#38e1ff"
		ctx.strokeWidth = 5
		ctx.beginPath()
		for (var i = 0; i < divWidth; i++) {
			ctx.moveTo(i * cell, 0)
			ctx.lineTo(i * cell, canvas_1.height)
		}
		for (var i = 0; i < divHeight; i++) {
			ctx.moveTo(0, i * cell)
			ctx.lineTo(canvas_1.width, i * cell)
		}
		ctx.stroke()
	}

	this.object = function(arg) {
		arg.draw(ctx)
	}
}

//================================================================================================
//functions
//================================================================================================

function keyboardMouseSetup(arg) {
	var x, y
	var cell = arg.cellsize
	var off = arg.canvasOffset

	$("#canvas_1").mousedown(function(data) {
		user.mouse.f = true
		sqrX = Math.floor((data.pageX - off) / cell) * cell
		sqrY = Math.floor((data.pageY - off) / cell) * cell

		check = collision.checkPoint(new Point(data.pageX - off, data.pageY - off))
		if (check[0]) {
			//if there is no object at that point. create an object for that square
			obj = new GreyBox(sqrX, sqrY, cell, cell)
			obj.index = scene.objectsArray.nextRef()
			if (user.curObj) {
				user.curObj.toggleFocus()
			}
			user.curObj = obj
			scene.objectsArray.addObject(obj)
			collision.addObjectReference([obj.index, check[1]]) //index and CollBox index
		} else if (!check[0]) {
			//get the object at that point
			obj = scene.objectsArray.getObject(check[1])
			//should I toggle focus? revisit this later
			if (user.curObj) {
				if (user.curObj.equal(obj)) {
					user.curObj.toggleFocus()
				}
				user.curObj.toggleFocus()
				user.curObj = obj
				user.curObj.toggleFocus()
			} else {
				user.curObj = obj
				user.curObj.toggleFocus()
			}
		}
	})

	$("#canvas_1").mousemove(function(data) {
		if (user.mouse.f) {
			if (user.curObj) {
				//this will just be moving the currently selected object.
				//fine movement until mouseup at which point, snap to box
				check = collision.checkPolygon(user.curObj)
				if (check[0]) {
					console.log("HERE!")
				}
			} else {
				return
			}
		}
	})

	$(document).mouseup(function(data) {
		user.mouse.f = false
	})

	$(document).keydown(function(data) {
		if (user.curObj) {
			scene.objectsArray.removeObject(user.curObj.index)
			collision.removeIndice(user.curObj.index)
			user.curObj = null
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

		//for (var i = 0; i < collision.box.length; i++) {
		//	draw.object(collision.box[i])
		//}
		if (scene.objectsArray.length() > 0) {
			for (var i = 0; i < scene.objectsArray.length(); i++) {
				var x = scene.objectsArray.getObject(i)
				if (x) {
					draw.object(x)
				}
			}
		}
	}, 60)
}
