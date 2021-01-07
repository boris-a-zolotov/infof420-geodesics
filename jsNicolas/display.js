function displayFace(can, face, edgeColor = "black") {
  can.stroke(edgeColor);
  can.strokeWeight(4);
  can.fill(0, 0, 0, 0);
  can.beginShape();
  face.vertices.forEach((v) => can.vertex(v.x, v.y, v.z));
  can.endShape(can.CLOSE);
  can.strokeWeight(1);
}

function displayPoint(can, point, edgeColor = "black", fillColor = "white") {
  can.stroke(edgeColor);
  can.strokeWeight(8);
  can.fill(fillColor);
  can.beginShape(can.POINTS);
  can.vertex(point.x, point.y, point.z);
  can.endShape();
  can.strokeWeight(1);
}

function displayPolyhedron(can, 
  faces,
  route,
  sourceFace,
  sourcePoint,
  targetFace,
  targetPoint
) {
  if (route) {
    can.stroke("red");
    can.fill(255, 165, 0, 140); // transparent orange
    route.forEach((path) => {
      path.forEach((shape) => {
        can.beginShape();
        shape.forEach((v) => can.vertex(v.x, v.y, v.z));
        can.endShape(can.CLOSE);
      });
    });
    displayFace(can, sourceFace, "lime");
    displayPoint(can, sourcePoint, "lime");
    displayFace(can, targetFace, "blue");
    displayPoint(can, targetPoint, "blue");
    can.stroke("black");
    can.fill("white");
  }
}

function displayFlatFace(can, face, point, color) {
  if (point) {
    can.stroke(color);
    can.fill(color);
    can.ellipse(point.x, point.y, 6, 6);
    for (let j = 0; j < face.length; ++j) {
      const k = (j + 1) % face.length;
      can.line(
        face.flatVertices[j].x,
        face.flatVertices[j].y,
        face.flatVertices[k].x,
        face.flatVertices[k].y
      );
    }
  }
}

function displayCutPoly(can, 
  faces,
  sourceFace,
  flatSourcePoint,
  targetFace,
  flatTargetPoint,
  displayScale
) {
  faces.forEach((face) => {
    can.triangle(
      face.flatVertices[0].x,
      face.flatVertices[0].y,
      face.flatVertices[1].x,
      face.flatVertices[1].y,
      face.flatVertices[2].x,
      face.flatVertices[2].y
    );
    for (let j = 0; j < face.length; ++j) {
      const k = (j + 1) % face.length;
      if (face.edges[j].cut) can.stroke("red");
      else if (!face.edges[j].corner) can.stroke("lightgray");
      can.line(
        face.flatVertices[j].x,
        face.flatVertices[j].y,
        face.flatVertices[k].x,
        face.flatVertices[k].y
      );
      can.stroke("black");
    }
  });
  can.fill("black");
  can.ellipse(
    (can.mouseX - can.width / 2) / displayScale,
    (can.mouseY - can.height / 2) / displayScale,
    6,
    6
  );
  displayFlatFace(can, sourceFace, flatSourcePoint, "lime");
  displayFlatFace(can, targetFace, flatTargetPoint, "blue");
  can.stroke("black");
  can.fill("white");
}
