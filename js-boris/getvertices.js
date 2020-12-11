let net = [
    [2, 6, 1, 5],
    [3, 0, 2, 11],
    [4, 8, 3, 7],
    [1, 10, 4, 9],
    [8, 10, 6, 0],
    [7, 11, 5, 9]
];

let vertices = [];

for (var i = 0; i < net.length; i++) {
    for (var j = 0; j < net[i].length; j++) {
        vertices = vertices.concat([
            [i, j]
        ]);
    }
}



for (var vertex = 0; vertex < vertices.length; vertex++) {
    let curLength = vertices[vertex].length;
    lastFace = vertices[vertex][curLength - 2];
    lastIndex = vertices[vertex][curLength - 1];
    lastEdge = net[lastFace][lastIndex];

    if (curLength == 2 || lastFace !== vertices[vertex][0] || lastIndex !== vertices[vertex][2]) {
        for (var face; face < net.length; face++) {
            for (var i = 0; i < net[face].length; i++) {
                if (face !== lastFace && net[face][i] == lastEdge) {
                    vertices[vertex] = vertices[vertex].concat([face, i + 1 % net[face].length]);
                }
            }
        }
    }
}

console.log(vertices);


let edges = [];

let maxedge = 0;

for (var i = 0; i < net.length; i++) {
    for (var j = 0; j < net[i].length; j++) {
        if (net[i][j] > maxedge) {
            maxedge = net[i][j];
        }
    }
}

maxedge = maxedge + 1;

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

console.log(edges);