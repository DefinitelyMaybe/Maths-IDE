QUnit.test("Custom Array Tests", function(assert) {
	a = new Scene()
	b = new GreyBox(1, 1, 1, 1)

	assert.equal(a.objects.length, 0, "initial length")
	assert.equal(a.freeIndex.length, 0, "initial length")

	a.addObject("1")
	assert.equal(a.objects.length, 1, "length increased")
	assert.equal(a.getObject(0), "1", "correct object in array")

	a.removeObject(0)
	assert.equal(a.objects.length, 1, "Array length unchanged")

	a.addObject("2")
	assert.equal(a.objects.length, 1, "Array length unchanged")

	a.addObject(b)
	assert.equal(b.index == 1, true, "object has the correct index")
	assert.equal(a.getObject(1) == b, true, "Got the right object from the Array")

	b = new Scene()
	for (var i = 0; i < 10; i++) {
		b.addObject(i.toString())
	}
	b.removeObject(6)
	b.addObject(new Point(1, 1))
	assert.equal(b.linearObjectSearch("Point: (1, 1)"), 6, "Linear Search of Array")
})

QUnit.test("Point Object", function(assert) {
	a = new Point(3, 1)
	b = new Point(3, 2)
	c = new Point(2, 1)
	assert.equal(a.toString(), "Point: (3, 1)", "toString")
	assert.equal(a.equal(a), true, "equality check")
	assert.equal(a.equal(c), false, "x inequality check")
	assert.equal(a.equal(b), false, "y inequality check")
})

QUnit.test("Polygon Object", function(assert) {
	a = new Polygon(1, 1, 1, 1)
	b = new Polygon(1, 1, 1, 1)
	c = new Polygon(1, 1, 2, 2)
	assert.equal(a.toString(), "Polygon: (1, 1, 1, 1)", "toString")
	assert.equal(a.equal(b), true, "equality check")
	assert.equal(a.equal(c), false, "inequality check")
})

