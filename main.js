//================================================================================================
//objects
//================================================================================================
debugging = false
theScene = null

function Scene() {
	this.objects = []
	this.freeIndex = []

	this.ghostObject = null
	this.currentObject = null

	this.cellsize = 32
	this.divisionGranularity = 10
	this.divisions = []

	this.currentDivisions = []

	this.mouseDown = false

	this.ctx = null

	this.createDivs()
}

Scene.prototype = Object.create(Object.prototype)

Scene.prototype.removeObject = function() {
	if (arguments.length != 1) {
		return null
	}
	if (typeof arguments[0] == "number") {
		if (arguments[0] < this.objects.length) {
			this.objects[arguments[0]] = null
			this.freeIndex.push(arguments[0])
		}
	}
}

Scene.prototype.addObject = function() {
	if (arguments.length != 1) {
		return null
	}
	if (this.freeIndex.length > 0) {
		index = this.freeIndex.pop()
	} else {
		index = this.objects.length
	}
	this.objects[index] = arguments[0]

	if (arguments[0].index == null) {
		arguments[0].index = index
	}
}

Scene.prototype.getObject = function(index) {
	return this.objects[index]
}

Scene.prototype.linearObjectSearch = function() {
	//Linear search that stops on the first object who's toString is equal
	if (arguments.length != 1) {
		//In the Mozilla js doc's -1 means the object was not found
		return -1
	}
	for (var i = 0; i < this.objects.length; i++) {
		if (this.getObject(i).toString() == arguments[0].toString()) {
			return i
		}
	}
	return -1
}

Scene.prototype.drawBackgroundDefault = function() {
	width = theCanvasElement.width
	height = theCanvasElement.height

	divWidth = Math.ceil(width / this.cellsize)
	divHeight = Math.ceil(height / this.cellsize)

	this.ctx.fillStyle = "white"
	this.ctx.fillRect(0, 0, width, height)

	this.ctx.strokeStyle = "#38e1ff" // black is also a nice colour
	this.ctx.strokeWidth = 5
	this.ctx.beginPath()
	for (var i = 0; i < divWidth + this.cellsize; i++) {
		this.ctx.moveTo(i * this.cellsize, 0)
		this.ctx.lineTo(i * this.cellsize, height)
	}
	for (var i = 0; i < divHeight; i++) {
		this.ctx.moveTo(0, i * this.cellsize)
		this.ctx.lineTo(width, i * this.cellsize)
	}
	this.ctx.stroke()
}

