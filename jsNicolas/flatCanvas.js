
var flatCanvas = function(c) {

  c.locatePoint = function() {
    let point = c.createVector(
      (c.mouseX - c.width / 2) / c.displayScale,
      (c.mouseY - c.height / 2) / c.displayScale
    );
    let face = null;
    let i = 0;
    while (i < poly.faces.length && !isInFace(poly.faces[i], point)) ++i;
    if (i !== poly.faces.length) face = poly.faces[i];
    else point = null;
    return [point, face];
  }

  c.resetPoints = function() {
    c.flatSourcePoint = null;
    c.flatTargetPoint = null;
  }

  c.resetAll = function() {
    c.flatSourcePoint = null;
    c.flatTargetPoint = null;
    polyCan.reset();
  }

  c.setup = function() {
    const can = c.createCanvas(700, 350, c.WEBGL);
    can.mouseClicked(c.handleClick);
    c.frameRate(12);
    c.displayScale = 0.6;
    c.flatSourcePoint = null;
    c.flatTargetPoint = null;
  }

  c.draw = function() {
    // Put drawings here
    c.background(97);
    c.scale(c.displayScale);
    displayCutPoly(c,
      poly.faces,
      poly.sourceFace,
      c.flatSourcePoint,
      poly.targetFace,
      c.flatTargetPoint,
      c.displayScale
    );
  }

  c.handleClick = function() {
    const [point, face] = c.locatePoint();
    const boundPoint = bindPointToFace(point, face);
    if (!c.flatSourcePoint) {
      c.flatSourcePoint = point;
      poly.sourceFace = face;
      poly.sourcePoint = boundPoint;
    } else {
      c.flatTargetPoint = point;
      poly.targetFace = face;
      poly.targetPoint = boundPoint;
      polyCan.buildRoute();
    }
  }
}