QUnit.test("Collision Functions", function(assert) {
	//May need to revist the functions down the road depending on whether a +/-1 to touching
	// values matters.
	a = new Scene()

	p1 = new Point(1, 1)
	p2 = new Point(1, 3)
	p3 = new Point(3, 1)
	p4 = new Point(0.1, 1)
	p5 = new Point(2.9, 1)
	p6 = new Point(1, 0.1)
	p7 = new Point(1, 2.9)
	p8 = new Point(-0.1, 1)
	p9 = new Point(1, 3.1)
	objA = new Polygon(0, 0, 3, 3)

	assert.equal(a.isColliding(p1, p1), true, "Same Points")
	assert.equal(a.isColliding(p1, p2), false, "Different Points - x but not y")
	assert.equal(a.isColliding(p1, p3), false, "Different Points - y but not x")
	assert.equal(a.isColliding(p4, objA), true, "Point in Polygon - smaller x ways")
	assert.equal(a.isColliding(p5, objA), true, "Point in Polygon - larger x ways")
	assert.equal(a.isColliding(p6, objA), true, "Point in Polygon - smaller y ways")
	assert.equal(a.isColliding(p7, objA), true, "Point in Polygon - larger y ways")
	assert.equal(a.isColliding(p8, objA), false, "Point out of Polygon - x but not y")
	assert.equal(a.isColliding(p9, objA), false, "Point out of Polygon - y but not x")

	//test object group 1
	objA = new Polygon(0, 0, 30, 30)
	objB = new Polygon(-10, 10, 20, 20)
	objC = new Polygon(20, 10, 20, 20)
	objD = new Polygon(-10, 20, 20, 20)
	objE = new Polygon(20, 20, 20, 20)

	//test object group 2
	objF = new Polygon(0, 0, 40, 40)
	objG = new Polygon(10, -10, 20, 20)
	objH = new Polygon(30, 10, 20, 20)
	objI = new Polygon(10, 30, 20, 20)
	objJ = new Polygon(-10, 10, 20, 20)

	//test object group 3
	objK = new Polygon(0, 0, 10, 30)
	objL = new Polygon(-10, 10, 30, 10)

	//test object group 4
	objM = new Polygon(0, 0, 30, 30)
	objN = new Polygon(10, 10, 10, 10)

	//test object group 5
	objP = new Polygon(-20, -20, 10, 10)
	objQ = new Polygon(10, -20, 10, 10)
	objR = new Polygon(40, -20, 10, 10)
	objS = new Polygon(40, 10, 10, 10)
	objT = new Polygon(40, 40, 10, 10)
	objU = new Polygon(10, 40, 10, 10)
	objV = new Polygon(-20, 40, 10, 10)
	objW = new Polygon(-20, 10, 10, 10)

	assert.equal(a.isColliding(objA, objA), true, "Same Polygons")
	assert.equal(a.isColliding(objK, objL), true, "Polygon in Polygon - crossing")
	assert.equal(a.isColliding(objM, objN), true, "Polygon in Polygon - completely covered")
	assert.equal(a.isColliding(objF, objG), true, "Polygon in Polygon - side 1")
	assert.equal(a.isColliding(objF, objH), true, "Polygon in Polygon - side 2")
	assert.equal(a.isColliding(objF, objI), true, "Polygon in Polygon - side 3")
	assert.equal(a.isColliding(objF, objJ), true, "Polygon in Polygon - side 4")
	assert.equal(a.isColliding(objA, objB), true, "Polygon in Polygon - corner 1")
	assert.equal(a.isColliding(objA, objC), true, "Polygon in Polygon - corner 2")
	assert.equal(a.isColliding(objA, objD), true, "Polygon in Polygon - corner 3")
	assert.equal(a.isColliding(objA, objE), true, "Polygon in Polygon - corner 4")
	assert.equal(a.isColliding(objA, objQ), false, "Polygon out of Polygon - side 1")
	assert.equal(a.isColliding(objA, objS), false, "Polygon out of Polygon - side 2")
	assert.equal(a.isColliding(objA, objU), false, "Polygon out of Polygon - side 3")
	assert.equal(a.isColliding(objA, objW), false, "Polygon out of Polygon - side 4")
	assert.equal(a.isColliding(objA, objP), false, "Polygon out of Polygon - corner 1")
	assert.equal(a.isColliding(objA, objR), false, "Polygon out of Polygon - corner 2")
	assert.equal(a.isColliding(objA, objT), false, "Polygon out of Polygon - corner 3")
	assert.equal(a.isColliding(objA, objV), false, "Polygon out of Polygon - corner 4")

	objA = new Polygon(0, 0, 30, 30)
	objB = new Polygon(0, 0, 40, 40)
	temp1 = objA.x
	temp2 = objA.x + objA.w
	temp3 = objA.y
	temp4 = objA.y + objA.h
	p1 = new Point(temp1, temp3)
	p2 = new Point(temp2, temp3)
	p3 = new Point(temp2, temp4)
	p4 = new Point(temp1, temp4)
	p5 = new Point(temp1 + 15, temp3)
	p6 = new Point(temp2, temp3 + 15)
	p7 = new Point(temp2 - 15, temp4)
	p8 = new Point(temp1, temp4 - 15)

	temp1 = objB.x
	temp2 = objB.x + objB.w
	temp3 = objB.y
	temp4 = objB.y + objB.h
	p9 = new Point(temp1 - 10, temp3 - 10)
	p10 = new Point(temp2, temp3)
	p11 = new Point(temp2, temp4)
	p12 = new Point(temp1, temp4)
	p13 = new Point(temp1 + 20, temp3)
	p14 = new Point(temp2, temp3 + 20)
	p15 = new Point(temp2 - 20, temp4)
	p16 = new Point(temp1, temp4 - 20)

	assert.equal(a.isTouching(p1, objA), true, "Point touching Polygon - corner 1")
	assert.equal(a.isTouching(p2, objA), true, "Point touching Polygon - corner 2")
	assert.equal(a.isTouching(p3, objA), true, "Point touching Polygon - corner 3")
	assert.equal(a.isTouching(p4, objA), true, "Point touching Polygon - corner 4")
	assert.equal(a.isTouching(p5, objA), true, "Point touching Polygon - side 1")
	assert.equal(a.isTouching(p6, objA), true, "Point touching Polygon - side 2")
	assert.equal(a.isTouching(p7, objA), true, "Point touching Polygon - side 3")
	assert.equal(a.isTouching(p8, objA), true, "Point touching Polygon - side 4")
	assert.equal(a.isTouching(p9, objA), false, "Point not touching Polygon - corner 1")
	assert.equal(a.isTouching(p10, objA), false, "Point not touching Polygon - corner 2")
	assert.equal(a.isTouching(p11, objA), false, "Point not touching Polygon - corner 3")
	assert.equal(a.isTouching(p12, objA), false, "Point not touching Polygon - corner 4")
	assert.equal(a.isTouching(p13, objA), false, "Point not touching Polygon - side 1")
	assert.equal(a.isTouching(p14, objA), false, "Point not touching Polygon - side 2")
	assert.equal(a.isTouching(p15, objA), false, "Point not touching Polygon - side 3")
	assert.equal(a.isTouching(p16, objA), false, "Point not touching Polygon - side 4")

	objA = new Polygon(0, 0, 30, 30)

	//test object group 1
	objB = new Polygon(-10, -10, 10, 10)
	objC = new Polygon(30, -10, 10, 10)
	objD = new Polygon(30, 30, 10, 10)
	objE = new Polygon(-10, 30, 10, 10)

	//test object group 2
	objF = new Polygon(10, -10, 10, 10)
	objG = new Polygon(30, 10, 10, 10)
	objH = new Polygon(10, 30, 10, 10)
	objI = new Polygon(-10, 10, 10, 10)

	assert.equal(a.isTouching(objA, objF), true, "Polygon touching Polygon - side 1")
	assert.equal(a.isTouching(objA, objG), true, "Polygon touching Polygon - side 2")
	assert.equal(a.isTouching(objA, objH), true, "Polygon touching Polygon - side 3")
	assert.equal(a.isTouching(objA, objI), true, "Polygon touching Polygon - side 4")
	assert.equal(a.isTouching(objA, objB), true, "Polygon touching Polygon - corner 1")
	assert.equal(a.isTouching(objA, objC), true, "Polygon touching Polygon - corner 2")
	assert.equal(a.isTouching(objA, objD), true, "Polygon touching Polygon - corner 3")
	assert.equal(a.isTouching(objA, objE), true, "Polygon touching Polygon - corner 4")

	objA = new Polygon(0, 0, 30, 30)
	objB = new Polygon(-10, -10, 50, 50)

	//test object group 1
	objC = new Polygon(0, 0, 10, 10)
	objD = new Polygon(20, 0, 10, 10)
	objE = new Polygon(20, 20, 10, 10)
	objF = new Polygon(0, 20, 10, 10)

	//test object group 2
	objG = new Polygon(10, 0, 10, 10)
	objH = new Polygon(20, 10, 10, 10)
	objI = new Polygon(10, 20, 10, 10)
	objJ = new Polygon(0, 10, 10, 10)

	//test object group 3
	objK = new Polygon(10, -20, 10, 10)
	objL = new Polygon(40, 10, 10, 10)
	objM = new Polygon(10, 40, 10, 10)
	objN = new Polygon(-20, 10, 10, 10)

	//test object group 4
	objO = new Polygon(-20, -20, 10, 10)
	objP = new Polygon(40, -20, 10, 10)
	objQ = new Polygon(40, 40, 10, 10)
	objR = new Polygon(-20, 40, 10, 10)

	assert.equal(a.isTouching(objA, objC), false, "Polygon not touching Polygon - side 1")
	assert.equal(a.isTouching(objA, objD), false, "Polygon not touching Polygon - side 2")
	assert.equal(a.isTouching(objA, objE), false, "Polygon not touching Polygon - side 3")
	assert.equal(a.isTouching(objA, objF), false, "Polygon not touching Polygon - side 4")
	assert.equal(a.isTouching(objB, objG), false, "Polygon not touching Polygon - side 5")
	assert.equal(a.isTouching(objB, objH), false, "Polygon not touching Polygon - side 6")
	assert.equal(a.isTouching(objB, objI), false, "Polygon not touching Polygon - side 7")
	assert.equal(a.isTouching(objB, objJ), false, "Polygon not touching Polygon - side 8")
	assert.equal(a.isTouching(objA, objK), false, "Polygon not touching Polygon - side 9")
	assert.equal(a.isTouching(objA, objL), false, "Polygon not touching Polygon - side 10")
	assert.equal(a.isTouching(objA, objM), false, "Polygon not touching Polygon - side 11")
	assert.equal(a.isTouching(objA, objN), false, "Polygon not touching Polygon - side 12")
	assert.equal(a.isTouching(objA, objC), false, "Polygon not touching Polygon - corner 1")
	assert.equal(a.isTouching(objA, objD), false, "Polygon not touching Polygon - corner 2")
	assert.equal(a.isTouching(objA, objE), false, "Polygon not touching Polygon - corner 3")
	assert.equal(a.isTouching(objA, objF), false, "Polygon not touching Polygon - corner 4")
	assert.equal(a.isTouching(objB, objG), false, "Polygon not touching Polygon - corner 5")
	assert.equal(a.isTouching(objB, objH), false, "Polygon not touching Polygon - corner 6")
	assert.equal(a.isTouching(objB, objI), false, "Polygon not touching Polygon - corner 7")
	assert.equal(a.isTouching(objB, objJ), false, "Polygon not touching Polygon - corner 8")
	assert.equal(a.isTouching(objA, objO), false, "Polygon not touching Polygon - corner 9")
	assert.equal(a.isTouching(objA, objP), false, "Polygon not touching Polygon - corner 10")
	assert.equal(a.isTouching(objA, objQ), false, "Polygon not touching Polygon - corner 11")
	assert.equal(a.isTouching(objA, objR), false, "Polygon not touching Polygon - corner 12")

})

QUnit.test("Divisions", function(assert) {
	a = new Scene()
	y = a.cellsize
	z = a.divisionGranularity

	somePoint = new Point(3, 50)
	sidePoint = new Point(0, y*z)
	cornerPoint = new Point(y*z, y*z)

	b = a.getDivs(somePoint)
	c = a.getDivs(sidePoint)
	d = a.getDivs(cornerPoint)


	divisionsArea = 0
	canvasArea = theCanvasElement.width * theCanvasElement.height

	for (var i = 0; i < a.divisions.length; i++) {
		divisionsArea = divisionsArea + a.divisions[i].area()
	}
	assert.equal(divisionsArea >= canvasArea, true, "Is all space covered")
	assert.equal(b.length == 1, true, "Got a division")
	assert.equal(b[0].toString() == "Polygon: (0, 0, " + y*z + ", " + y*z + ")", true,
		"Got correct division")
	assert.equal(c.length == 2, true, "Got two divisions using side point")
	assert.equal(d.length == 4, true, "Got four divisions using corner point")
	//If the point hits an object, grab it

	//Check if its referenced in multiple collboxes

	//If the object is moved
})