Scene.prototype.isColliding = function() {
	function pointAndPolygon() {
		if (arguments[0] instanceof Point) {
			pointX = arguments[0].x
			pointY = arguments[0].y
			polyX = arguments[1].x
			polyY = arguments[1].y
			polyW = arguments[1].w
			polyH = arguments[1].h
		} else {
			pointX = arguments[1].x
			pointY = arguments[1].y
			polyX = arguments[0].x
			polyY = arguments[0].y
			polyW = arguments[0].w
			polyH = arguments[0].h
		}
		if (polyH >= 0) {
			//height is postive
			if (polyW >= 0) {
				//width is postive
				if ((polyX <= pointX) && (polyX + polyW >= pointX)) {
					if ((polyY <= pointY) && (polyY + polyH >= pointY)) {
						return true
					}
				}
			} else {
				//width is negative
				if ((polyX >= pointX) && (polyX + polyW <= pointX)) {
					if ((polyY <= pointY) && (polyY + polyH >= pointY)) {
						return true
					}
				}
			}
		} else {
			//height is negative
			if (polyW >= 0) {
				//width is postive
				if ((polyX <= pointX) && (polyX + polyW >= pointX)) {
					if ((polyY >= pointY) && (polyY + polyH <= pointY)) {
						return true
					}
				}
			} else {
				//width is negative
				if ((polyX >= pointX) && (polyX + polyW <= pointX)) {
					if ((polyY >= pointY) && (polyY + polyH <= pointY)) {
						return true
					}
				}
			}
		}
		return false
	}

	function polygonAndPolygon() {
		if (arguments[0].toString() == arguments[1].toString()) {
			return true
		}
		poly1x1 = arguments[0].x
		poly1x2 = arguments[0].x + arguments[0].w
		poly1y1 = arguments[0].y
		poly1y2 = arguments[0].y + arguments[0].h
		lowerX1 = Math.min(poly1x1, poly1x2)
		upperX1 = Math.max(poly1x1, poly1x2)
		lowerY1 = Math.min(poly1y1, poly1y2)
		upperY1 = Math.max(poly1y1, poly1y2)

		poly2x1 = arguments[1].x
		poly2x2 = arguments[1].x + arguments[1].w
		poly2y1 = arguments[1].y
		poly2y2 = arguments[1].y + arguments[1].h
		lowerX2 = Math.min(poly2x1, poly2x2)
		upperX2 = Math.max(poly2x1, poly2x2)
		lowerY2 = Math.min(poly2y1, poly2y2)
		upperY2 = Math.max(poly2y1, poly2y2)

		if (lowerX1 <= lowerX2) {
			if (lowerX1 <= lowerX2 && lowerX2 <= upperX1) {
				if (lowerY1 <= lowerY2) {
					if (lowerY1 <= lowerY2 && lowerY2 <= upperY1) {
						return true
					}
				} else {
					if (lowerY2 <= lowerY1 && lowerY1 <= upperY2) {
						return true
					}
				}
			}
		} else {
			if (lowerX2 <= lowerX1 && lowerX1 <= upperX2) {
				if (lowerY1 <= lowerY2) {
					if (lowerY1 <= lowerY2 && lowerY2 <= upperY1) {
						return true
					}
				} else {
					if (lowerY2 <= lowerY1 && lowerY1 <= upperY2) {
						return true
					}
				}
			}
		}
		return false
	}

	if (arguments.length != 2) {
		return null
	}

	if (arguments[0] instanceof Point) {
		if (arguments[1] instanceof Point) {
			if (arguments[0].equal(arguments[1])) {
				return true
			}
		} else if (arguments[1] instanceof Polygon) {
			if (pointAndPolygon(arguments[0], arguments[1])) {
				return true
			}
		}
	} else if (arguments[0] instanceof Polygon) {
		if (arguments[1] instanceof Point) {
			if (pointAndPolygon(arguments[0], arguments[1])) {
				return true
			}
		} else if (arguments[1] instanceof Polygon) {
			if (polygonAndPolygon(arguments[0], arguments[1])) {
				return true
			}
		}
	}
	return false
}

