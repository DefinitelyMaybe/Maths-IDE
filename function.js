window.onload = function(){
	//setup keyboard & mouse interface
	keyboardAndMouseSetup();

	//then loop through drawing all the different entities.
	canvasBackground();
	console.log("onload complete.");
};

function canvasBackground(){
	var canvas = document.getElementById("math_canvas");
	var	ctx = canvas.getContext("2d");

	var squareSize = 32;

	var dividedWidth = canvas.width/squareSize;
	var dividedHeight = canvas.height/squareSize;

	//setInterval is a loop. Currently it only draws the background and some text
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.strokeStyle = "#38e1ff";
	ctx.strokeWidth = 5;
	ctx.beginPath()
	for (var i = 0; i < dividedWidth; i++) {
		ctx.moveTo(i*squareSize, 0);
		ctx.lineTo(i*squareSize, canvas.height);
	};
	for (var i = 0; i < dividedHeight; i++) {
		ctx.moveTo(0, i*squareSize);
		ctx.lineTo(canvas.width, i*squareSize);
	};
	ctx.stroke();
	console.log("Background drawn.");
};

function keyboardAndMouseSetup() {
	$( "#math_canvas" ).click(function() {
		console.log("mouse was clicked.");
	});
	
	$( "#math_canvas" ).keypress(function() {
		console.log( "Handler for .keypress() called." );
	});
	console.log("Keyboard and mouse setup complete.");
};

var scene = {
	squareSize : 32,
	canvas : document.getElementById("math_canvas"),
	//ctx : this.canvas.getContext("2d"),
	print : function() {
		console.log("print function called");
	}
};