// NET OF A SQUARE:
// planar graph represented by DCEL
// numbers are equivalence classes of edges

let net = [
    [2, 6, 1, 5],
    [3, 0, 2, 11],
    [4, 8, 3, 7],
    [1, 10, 4, 9],
    [8, 10, 6, 0],
    [7, 11, 5, 9]
];


// RANDOMIZATION:
// field is the size of space where a face is selected from
// globalArray has to be initialized according to
// the size of the net

const field = 4;

let globalArray = [1, 0, 3, 1, 2, 3, 0, 2,
    1, 0, 3, 1, 2, 3, 0, 2,
    1, 0, 3, 1, 2, 3, 0, 2,
    1, 0, 3, 1, 2, 3, 0, 2,
    1, 0, 3, 1, 2, 3, 0, 2,
    1, 0, 3, 1, 2, 3, 0, 2
];


// INITIALIZATIONS:

let faces = []; // List of coordinates of vertices
let vertices = []; // List of edges, incident to vertices
let cl = 0; // Current degree of a vertex
let sca = 1000; // Data of a new edge appended to a vertex
let scb = 1000;
let lastFace = 0;
let lastEdge = 0;
let StopCondition = true;
let edges = [];
let maxedge = 0;


// TECHNICAL FUNCTIONS:

// angle between segments based on dot product

function angle([x1, y1], [x2, y2]) {
    let length1 = Math.sqrt(x1 * x1 + y1 * y1);
    let length2 = Math.sqrt(x2 * x2 + y2 * y2);
    return Math.acos((x1 * x2 + y1 * y2) / length1 / length2);
}

// checking if arrays are equal

function arraysEq(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (var i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
};


// Return direction of the i-th edge of the face

function ithEdge(face, i) {
    let l = face.length;
    if (i == l - 1) {
        return [face[0][0] - face[i][0], face[0][1] - face[i][1]];
    } else {
        return [face[i + 1][0] - face[i][0], face[i + 1][1] - face[i][1]];
    }
}


// CHECKING IF TWO SEGMENTS ARE GLUABLE

function piRotate([x, y]) {
    return [-1 * y, x];
}

function sameSegment(s1, s2) {
    if (arraysEq(s1, s2)) return true;
    if (arraysEq(s1, piRotate(s2))) return true;
    if (arraysEq(s1, piRotate(piRotate(s2)))) return true;
    if (arraysEq(s1, piRotate(piRotate(piRotate(s2))))) return true;
    return false;
}

function edgesFit(edge) {
    let copy1 = ithEdge(faces[edge[0]], edge[1]);
    let copy2 = ithEdge(faces[edge[2]], edge[3]);
    return sameSegment(copy1, copy2);
}

function checkAllEdgesFit() { // IMPORTANT: ONE OF THE CHECKS
    for (var i = 0; i < edges.length; i++) {
        if (!edgesFit(edges[i])) {
            return false;
        }
    }
    return true;
}

function isRight([x1, y1], [x2, y2]) {
    return (x1 * y2 - x2 * y1) > 0;
}

function checkAllTurnsRight() { // IMPORTANT: ONE OF THE CHECKS
    for (var fc = 0; fc < faces.length; fc++) {
        for (var eg = 0; eg < (faces[fc].length - 1); eg++) {
            if (!isRight(ithEdge(faces[fc], eg), ithEdge(faces[fc], eg + 1))) {
                return false;
            }
        }
        if (!isRight(ithEdge(faces[fc], faces[fc].length - 1), ithEdge(faces[fc], 0))) {
            return false;
        }
    }
    return true;
}

function checkFaceEdge(face) {
    let horiz = false;
    let vert = false;
    for (var ver = 0; ver < face.length; ver++) {
        if (face[ver][0] == 0) {
            horiz = true;
        }
        if (face[ver][1] == 0) {
            vert = true;
        }
    }
    return horiz && vert;
}

function checkAllFacesEdge() { // IMPORTANT: ONE OF THE CHECKS
    for (fc = 0; fc < faces.length; fc++) {
        if (!checkFaceEdge(faces[fc])) {
            return false;
        }
    }
    return true;
}


function arIncrement() {
    let i = 0;
    let stopHere = false;
    while (!stopHere) {
        if (globalArray[i] !== field) {
            globalArray[i] += 1;
            stopHere = true;
        } else {
            globalArray[i] = 0;
            i += 1;
        }
    }
}

let globalCycle = 0;
let p = true;

for (globalCycle = 0; globalCycle < 10; globalCycle++) {
    p = true;
    for (var i = 0; i < 6; i++) {
        faces[i] = [
            [globalArray[8 * i], globalArray[8 * i + 1]],
            [globalArray[8 * i + 2], globalArray[8 * i + 3]],
            [globalArray[8 * i + 4], globalArray[8 * i + 5]],
            [globalArray[8 * i + 6], globalArray[8 * i + 7]]
        ];
    }
    p = p && checkAllFacesEdge();
    p = p && checkAllTurnsRight();
    p = p && checkAllEdgesFit();
    if (p) {
        console.log(faces);
    }
    arIncrement();
}

function ithAngle(face, i) {
    let [x1, y1] = ithEdge(face, (i - 1 + face.length) % face.length);
    let [x2, y2] = ithEdge(face, i);
    return angle([-1 * x1, -1 * y1], [x2, y2]);
}

console.log(ithAngle(faces[1], 0));

console.log('end');