Scene.prototype.isTouching = function() {
	function pointAndPointTouch() {
		x1 = arguments[0].x
		y1 = arguments[0].y
		x2 = arguments[1].x
		y2 = arguments[1].y

		if (x1 == x2) {
			if (y1 + 1 == y2 || y1 - 1 == y2) {
				return true
			}
		} else if (y1 == y2) {
			if (x1 + 1 == x2 || x1 - 1 == x2) {
				return true
			}
		} else {
			if (x1 + 1 == x2 || x1 - 1 == x2) {
				if (y1 + 1 == y2 || y1 - 1 == y2) {
					return true
				}
			}
		}

		return false
	}
	function pointAndPolygonTouch() {
		if (arguments[0] instanceof Point) {
			pointX = arguments[0].x
			pointY = arguments[0].y
			poly1x1 = arguments[1].x
			poly1x2 = arguments[1].x + arguments[1].w
			poly1y1 = arguments[1].y
			poly1y2 = arguments[1].y + arguments[1].h
		} else {
			pointX = arguments[1].x
			pointY = arguments[1].y
			poly1x1 = arguments[0].x
			poly1x2 = arguments[0].x + arguments[0].w
			poly1y1 = arguments[0].y
			poly1y2 = arguments[0].y + arguments[0].h
		}
		lowerX1 = Math.min(poly1x1, poly1x2)
		upperX1 = Math.max(poly1x1, poly1x2)
		lowerY1 = Math.min(poly1y1, poly1y2)
		upperY1 = Math.max(poly1y1, poly1y2)

		if (pointX <= upperX1 + 1 && pointX >= lowerX1 - 1) {
			if (pointY <= lowerY1 && pointY >= lowerY1 - 1) {
				return true
			} else if (pointY >= upperY1 && pointY <= upperY1 + 1) {
				return true
			}
		} else if (pointY <= upperY1 + 1 && pointY >= lowerY1 - 1) {
			if (pointX <= lowerX1 && pointX >= lowerX1 - 1) {
				return true
			} else if (pointX >= upperX1 && pointX <= upperX1 + 1) {
				return true
			}
		}
		return false
	}

	function polygonAndPolygonTouch() {
		poly1x1 = arguments[0].x
		poly1x2 = arguments[0].x + arguments[0].w
		poly1y1 = arguments[0].y
		poly1y2 = arguments[0].y + arguments[0].h
		lowerX1 = Math.min(poly1x1, poly1x2)
		upperX1 = Math.max(poly1x1, poly1x2)
		lowerY1 = Math.min(poly1y1, poly1y2)
		upperY1 = Math.max(poly1y1, poly1y2)

		poly2x1 = arguments[1].x
		poly2x2 = arguments[1].x + arguments[1].w
		poly2y1 = arguments[1].y
		poly2y2 = arguments[1].y + arguments[1].h
		lowerX2 = Math.min(poly2x1, poly2x2)
		upperX2 = Math.max(poly2x1, poly2x2)
		lowerY2 = Math.min(poly2y1, poly2y2)
		upperY2 = Math.max(poly2y1, poly2y2)

		if (upperX2 <= lowerX1 && upperX2 >= lowerX1 - 1) {
			if (!(upperY2 < lowerY1 - 1 || lowerY2 > upperY1 + 1)) {
				return true
			}
		} else if (lowerX2 >= upperX1 && lowerX2 <= upperX1 + 1) {
			if (!(upperY2 < lowerY1 - 1 || lowerY2 > upperY1 + 1)) {
				return true
			}
		} else if (upperY2 <= lowerY1 && upperY2 >= lowerY1 - 1) {
			if (!(upperX2 < lowerX1 - 1 || lowerX2 > upperX1 + 1)) {
				return true
			}
		} else if (lowerY2 >= upperY1 && lowerY2 <= upperY1 + 1) {
			if (!(upperX2 < lowerX1 - 1 || lowerX2 > upperX1 + 1)) {
				return true
			}
		}
		return false
	}

	if (arguments.length != 2) {
		return null
	}

	if (arguments[0] instanceof Point) {
		if (arguments[1] instanceof Point) {
			if (pointAndPointTouch(arguments[0], arguments[1])) {
				return true
			}
		} else if (arguments[1] instanceof Polygon) {
			if (pointAndPolygonTouch(arguments[0], arguments[1])) {
				return true
			}
		}
	} else if (arguments[0] instanceof Polygon) {
		if (arguments[1] instanceof Point) {
			if (pointAndPolygonTouch(arguments[0], arguments[1])) {
				return true
			}
		} else if (arguments[1] instanceof Polygon) {
			if (polygonAndPolygonTouch(arguments[0], arguments[1])) {
				return true
			}
		}
	}
	return false
}

Scene.prototype.createDivs = function() {
	//This breaks down the screen into smaller squares that store references to the objects within
	//them.
	divW = this.cellsize * this.divisionGranularity
	divH = this.cellsize * this.divisionGranularity

	maxW = Math.ceil(theCanvasElement.width / divW)
	maxH = Math.ceil(theCanvasElement.height / divH)

	//setup Scene boxes
	for (var i = 0; i < maxH; i++) {
		for (var j = 0; j < maxW; j++) {
			x = Math.ceil(j * divW)
			y = Math.ceil(i * divH)
			this.divisions[this.divisions.length] = new divisionBox(x, y, divW, divH)
		}
	}
}

Scene.prototype.getDivRefs = function() {
	temp = []
	for (var i = 0; i < arguments[0].length; i++) {
		temp = temp.concat(arguments[0][i].references)
	}
	return temp
}

Scene.prototype.getDivs = function() {
	temp = []
	for (var i = 0; i < scene.divisions.length; i++) {
		if (scene.isColliding(scene.divisions[i], arguments[0])) {
			temp = temp.concat([scene.divisions[i]])
		}
	}
	//In the Mozilla js doc's -1 means the object was not found
	return temp
}

//------------------------------------------------------------------------------------------------
function Point(x, y) {
	this.x = x
	this.y = y
}

Point.prototype = Object.create(Object.prototype)

Point.prototype.equal = function(arg) {
	if (this.toString() == arg.toString()) {
		return true
	}
	return false
}

Point.prototype.toString = function() {
	return "Point: (" + this.x + ", " + this.y + ")"
}

//------------------------------------------------------------------------------------------------
function Polygon(x, y, w, h) {
	this.x = x
	this.y = y
	this.w = w
	this.h = h
}

Polygon.prototype = Object.create(Object.prototype)

Polygon.prototype.equal = function(arg) {
	if (this.toString() == arg.toString()) {
		return true
	}
	return false
}

