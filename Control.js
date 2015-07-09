//================================================================================================
//objects
//================================================================================================

function Scene() {
	this.offset = 10
	this.cellsize = 32 //cellsize
	this.objectsArray = new MyArray() //objects array
	this.context = null //context gets set in the onload function
	this.w = 0 //width
	this.h = 0 //height
	this.collisionGranularity = 2
}

function User() {
 	this.curObj = null //current object
	this.mouse = { //mouse
		f: false // for mouse down and hold.
	}
}

function Polygon(x, y, w, h) {

	this.xPos = x
	this.yPos = y
	this.width = w
	this.height = h

	this.x = function(number) {
		if (typeof number === "number") {
			this.xPos = number
		} else {
			return this.xPos
		} 
	}

	this.y = function(number) {
		if (typeof number === "number") {
			this.yPos = number
		} else {
			return this.yPos
		} 
	}

	this.w = function(number) {
		if (typeof number === "number") {
			this.width = number
		} else {
			return this.width
		} 
	}

	this.h = function(number) {
		if (typeof number === "number") {
			this.height = number
		} else {
			return this.height
		} 
	}

	this.collides = function(obj) {
		temp = this.findClosestPoints(obj)
		a = temp[0]
		b = temp[1]
		c = temp[2]
		d = temp[3]
		return (this.xyIn(a, b) || obj.xyIn(c, d))
	}

	this.xyIn = function (x, y) {
		numX = x
		numY = y
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
	}

	this.findClosestPoints = function(arg) {

		shortestDistance = Infinity
		points = []

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
	}

	this.equal = function (obj) {
		if (this.x() == obj.x()) {
			if (this.y() == obj.y()) {
				if (this.w() == obj.w()) {
					if (this.h() == obj.h()) {
						return true
					}
				}
			}		
		}
		return false
	}

	this.toString = function() {
		return this.xPos + ", " + this.yPos + "; " + this.width + ", " + this.height
	}
}

function GreyBox(x, y, w, h) {
	Polygon.call(this)
	//I re-added these variables because I couldn't figure out how to pass the GreyBox function
	//inputs in as Polygon function inputs

	this.xPos = x
	this.yPos = y
	this.width = w
	this.height = h

	this.focus = true
	this.index = null

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

GreyBox.prototype = Object.create(Polygon.prototype)

function CollBox(x, y, w, h) {
	Polygon.call(this)

	this.xPos = x
	this.yPos = y
	this.width = w
	this.height = h

	this.objRefs = []

	this.removeIndex = function(arg) {
		for (var i = 0; i < this.objRefs.length; i++) {
			if (this.objRefs[i] == arg) {

			} 
		}
	}
	this.draw = function(ctx) {
		ctx.fillStyle = "black"
		ctx.fillRect(this.xPos, this.yPos, this.width, this.height)
	}
}

CollBox.prototype = Object.create(Polygon.prototype)

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
			console.log("RemoveObject - index was not a number.")
			return
		} else {
			try {
				this.objects[index] = null
				this.freeIndices.push(index)
			} catch(err) {
				console.log("MyArray - removeObject error.")
				return
			}
		}
		
	}

	this.getObject = function(index) {
		if (typeof index !== "number") {
			console.log("GetObject - index was not a number.")
			return
		} else {
			try {
				x = this.objects[index]
				return x
			} catch(err) {
				console.log("MyArray - getObject error")
				return 
			} 
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
	divW = arg.w / num
	divH = arg.h / num

	for (var i = 0; i < num; i++) {
		for (var j = 0; j < num; j++) {
			this.box[this.box.length] = new CollBox(j*divW, i*divH, divW, divH)
		}
	}
	this.removeIndice = function(arg) {
		for (var i = 0; i < this.box.length; i++) {
			this.box[i].removeIndex(arg)
		}
	}

	this.getIndices = function(arg) {
		x = []
		y = []
		for (var i = 0; i < this.box.length; i++) {
			if (this.box[i].collides(arg)) {
				x = x.concat(this.box[i].objRefs)
				y = y.concat([i])
			}
		}
		return [x, y]
	}
	this.check = function(arg) {
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
		for (var i = 0; i < nums.length; i++) {
			this.box[nums[i]].objRefs = this.box[nums[i]].objRefs.concat([arg.index])
			//console.log(nums[i], this.box[nums[i]].objRefs)
		}
		return true
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
	var off = arg.offset

	$("#canvas_1").mousedown(function(data) {
		user.mouse.f = true
		x = Math.floor((data.pageX - off) / cell)
		y = Math.floor((data.pageY - off) / cell)
		x1 = x * cell
		y1 = y * cell

		obj = new GreyBox(x1, y1, cell, cell)
		obj.index = scene.objectsArray.nextRef()

		check = collision.check(obj)
		if (check) {
			if (user.curObj) {
				user.curObj.toggleFocus()
			}
			user.curObj = obj
			scene.objectsArray.addObject(obj)
		}
	})

	$("#canvas_1").mousemove(function(data) {
		if (user.mouse.f) {
			if (user.curObj) {
				//this will just be moving the currently selected object.
				//fine movement until mouseup at which point, snap to box
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
	scene.w = document.getElementById("canvas_1").width
	scene.h = document.getElementById("canvas_1").height

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
