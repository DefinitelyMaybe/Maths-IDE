window.onload = function(){
	drawBackground();
};

function drawBackground () {
	var canvas = document.getElementById("canvas");
	var	ctx = canvas.getContext("2d");

	var x, y = 0;
	var squareSize = 32;

	var dividedWidth = canvas.width/squareSize;
	var dividedHeight = canvas.height/squareSize;

	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.strokeStyle = "#38e1ff";
	ctx.strokeWidth = 5;

	ctx.beginPath();
	for (var i = 0; i < dividedWidth; i++) {
		ctx.moveTo(i*squareSize, 0)
		ctx.lineTo(i*squareSize, canvas.height)
	};
	for (var i = 0; i < dividedHeight; i++) {
		ctx.moveTo(0, i*squareSize)
		ctx.lineTo(canvas.width, i*squareSize)
	};
	ctx.stroke();
}