// INITIAL DECLARATION OF FACES

const field = 4;

let globalArray = [1, 0, 3, 1, 2, 3, 0, 2,
    1, 0, 3, 1, 2, 3, 0, 2,
    1, 0, 3, 1, 2, 3, 0, 2,
    1, 0, 3, 1, 2, 3, 0, 2,
    1, 0, 3, 1, 2, 3, 0, 2,
    1, 0, 3, 1, 2, 3, 0, 2
];

let faces = []


// Return direction of the i-th edge of the face

// i-th edge is between vertices i and i+1
// i-th vertex is between edges i-1 and i

function ithEdge(face, i) {
    let l = face.length;
    if (i == l - 1) {
        return [face[0][0] - face[i][0], face[0][1] - face[i][1]];
    } else {
        return [face[i + 1][0] - face[i][0], face[i + 1][1] - face[i][1]];
    }
}


// Checking if arrays are equal

function arraysEq(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (var i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
};


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

for (globalCycle = 0; globalCycle < 1000000; globalCycle++) {
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

console.log('end');