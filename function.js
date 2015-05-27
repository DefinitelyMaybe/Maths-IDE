
var square = {
	size: 32
}

onload = function () {
	keyboardAndMouseSetup()
	//setInterval(function(){}, 60)
	canvasBackground()
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
		var sX = Math.floor(data.pageX / square.size)
		var sY = Math.floor(data.pageY / square.size)
		console.log("The (" + sX	+ ", " + sY + ") square was clicked.")
		new thing(sX, sY)
	})
}

var thing = function(sX, sY){
	var ctx = document.getElementById("canvas").getContext("2d")
	var c = square.size
	ctx.fillStyle = "black"
	ctx.fillRect(c*sX, c*sY, c, c)
}