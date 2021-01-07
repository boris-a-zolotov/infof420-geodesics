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
