// Initial declaration of faces

let face0 = [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, 1]
];

let face1 = face0;
let face2 = face0;
let face3 = face0;
let face4 = face0;
let face5 = face0;

let faces = [face0, face1, face2, face3, face4, face5]

// face, edge, face, edge
// need to generate
let edges = [
    [0, 0, 1, 2],
    [1, 0, 2, 2],
    [2, 0, 3, 2],
    [3, 0, 0, 2],

    [4, 3, 1, 1],
    [1, 3, 5, 1],
    [5, 3, 3, 3],
    [4, 1, 3, 1],

    [0, 3, 5, 2],
    [0, 1, 4, 2],
    [4, 0, 2, 1],
    [5, 0, 2, 3]
]

// Return i-th edge of the face

function ithEdge(face, i) {
    let l = face.length
    if (i == l - 1) {
        return [face[0][0] - face[i][0], face[0][1] - face[i][1]];
    } else {
        return [face[i + 1][0] - face[i][0], face[i + 1][1] - face[i][1]];
    }
}

function piRotate([x, y]) {
    return [-1 * y, x];
}

function sameSegment(s1, s2) {
    return (s1 == s2 ||
        s1 == piRotate(s2) ||
        s1 == piRotate(piRotate(s2)) ||
        s1 == piRotate(piRotate(piRotate(s2))));
}

console.log(sameSegment([1, 1], [1,1]));

function edgesFit(edge) {
    let copy1 = ithEdge(face[edge[0]], egde[1]);
    let copy2 = ithEdge(face[edge[2]], edge[3]);
    return copy1 === copy2 || copy1 === piRotate(copy2) || copy1 === piRotate(piRotate(copy2))
}


// console.log(ithEdge(faces[0], 0));

function totheright(xdir1, ydir1, xdir2, ydir2) {
    return 5 < 2
}



function angle(xdir1, ydir1, xdir2, ydir2) {
    return xdir2 - xdir1;
}