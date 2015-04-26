window.onload = function(){
	var canvas = document.getElementById("canvas");
	var	ctx = canvas.getContext("2d");


	var xPos, yPos = 0;
	var squareSize = 32;
	//If screen is in focus then receive input from keyboard. textarea? fillText? 
	var screenFocus = false;

	var dividedWidth = canvas.width/squareSize;
	var dividedHeight = canvas.height/squareSize;

	//setInterval is a loop. My next move is towards making it like a text editor.
	setInterval(function(){
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

		ctx.fillStyle = "black";
		ctx.font = "43px sans-serif";
		ctx.fillText("Hello Internet", 0, 32);
	}, 30);
	
};