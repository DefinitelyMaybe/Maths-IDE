function draw () {
	var canvas = document.getElementById('CanvasOne');
	if (canvas.getContext) {
		var ctx = canvas.getContext("2d");
		ctx.fillStyle = "rgb(250, 250, 250)";
		ctx.fillRect(0, 0, 1400, 800);
	}
}