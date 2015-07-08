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

var scene = {
	offset: 10,
	cellsize: 32,
	objectsTable: {},
	objectsArray: new MyArray(),
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
				//
			} else {
				return
			}
		}
	})

	$(document).mouseup(function(data) {
		user.mouse.flag = false
	})

	$(document).keydown(function(data) {
		if (user.currentObj) {
			scene.objectsArray.removeObject(user.currentRef)
			user.currentRef = null
			user.currentObj = null
		}
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
		}
	}
}

onload = function () {
	scene.context = document.getElementById("canvas_1").getContext("2d")
	keyboardMouseSetup()
	setupTableValues()

	x = new BlueBox(8, 10, 3, 2)
	y = new BlueBox(10, 9, 3, 4)
	console.log(x.toString())
	console.log(y.toString())
	console.log(x.col(y))
	console.log(y.col(x))

	setInterval(function(){
		draw_background()

		if (scene.objectsArray.length() > 0) {
			for (var i = 0; i < scene.objectsArray.length(); i++) {
				var x = scene.objectsArray.getObject(i)
				if (x) {
					x.draw()
				}
			}
		}
	}, 60)
}