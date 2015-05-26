/*
Setup a scene,
	a scene has objects,
		objects are drawn in order,
		objects can be added/deleted

Through mouse clicks on ui elements you can,
	change some scene properties


*/

var square = {
	size: 32,
}

onload = function () {
	keyboardAndMouseSetup()
	setInterval(function(){
		canvasBackground()
	}, 60)
}

function canvasBackground(){
	var ctx = document.getElementById("canvas").getContext("2d")

	var dividedWidth = canvas.width/square.size
	var dividedHeight = canvas.height/square.size

	ctx.fillStyle = "white"
	ctx.fillRect(0, 0, canvas.width, canvas.height)

	ctx.strokeStyle = "#38e1ff"
	ctx.strokeWidth = 5
	ctx.beginPath()
	for (var i = 0; i < dividedWidth; i++) {
		ctx.moveTo(i*square.size, 0)
		ctx.lineTo(i*square.size, canvas.height)
	}
	for (var i = 0; i < dividedHeight; i++) {
		ctx.moveTo(0, i*square.size)
		ctx.lineTo(canvas.width, i*square.size)
	}
	ctx.stroke()
}

function keyboardAndMouseSetup() {
	$( "#canvas" ).click(function(data) {
		var mouseX = data.pageX
		var mouseY = data.pageY

		console.log("mouse was clicked at " + mouseX + ", " + mouseY)
		console.log(Math.floor(mouseX / square.size) + ", " + 
					Math.floor(mouseY / square.size))
	})
}