//need lookup table for collision's with any AABB in scene already.
var scene = []

var cell = {
	size: 32,
	offset: 10
}

onload = function () {
	keyboardAndMouseSetup()
	canvasBackground()
	setInterval(function(){
		canvasBackground()
		if (scene.length > 0) {
			for (var i = 0; i < scene.length; i++) {
				scene[i].draw()
			};
		}
	}, 30)
}

function canvasBackground(){
	var ctx = document.getElementById("canvas").getContext("2d")

	var dividedWidth = canvas.width/cell.size
	var dividedHeight = canvas.height/cell.size

	ctx.fillStyle = "white"
	ctx.fillRect(0, 0, canvas.width, canvas.height)

	ctx.strokeStyle = "#38e1ff"
	ctx.strokeWidth = 5
	ctx.beginPath()
	for (var i = 0; i < dividedWidth; i++) {
		ctx.moveTo(i*cell.size, 0)
		ctx.lineTo(i*cell.size, canvas.height)
	}
	for (var i = 0; i < dividedHeight; i++) {
		ctx.moveTo(0, i*cell.size)
		ctx.lineTo(canvas.width, i*cell.size)
	}
	ctx.stroke()
}

function keyboardAndMouseSetup() {
	$( "#canvas" ).mouseup(function(data) {
		var eX = Math.floor((data.pageX - cell.offset) / cell.size)
		var eY = Math.floor((data.pageY - cell.offset) / cell.size)
		console.log("blackBox " + ((scene.length) - 1) + " was made.")
		scene[scene.length-1].inFocus = false
	})

	$( "#canvas" ).mousemove(function(data) {
		var eX = Math.floor((data.pageX - cell.offset) / cell.size)
		var eY = Math.floor((data.pageY - cell.offset) / cell.size)
		if (scene.length > 0) {
			if (scene[scene.length-1].inFocus) {
				scene[scene.length-1].update(eX, eY)
			}
		}
		
	})

	$( "#canvas" ).mousedown(function(data) {
		var sX = Math.floor((data.pageX - cell.offset) / cell.size)
		var sY = Math.floor((data.pageY - cell.offset) / cell.size)
		console.log("The (" + sX	+ ", " + sY + ") cell was clicked.")
		if (false) {
			return
		} else {
			scene[scene.length] = new blackBox(sX, sY)
			scene[scene.length-1].inFocus = true
		}
		
	})
}

var blackBox = function(sX, sY){
	//AABB style attempt 1
	var ctx = document.getElementById("canvas").getContext("2d")
	var c = cell.size
	this.sX = sX
	this.sY = sY
	this.w = 1
	this.h = 1
	this.inFocus = false
	this.update = function(eX, eY) {
		if (this.sX <= eX) {
			this.w = eX - this.sX
			this.w += 1
		} else {
			this.w = (this.sX - eX) * -1
		}
		if (this.sY <= eY) {
			this.h = eY - this.sY
			this.h += 1
		} else {
			this.h = (this.sY - eY) * -1
		}
	}
	this.draw = function(){
		ctx.fillStyle = "black"
		ctx.fillRect(c*this.sX, c*this.sY, c*this.w, c*this.h)
	}
}