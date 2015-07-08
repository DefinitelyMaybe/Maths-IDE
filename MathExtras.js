function Polygon(x, y, w, h) {

	this.xPos = x
	this.yPos = y
	this.width = w
	this.height = h

	this.x = function(number) {
		if (typeof number === "number") {
			this.xPos = number
		} else {
			return this.xPos
		} 
	}

	this.y = function(number) {
		if (typeof number === "number") {
			this.yPos = number
		} else {
			return this.yPos
		} 
	}

	this.w = function(number) {
		if (typeof number === "number") {
			this.width = number
		} else {
			return this.width
		} 
	}

	this.h = function(number) {
		if (typeof number === "number") {
			this.height = number
		} else {
			return this.height
		} 
	}

	this.col = function(obj) {
		temp = this.findClosestPoints(obj)
		a = temp[0]
		b = temp[1]
		c = temp[2]
		d = temp[3]
		return (this.xyIn(a, b) || obj.xyIn(c, d))
	}

	this.xyIn = function (x, y) {
		numX = x
		numY = y
		if (this.height >= 0) {
			//height is postive
			if (this.width >= 0) {
				//width is postive
				if ((this.xPos <= numX) && (this.xPos + this.width >= numX)) {
					if ((this.yPos <= numY) && (this.yPos + this.height >= numY)) {

						return true
					}
				}
			else
				//width is negative
				if ((this.xPos >= numX) && (this.xPos + this.width <= numX)) {
					if ((this.yPos <= numY) && (this.yPos + this.height >= numY)) {
						return true
					}
				}
			}
		} else {
			//height is negative
			if (this.width >= 0) {
				//width is postive
				if ((this.xPos <= numX) && (this.xPos + this.width >= numX)) {
					if ((this.yPos >= numY) && (this.yPos + this.height <= numY)) {
						return true
					}
				}
			} else {
				//width is negative
				if ((this.xPos >= numX) && (this.xPos + this.width <= numX)) {
					if ((this.yPos >= numY) && (this.yPos + this.height <= numY)) {
						return true
					}
				}
			}
		}
		return false
	}

	this.findClosestPoints = function(obj) {

		shortestDistance = Infinity
		points = []

		for (var i = 0; i < 4; i++) {
			if (i == 0) {
			   	x1 = this.x()
			   	y1 = this.y()
			} else if (i == 1) {
				x1 = this.x() + this.w()
				y1 = this.y()
			} else if (i == 2) {
				x1 = this.x()
				y1 = this.y() + this.h()
			} else if (i == 3) {
				x1 = this.x() + this.w()
				y1 = this.y() + this.h()
			}
			for (var j = 0; j < 4; j++) {
				if (j == 0) {
					x2 = obj.x()
					y2 = obj.y()
				}else if (j == 1) {
					x2 = obj.x() + obj.w()
					y2 = obj.y()
				} else if (j == 2) {
					x2 = obj.x()
					y2 = obj.y() + obj.h()
				} else if (j == 3) {
					x2 = obj.x() + obj.w()
					y2 = obj.y() + obj.h()
				}
				a = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
				if (a < shortestDistance) {
					shortestDistance = a
					points = [x2, y2, x1, y1]
				}
			}
		}
		return points
	}

	this.equal = function (obj) {
		if (this.x() == obj.x()) {
			if (this.y() == obj.y()) {
				if (this.w() == obj.w()) {
					if (this.h() == obj.h()) {
						return true
					}
				}
			}		
		}
		return false
	}

	this.toString = function() {
		return this.xPos + ", " + this.yPos + "; " + this.width + ", " + this.height
	}
}

function BlueBox(x, y, w, h) {
	Polygon.call(this)
	//I re-added these variables because I couldn't figure out how to pass the BlueBox function
	//inputs in as Polygon function inputs
	this.xPos = x
	this.yPos = y
	this.width = w
	this.height = h

	this.focus = true

	this.toggleFocus = function() {
		if (this.focus) {
			this.focus = false
		} else {
			this.focus = true
		}
	}
}

BlueBox.prototype = Object.create(Polygon.prototype)