Polygon.prototype.toString = function() {
	return "Polygon: (" + this.x + ", " + this.y + ", " + this.w + ", " + this.h + ")"
}

Polygon.prototype.area = function() {
	return Math.abs(this.w) * Math.abs(this.h)
}

//------------------------------------------------------------------------------------------------
function GreyBox(x, y, w, h) {
	Polygon.call(this, x, y, w, h)

	this.focus = false
	this.index = null
	this.colours = {0:"rgba(0, 0, 0, 0.8)",
					1:"rgba(150, 150, 150, 0.8)"}

	this.text = [""]
	this.textLine = 0
	this.textOffset = theScene.cellsize - 1
}

GreyBox.prototype = Object.create(Polygon.prototype)

GreyBox.prototype.draw = function(ctx) {
	if (this.focus) {
		ctx.strokeStyle = this.colours[0]
		ctx.fillStyle = this.colours[0]

	} else {
		ctx.strokeStyle = this.colours[1]
		ctx.fillStyle = this.colours[1]
	}
	ctx.strokeRect(this.x, this.y, this.w, this.h)

	parsedText = parseBoxText(this.text)
	for (var i = 0; i < parsedText.length; i++) {
		ctx.fillText(parsedText[i], this.x, this.y + this.textOffset)
	}
}

//------------------------------------------------------------------------------------------------
function GhostBox(x, y, w, h) {
	Polygon.call(this, x, y, w, h)
	this.old = null
	this.flag = false
	this.colours = {0:"rgba(0, 255, 0, 0.8)",
					1:"rgba(255, 0, 0, 0.8)"}
}

GhostBox.prototype = Object.create(Polygon.prototype)

GhostBox.prototype.draw = function(ctx) {
	if (this.flag) {
		ctx.strokeStyle = this.colours[0]
		ctx.strokeRect(this.x, this.y, this.w, this.h)
	} else {
		ctx.strokeStyle = this.colours[1]
		ctx.strokeRect(this.x, this.y, this.w, this.h)
	}
}

//------------------------------------------------------------------------------------------------
function divisionBox(x, y, w, h) {
	Polygon.call(this, x, y, w, h)
	this.focus = false
	this.references = []
}

divisionBox.prototype = Object.create(Polygon.prototype)

divisionBox.prototype.addRef = function() {
	this.references.push(arguments[0])
}

divisionBox.prototype.removeRef = function() {
	temp = []
	for (var i = 0; i < this.references.length; i++) {
		if (this.references[i] != arguments[0]){
			temp.push(this.references[i])
		}
	}
	this.references = temp
}

divisionBox.prototype.draw = function(ctx) {
	if (this.focus) {
		ctx.strokeStyle = "red"
	} else {
		ctx.strokeStyle = "rgba(255,0,0, 0.4)"
	}

	ctx.strokeRect(this.x, this.y, this.w, this.h)
}

//================================================================================================
//functions
//================================================================================================

function lonelyFunction(noArguing) {
	// body... but has no soul
}

