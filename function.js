window.onload = function() {
	canvasBackground()
	//setup keyboard & mouse interface
	//draw entities
};

function canvasBackground(){
	var canvas = document.getElementById("canvas");
	var	ctx = canvas.getContext("2d");

	var xPos, yPos = 0;
	var squareSize = 32;
	//If screen is in focus then receive input from keyboard. textarea? fillText? 
	var screenFocus = false;

	var dividedWidth = canvas.width/squareSize;
	var dividedHeight = canvas.height/squareSize;

	//setInterval is a loop. Currently it only draws the background and some text
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
};

function entity(){
	this.xPos = 0;
	this.yPos = 0;
	this.numberArray = [];
	this.currentFocus = false;

	this.printNumbers = function() {
		return "xPos: " + this.xPos + " yPos: " + this.yPos;
	};

	this.draw = function() {
		return null
	};
};