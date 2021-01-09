
var polyCanvas = function(c) {

  c.reset = function() {
    poly.sourcePoint = null;
    poly.targetPoint = null;
    poly.route = null;
    poly.targetFace = null;
    poly.sourceFace = poly.faces[0];
    //poly.faces.forEach((face) => face.reset());
  }

  c.setup = function() {
    const can = c.createCanvas(700, 350, c.WEBGL);
    c.frameRate(12);
    c.displayScale = 0.6;
    poly.sourcePoint = null;
    poly.targetPoint = null;
    c.loadPoly("assets/icosahedron.obj")
  }

  c.loadPoly = function(modelFile) {
    poly.faces = [];
    poly.sourceFace = null;
    poly.targetFace = null;
    poly.geo = c.loadModel(modelFile, true, (geo) => {
      poly.faces = buildFaces(geo);
      poly.sourceFace = poly.faces[0];
      cut(poly.sourceFace);
      poly.sourceFace.flatten(c.displayScale);
    });
    poly.route = null;
  }


  c.draw = function() {
    // Put drawings here
    c.background(97);
    c.scale(c.displayScale);
    c.rotateX(c.frameCount * 0.015);
    c.rotateY(c.frameCount * 0.015);
    c.model(poly.geo);
    displayPolyhedron(c,
      poly.faces,
      poly.route,
      poly.sourceFace,
      poly.sourcePoint,
      poly.targetFace,
      poly.targetPoint
    );
  }

  c.buildRoute = function() {
  	if (poly.sourcePoint && poly.targetPoint) {
      poly.route = buildRoute(
        poly.sourcePoint,
        poly.sourceFace,
        poly.targetPoint,
        poly.targetFace,
        poly.faces.length
      );
    }
  }
}
