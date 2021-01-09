
var canvasEnv = function(c) {

  c.locatePoint = function() {
    let point = c.createVector(
      (c.mouseX - c.width / 2) / c.displayScale,
      (c.mouseY - c.height / 2) / c.displayScale
    );
    let face = null;
    let i = 0;
    while (i < c.faces.length && !isInFace(c.faces[i], point)) ++i;
    if (i !== c.faces.length) face = c.faces[i];
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
    c.sourcePoint = null;
    c.targetPoint = null;
    c.route = null;
    c.targetFace = null;
    c.sourceFace = c.faces[0];
  }

  c.setup = function() {
    const can = c.createCanvas(c.windowWidth/2, c.windowHeight/2, c.WEBGL);
    can.mouseClicked(c.handleClick);
    c.frameRate(12);
    c.displayScale = 0.6;
    c.flatSourcePoint = null;
    c.flatTargetPoint = null;
    c.sourcePoint = null;
    c.targetPoint = null;
  }

  c.preload = function() {
    c.loadPoly();
  }

  c.loadPoly = function() {
    const select = document.getElementById("selectButton");
    const modelFile = select.options[select.selectedIndex].value;
    c.faces = [];
    c.flatPoly = false;
    c.sourceFace = null;
    c.targetFace = null;
    c.poly = c.loadModel(modelFile, true, (geo) => {
      c.faces = buildFaces(geo);
      c.sourceFace = c.faces[0];
    });
    c.route = null;
  }

  c.draw = function() {
    // Put drawings here
    c.background(200);
    c.scale(c.displayScale);
    if (c.flatPoly) {
      displayCutPoly(c,
        c.faces,
        c.sourceFace,
        c.flatSourcePoint,
        c.targetFace,
        c.flatTargetPoint,
        c.displayScale
      );
    } else {
      c.rotateX(c.frameCount * 0.015);
      c.rotateY(c.frameCount * 0.015);
      c.model(c.poly);
      displayPolyhedron(c,
        c.faces,
        c.route,
        c.sourceFace,
        c.sourcePoint,
        c.targetFace,
        c.targetPoint
      );
    }
  }

  c.switchDisplay = function() {
    if (c.flatPoly) {
      c.flatPoly = false;
      if (c.sourcePoint && c.targetPoint) {
        c.route = buildRoute(
          c.sourcePoint,
          c.sourceFace,
          c.targetPoint,
          c.targetFace,
          c.faces.length
        );
        c.resetPoints();
      }
      c.faces.forEach((face) => face.reset());
      document.getElementById("button1").innerText = "Flatten";
    } else {
      c.flatPoly = true;
      c.rotateX(0);
      c.rotateY(0);
      cut(c.sourceFace);
      c.sourceFace.flatten(c.displayScale);
      document.getElementById("button1").innerText = "Rebuild";
    }
  }

  c.handleClick = function() {
    if (c.flatPoly) {
      const [point, face] = c.locatePoint();
      const boundPoint = bindPointToFace(point, face);
      if (!c.flatSourcePoint) {
        c.flatSourcePoint = point;
        c.sourceFace = face;
        c.sourcePoint = boundPoint;
      } else {
        c.flatTargetPoint = point;
        c.targetFace = face;
        c.targetPoint = boundPoint;
      }
    }
  }
}
