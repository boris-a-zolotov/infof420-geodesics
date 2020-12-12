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