function findClosestPoints () {
	//Random function might be useful somewhere later
	shortestDistance = Infinity
	closestPoints = []

	if (arguments[0] instanceof Point) {
		x2 = arguments[0].x
		y2 = arguments[0].y
		if (arguments[1] instanceof Point) {
			return [arguments[0], arguments[1]]
		} else {
			for (var i = 0; i < 4; i++) {
				if (i == 0) {
					x1 = arguments[1].x
					y1 = arguments[1].y
				} else if (i == 1) {
					x1 = arguments[1].x + arguments[1].w
					y1 = arguments[1].y
				} else if (i == 2) {
					x1 = arguments[1].x
					y1 = arguments[1].y + arguments[1].h
				} else if (i == 3) {
					x1 = arguments[1].x + arguments[1].w
					y1 = arguments[1].y + arguments[1].h
				}
				a = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
				if (a < shortestDistance) {
					shortestDistance = a
					closestPoints = [new Point(x2, y2), new Point(x1, y1)]
				}
				if (shortestDistance == 0) {
					return closestPoints
				}
			}
			return closestPoints
		}
	} else if (arguments[0] instanceof Polygon) {
		if (arguments[1] instanceof Point) {
			x2 = arguments[1].x
			y2 = arguments[1].y
			for (var i = 0; i < 4; i++) {
				if (i == 0) {
					x1 = arguments[0].x
					y1 = arguments[0].y
				} else if (i == 1) {
					x1 = arguments[0].x + arguments[0].w
					y1 = arguments[0].y
				} else if (i == 2) {
					x1 = arguments[0].x
					y1 = arguments[0].y + arguments[0].h
				} else if (i == 3) {
					x1 = arguments[0].x + arguments[0].w
					y1 = arguments[0].y + arguments[0].h
				}
				a = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
				if (a < shortestDistance) {
					shortestDistance = a
					closestPoints = [new Point(x2, y2), new Point(x1, y1)]
				}
				if (shortestDistance == 0) {
					return closestPoints
				}
			}
			return closestPoints
		} else {
			for (var i = 0; i < 4; i++) {
				if (i == 0) {
					x1 = arguments[0].x
					y1 = arguments[0].y
				} else if (i == 1) {
					x1 = arguments[0].x + arguments[0].w
					y1 = arguments[0].y
				} else if (i == 2) {
					x1 = arguments[0].x
					y1 = arguments[0].y + arguments[0].h
				} else if (i == 3) {
					x1 = arguments[0].x + arguments[0].w
					y1 = arguments[0].y + arguments[0].h
				}
				for (var j = 0; j < 4; j++) {
					if (j == 0) {
						x2 = arguments[1].x
						y2 = arguments[1].y
					} else if (j == 1) {
						x2 = arguments[1].x + arguments[1].w
						y2 = arguments[1].y
					} else if (j == 2) {
						x2 = arguments[1].x
						y2 = arguments[1].y + arguments[1].h
					} else if (j == 3) {
						x2 = arguments[1].x + arguments[1].w
						y2 = arguments[1].y + arguments[1].h
					}
					a = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
					if (a < shortestDistance) {
						shortestDistance = a
						closestPoints = [x2, y2, x1, y1]
					}
					if (shortestDistance == 0) {
						return closestPoints
					}
				}
			}
			return closestPoints
		}
	}
}

function parseBoxText() {
	text = []
	text.push(arguments[0])
	return text
}

function parseWhichKey() {
	switch (arguments[0]){
		//Numbers
		case 48:
			return "0"
		case 49:
			return "1"
		case 50:
			return "2"
		case 51:
			return "3"
		case 52:
			return "4"
		case 53:
			return "5"
		case 54:
			return "6"
		case 55:
			return "7"
		case 56:
			return "8"
		case 57:
			return "9"
		//Letters
		case 65:
			return "a"
		case 66:
			return "b"
		case 67:
			return "c"
		case 68:
			return "d"
		case 69:
			return "e"
		case 70:
			return "f"
		case 71:
			return "g"
		case 72:
			return "h"
		case 73:
			return "i"
		case 74:
			return "j"
		case 75:
			return "k"
		case 76:
			return "l"
		case 77:
			return "m"
		case 78:
			return "n"
		case 79:
			return "o"
		case 80:
			return "p"
		case 81:
			return "q"
		case 82:
			return "r"
		case 83:
			return "s"
		case 84:
			return "t"
		case 85:
			return "u"
		case 86:
			return "v"
		case 87:
			return "w"
		case 88:
			return "x"
		case 89:
			return "y"
		case 90:
			return "z"
		default:
			return "#"
	}
}

//================================================================================================
//Jquery
//================================================================================================

