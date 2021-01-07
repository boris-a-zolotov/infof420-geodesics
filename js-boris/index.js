// NET OF A CUBE:
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

const field = 3;

let globalArray = [3, 1, 2, 3, 0, 2, 1, 0,
    3, 1, 2, 3, 0, 2, 1, 0,
    3, 1, 2, 3, 0, 2, 1, 0,
    3, 1, 2, 3, 0, 2, 1, 0,
    3, 1, 2, 3, 0, 2, 1, 0,
    3, 1, 2, 3, 0, 2, 1, 0
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

// removing duplicates from a multidimensional array

function multiDimensionalUnique(arr) {
    var uniques = [];
    var itemsFound = {};
    for (var i = 0, l = arr.length; i < l; i++) {
        var stringified = JSON.stringify(arr[i]);
        if (itemsFound[stringified]) {
            continue;
        }
        uniques.push(arr[i]);
        itemsFound[stringified] = true;
    }
    return uniques;
}

// for each vertex make the face with
// the smallest index the first face to appear

function rotateMin(arr) {
    let locLen = arr.length;
    let locMin = 1000;
    let minPos = 1000;
    let resArr = [];

    for (var i = 0; i < locLen; i += 2) {
        // we assume we deal with planar faces,
        // which means two vertices of one face
        // can't glue to each other
        if (arr[i] < locMin) {
            locMin = arr[i];
            minPos = i;
        }
    }

    for (var i = 0; i < locLen; i++) {
        resArr = resArr.concat(arr[(i + minPos) % locLen]);
    }

    return resArr;
};


// PRINTING

function printPair([a, b]) {
    return `(${a},${b})`;
}

// print a single face in a single tikz

function printFace(nom, arr) {
    let locRes = `  \\tikz[scale=0.56]{\n`;
    locRes += `    \\fill[white] (-0.4,-0.4) rectangle (${field}+0.4,${field}+0.4);\n`
    locRes += `    \\foreach \\i in {0,...,${field}} {\\draw[gray,opacity=0.6]`
    locRes += ` (0,\\i) -- (${field},\\i) (\\i,0) -- (\\i,${field});}\n`
    locRes += `    \\draw[thick] `;
    locRes += printPair(arr[0]);
    for (var i = 1; i < arr.length; i++) {
        locRes += ` -- `;
        locRes += printPair(arr[i]);
        locRes += ` \\midnode{${net[nom][i-1]}}`;
    }

    locRes += ` -- cycle \\midnode{${net[nom][arr.length-1]}};} \\qquad\n`
    return locRes;
}

// print all the faces in a figure

function printFaces(nom, arr) {
    let globRes = `\\begin{figure} \\centering\n`;

    for (var i = 0; i < arr.length; i++) {
        globRes += printFace(i, arr[i]);
    }

    globRes += `\\caption{Net ${nom}} \\end{figure}\n\n\n`;
    return globRes;
}


// PREPARING VERTICES TO CHECK EACH OF THEM IS CONVEX

// MAIN RULE:
// i-th edge is between vertices i and i+1
// i-th vertex is between edges i-1 and i

// initializing each vertex with one face 
// that it is definitely incident to
// this will result in every vertex
// being listed multiple times

for (var i = 0; i < net.length; i++) {
    for (var j = 0; j < net[i].length; j++) {
        vertices = vertices.concat([
            [i, j]
        ]);
    }
}

// f is face where the edge is originally found
// e is the edge itself

function thereIsDifferent(f, e) {
    for (var face = 0; face < net.length; face++) {
        for (var i = 0; i < net[face].length; i++) {

            if (face !== f && net[face][i] == e) {
                // looking for the same edge in a different face

                return [face, (i + 1) % net[face].length];
                // shifting index now not to shift it
                // when we start from this vertex later
            }
        }
    }
    return false; // if it's only found in the same face
    // there's no point to continue
}


// FOR EACH VERTEX GETTING THE LIST OF INCIDENT EDGES

for (var vertex = 0; vertex < vertices.length; vertex++) {
    stopCondition = thereIsDifferent(vertices[vertex][0], // we know the edge is in the initial face
        net[vertices[vertex][0]][vertices[vertex][1]]); // we get edge class knowing our place in face

    if (stopCondition !== false) { // our vertex found in another face
        sca = stopCondition[0]; // number of that face
        scb = stopCondition[1]; // position in that face
    }

    while ((sca !== vertices[vertex][0] || scb !== vertices[vertex][1]) &&
        // we're hitting different faces or different places
        stopCondition !== false) {
        // really hitting them, not reusing old data

        vertices[vertex] = vertices[vertex].concat([sca, scb]);
        // append new instance of the vertex

        cl = vertices[vertex].length; // current degree * 2

        lastFace = vertices[vertex][cl - 2]; // the face we're in now
        lastEdge = net[lastFace][vertices[vertex][cl - 1]]
        // (!) get edge class knowing place in face

        stopCondition = thereIsDifferent(lastFace, lastEdge);

        if (stopCondition !== false) {
            sca = stopCondition[0];
            scb = stopCondition[1];
        }
    }
}


// GENERATING THE LIST OF EDGES TO CHECK THEIR GLUING

// determine the number of classes of edges

for (var i = 0; i < net.length; i++) {
    for (var j = 0; j < net[i].length; j++) {
        if (net[i][j] > maxedge) {
            maxedge = net[i][j];
        }
    }
}

maxedge = maxedge + 1; // to use in «for» cycles

// determine every face and every position that edge is in

for (var edge = 0; edge < maxedge; edge++) {
    edges[edge] = [];
    for (var face = 0; face < net.length; face++) {
        for (var i = 0; i < net[face].length; i++) {
            if (net[face][i] == edge) {
                edges[edge] = edges[edge].concat([face, i]);
            }
        }
    }
}


// PICKING I-TH edge

// return direction of i-th edge of the face
// % l because face is cyclic

function ithEdge(face, i) {
    let l = face.length;
    return [face[(i + 1) % l][0] - face[i][0], face[(i + 1) % l][1] - face[i][1]];
}

// return angle at i-th vertex

function ithAngle(face, i) {
    let [x1, y1] = ithEdge(face, (i - 1 + face.length) % face.length);
    let [x2, y2] = ithEdge(face, i);
    return angle([-1 * x1, -1 * y1], [x2, y2]);
}

function ithOuterAngle(face, i) {
    let [x1, y1] = ithEdge(face, (i - 1 + face.length) % face.length);
    let [x2, y2] = ithEdge(face, i);
    return angle([x1, y1], [x2, y2]);
}


// CHECKING IF TWO SEGMENTS ARE GLUABLE

// check that directions of edges differ by 90*k degrees

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

// with each edge we're given
// no. of face; position; no. of face; position
// we use it to extract directions and check fitment

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


// removing duplicates from the list of vertices

for (var i = 0; i < vertices.length; i++) {
    vertices[i] = rotateMin(vertices[i]);
}

vertices = multiDimensionalUnique(vertices);


// CHECKING THAT EACH FACE IS A CONVEX POLYGON

function isRight([x1, y1], [x2, y2]) {
    return (x1 * y2 - x2 * y1) > 0;
}

function checkAllTurnsRight() { // IMPORTANT: ONE OF THE CHECKS
    for (var fc = 0; fc < faces.length; fc++) {
        let l = faces[fc].length;
        let sumOuterAngles = 0;
        for (var eg = 0; eg < l; eg++) {
            if (!isRight(ithEdge(faces[fc], eg), ithEdge(faces[fc], (eg + 1) % l))) {
                return false;
            }
            sumOuterAngles += ithOuterAngle(faces[fc], eg);
        }
        if (sumOuterAngles > 6.29) {
            return false;
        }
    }
    return true;
}


// CHECKING THAT EACH FACE HAS AT LEAST TWO VERTICES ON THE BORDER
// we do not want to have too much freedom

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


function checkAllVerticesConvex() { // IMPORTANT: ONE OF THE CHECKS
    for (var vertex = 0; vertex < vertices.length; vertex++) {
        let anglesum = 0;
        for (var i = 0; i < vertices[vertex].length; i += 2) {
            anglesum += ithAngle(faces[vertices[vertex][i]], vertices[vertex][i + 1])
        }
        if (anglesum > 6.28319) {
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

for (globalCycle = 0; globalCycle < 400000000; globalCycle++) {
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
    p = p && checkAllVerticesConvex();
    if (p) {
        console.log(printFaces(globalCycle, faces));
    }
    arIncrement();
}

console.log('end');