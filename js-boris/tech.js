let net = [
    [3, 4, 0],
    [0, 1, 2],
    [1, 5, 8],
    [4, 6, 5],
    [6, 3, 7],
    [8, 7, 2]
];

const field = 4;

function arraysEq(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (var i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
};

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

function isLonely(x, arr) {
    let locSum = 0;

    for (var i = 0; i < arr.length; i++) {
        if (arraysEq(x, arr[i])) locSum++;
    }

    if (locSum > 1) return false;
    return true;
}


let faces = [
    [
        [0, 0],
        [2, 0],
        [2, 2]
    ],
    [
        [0, 0],
        [2, 2],
        [0, 2]
    ],
    [
        [0, 0],
        [2, 0],
        [1, 1]
    ],
    [
        [1, 0],
        [1, 2],
        [0, 1]
    ],
    [
        [1, 0],
        [2, 1],
        [0, 1]
    ],
    [
        [0, 0],
        [1, 1],
        [0, 2]
    ]
];

function printPair([a, b]) {
    return `(${a},${b})`;
}

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

function printFaces(nom,arr) {
    let globRes = `\\begin{figure} \\centering\n`;

    for (var i = 0; i < arr.length; i++) {
        globRes += printFace(i, arr[i]);
    }

    globRes += `\\caption{Net ${nom}} \\end{figure}`;
    return globRes;
}

console.log(printFaces(1000,faces));