function keyboardAndMouseSetup() {
	$("#theCanvasElement").mousedown(function(event) {
		mousePos = new Point(event.pageX, event.pageY)
		theScene.mouseDown = true

		clickedObject = false

		divs = theScene.getDivs(mousePos)
		refs = theScene.getDivRefs(divs)
		obj = null

		for (var i = 0; i < refs.length; i++) {
			obj = theScene.getObject(refs[i])
			if (theScene.isColliding(obj, mousePos)){
				clickedObject = true
				break
			}
		}

		if (clickedObject) {
			//Something was clicked
			if (theScene.currentObject) {
				if (!theScene.currentObject.equal(obj)) {
					theScene.currentObject.focus = false
					theScene.currentObject = obj
					obj.focus = true
				}
			} else {
				theScene.currentObject = obj
				obj.focus = true
			}
		} else {
			//Nothing was clicked lets create an object
			sqrX = Math.floor(event.pageX / theScene.cellsize) * theScene.cellsize
			sqrY = Math.floor(event.pageY / theScene.cellsize) * theScene.cellsize
			obj = new GreyBox(sqrX, sqrY, theScene.cellsize, theScene.cellsize)
			theScene.addObject(obj)
			divs = theScene.getDivs(obj)
			for (var i = 0; i < divs.length; i++) {
				divs[i].references.push(obj.index)
			}
			if (theScene.currentObject) {
				theScene.currentObject.focus =  false
			}
			theScene.currentObject = obj
			obj.focus = true
		}
	})

	$("#theCanvasElement").mousemove(function(event) {
		mousePos = new Point(event.pageX, event.pageY)
		obj = theScene.currentObject

		cell = theScene.cellsize

		if (debugging) {
			divs = theScene.getDivs(mousePos)
			for (var i = 0; i < theScene.divisions.length; i++) {
				theScene.divisions[i].focus = false
			}
			for (var i = 0; i < divs.length; i++) {
				divs[i].focus = true
			}
		}

		if (obj) {
			if (theScene.ghostObject) {
				sqrX = Math.floor(event.pageX / cell) * cell
				sqrY = Math.floor(event.pageY / cell) * cell

				gObj = theScene.ghostObject
				gObj.x = sqrX
				gObj.y = sqrY

				divs = theScene.getDivs(gObj)
				refs = theScene.getDivRefs(divs)
				for (var i = 0; i < refs.length; i++) {
					tempObj = theScene.getObject(refs[i])
					if (!theScene.isColliding(gObj, tempObj)) {
						gObj.flag = true
					} else if (theScene.isTouching(gObj, tempObj)) {
						gObj.flag = true
					} else if (gObj.equal(gObj.old)) {
						gObj.flag = true
					} else {
						gObj.flag = false
						break
					}
				}
			} else if (obj.focus && theScene.mouseDown) {
				gObj = new GhostBox(obj.x, obj.y, obj.w, obj.h)
				gObj.old = obj
				theScene.ghostObject = gObj
			}
		}
	})

	$(document).mouseup(function(event) {
		mousePos = new Point(event.pageX, event.pageY)
		theScene.mouseDown = false
		gObj = theScene.ghostObject

		if (gObj) {
			if (gObj.flag) {
				divs = theScene.divisions
				for (var i = 0; i < divs.length; i++) {
					divs[i].removeRef(theScene.currentObject.index)
				}
				theScene.currentObject.x = gObj.x
				theScene.currentObject.y = gObj.y

				divs = theScene.getDivs(theScene.currentObject)
				for (var i = 0; i < divs.length; i++) {
					divs[i].addRef(theScene.currentObject.index)
				}
			}

			theScene.ghostObject = null
		}
	})

	$(document).keyup(function(event) {
		obj = theScene.currentObject
		if (obj) {
			key = event.which
			letter = parseWhichKey(key)
			if (key == 46) {
				//delete was pressed
				//remove from all divisions
				for (var i = 0; i < theScene.divisions.length; i++) {
				 	theScene.divisions[i].removeRef(obj.index)
				 }
				theScene.removeObject(obj.index)
				theScene.currentObject = null
			}
			if (key == 13) {
				//enter was pressed
			}
			if ((key >= 65 && key <= 90)||(key >= 48 && key <= 57)||(key >= 96 && key <= 105)) {
				//letter or number was pressed
				currentLength = theScene.ctx.measureText(obj.text[obj.textLine]).width
				letterLen = theScene.ctx.measureText(letter).width
				if (currentLength + letterLen > obj.w ) {
					obj.w = obj.w + theScene.cellsize
				}
				obj.text[obj.textLine] = obj.text[obj.textLine] + letter
			}
		}
	})
}

//================================================================================================
//runtime
//================================================================================================

$(document).ready(function() {

	scene = new Scene() //objects array
	scene.ctx = theCanvasElement.getContext("2d")
	scene.ctx.font = "" + (scene.cellsize * 1.25) + "px sans-serif"

	theScene = scene

	keyboardAndMouseSetup()

	setInterval(function() {
		//------Sort of layers------
		scene.drawBackgroundDefault()

		//--------------------------
		if (debugging) {
			for (var i = 0; i < scene.divisions.length; i++) {
				scene.divisions[i].draw(scene.ctx)
			}
		}
		//--------------------------
		if ((scene.objects.length - scene.freeIndex.length) > 0) {
			for (var i = 0; i < scene.objects.length; i++) {
				if (scene.objects[i]) {
					scene.objects[i].draw(scene.ctx)
				}
			}
		}
		//--------------------------
		if (scene.ghostObject) {
			scene.ghostObject.draw(scene.ctx)
		}
		//--------------------------
	}, 30)
})
