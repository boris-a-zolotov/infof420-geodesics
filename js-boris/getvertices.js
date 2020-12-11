

for (var i = 0; i < net.length; i++) {
    for (var j = 0; j < net[i].length; j++) {
        vertices = vertices.concat([
            [i, j]
        ]);
    }
}



function thereIsDifferent(f, e) {
    for (var face = 0; face < net.length; face++) {
        for (var i = 0; i < net[face].length; i++) {
            if (face !== f && net[face][i] == e) {
                return [face, (i + 1) % net[face].length];
            }
        }
    }
    return false;
}


for (var vertex = 0; vertex < vertices.length; vertex++) {
    stopCondition = thereIsDifferent(vertices[vertex][0],
        net[vertices[vertex][0]][vertices[vertex][1]]);


    if (stopCondition !== false) {
        sca = stopCondition[0];
        scb = stopCondition[1];
    }

    while ((sca !== vertices[vertex][0] || scb !== vertices[vertex][1]) && stopCondition !== false) {
        vertices[vertex] = vertices[vertex].concat([sca, scb]);
        cl = vertices[vertex].length;

        lastFace = vertices[vertex][cl - 2];
        lastEdge = net[lastFace][vertices[vertex][cl - 1]]


        stopCondition = thereIsDifferent(lastFace, lastEdge);

        if (stopCondition !== false) {
            sca = stopCondition[0];
            scb = stopCondition[1];
        }
    }

}

console.log(vertices);




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

// console.log(edges);