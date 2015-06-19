var objectArray = function(){
	var objects = []
	var freeIndices = []

	this.addObject = function(item){
		if (freeIndices.length > 0) {
			var index = freeIndices.pop()
			objects[index] = item
		} else {
			objects.push(item)
		}
	}

	this.removeObject = function(index){
		if (typeof index !== "number") {
			return "RemoveObject - index was not a number."
		} else {
			try {
				objects[index] = null
				freeIndices.push(index)
			} catch(err) {
				return "objectArray - removeObject error."
			}
		}
		
	}

	this.getObject = function(index) {
		if (typeof index !== "number") {
			return "GetObject - index was not a number."
		} else {
			try {
				var temp = objects[index]
				return temp
			} catch(err) {
				return "objectArray - getObject error"
			} 
		}
	}

	this.len = function(){
		return objects.length
	}

	this.nextRef = function() {
		if (freeIndices.length > 0) {
			return freeIndices[freeIndices.length-1]
		} else {
			return objects.length
		}
	}

	this.linearSearch = function(args) {
		for (var i = 0; i < this.len(); i++) {
			var obj = objects[i]
			if (obj) {
				if (obj.equal(args)) {
					return [obj, i]
				}
			}
		};
	}
}

var scene = {
	offset: 10,
	cellsize: 32,
	objectsTable: {},
	objectsArray: new objectArray(),
	context: null //This gets set in the onload function
}

var user = {
	currentObj: null,
	currentRef: null,
	mouse: {
		flag: false
	}
}

function draw_background(){
	var ctx = scene.context

	var dividedWidth = canvas_1.width/scene.cellsize
	var dividedHeight = canvas_1.height/scene.cellsize

	ctx.fillStyle = "white"
	ctx.fillRect(0, 0, canvas_1.width, canvas_1.height)

	ctx.strokeStyle = "#38e1ff"
	ctx.strokeWidth = 5
	ctx.beginPath()
	for (var i = 0; i < dividedWidth; i++) {
		ctx.moveTo(i*scene.cellsize, 0)
		ctx.lineTo(i*scene.cellsize, canvas_1.height)
	}
	for (var i = 0; i < dividedHeight; i++) {
		ctx.moveTo(0, i*scene.cellsize)
		ctx.lineTo(canvas_1.width, i*scene.cellsize)
	}
	ctx.stroke()
}

function keyboardMouseSetup() {
	var xPos, yPos
	$("#canvas_1").mousedown(function(data) {
		console.log("down")
		user.mouse.flag = true
		xPos = Math.floor((data.pageX - scene.offset) / scene.cellsize)
		yPos = Math.floor((data.pageY - scene.offset) / scene.cellsize)

		if (scene.objectsTable[[xPos, yPos]] == 1) {
			if (user.currentObj) {
				user.currentObj.toggleFocus()
			}
			var obj = scene.objectsArray.linearSearch([xPos, yPos])
			obj[0].toggleFocus()
			user.currentObj = obj[0]
			user.currentRef = obj[1]
		} else {
			if (user.currentObj) {
				user.currentObj.toggleFocus()
			}

			var x = new blackBox(xPos, yPos)
			user.currentObj = x
			user.currentRef = scene.objectsArray.nextRef()
			scene.objectsArray.addObject(x)

			scene.objectsTable[[xPos, yPos]] = 1
		}
	})

	$("#canvas_1").mousemove(function(data) {
		if (user.mouse.flag) {
			if (user.currentObj) {
				console.log("move")
			} else {
				return
			}
		}
	})

	$(document).mouseup(function(data) {
		user.mouse.flag = false
		console.log("up")
	})

	$(document).keydown(function(data) {
		scene.objectsArray.removeObject(user.currentRef)
		user.currentRef = null
		user.currentObj = null
	})
}

var blackBox = function(sX, sY){
	var ctx = scene.context
	var c = scene.cellsize
	var sX = sX 	//start X
	var sY = sY 	//start Y
	var w = 1
	var h = 1
	var focus = true

	this.draw = function(){
		if (focus) {
			ctx.fillStyle = "grey"
		} else {
			ctx.fillStyle = "black"
		}
		ctx.fillRect(c*sX, c*sY, c*w, c*h)
	}

	this.update = function(uX, uY){
		sX = uX
		sY = uY
	}

	this.toggleFocus = function() {
		if (focus) {
			focus = false
		} else {
			focus = true
		}
	}

	this.equal = function(args) {
		if (args.length > 2) {
			return false
		} else {
			if (args[0] == sX) {
				if (args[1] == sY) {
					return true
				}
			}
			return false
		}
	}
}

function setupTableValues(){
	var x = canvas_1.width / scene.cellsize
	var y = canvas_1.height / scene.cellsize
	for (var i = 0; i < x; i++) {
		for (var j = 0; j < y; j++) {
			scene.objectsTable[[i, j]] = 0
		};
	};
}

onload = function () {
	scene.context = document.getElementById("canvas_1").getContext("2d")
	keyboardMouseSetup()
	setupTableValues()

	setInterval(function(){
		draw_background()

		if (scene.objectsArray.len() > 0) {
			for (var i = 0; i < scene.objectsArray.len(); i++) {
				var x = scene.objectsArray.getObject(i)
				if (x) {
					x.draw()
				}
			}
		}
	}, 60)
}