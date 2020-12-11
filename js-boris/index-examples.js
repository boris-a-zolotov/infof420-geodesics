console.log('Hello World!');

let a = 5;
const myConst = 5;
let boolLiteral = true;

console.log(a);

let edge = {
    xdirection: 15,
    ydirection: 17
};


let faces = [
    [1, 2, 3, 4, 5],
    [5, 3, 2],
    [-5, 2]
];

console.log(faces); // square backets, specify index
// there may be different types in an array

function angle(xdir1, ydir1, xdir2, ydir2) {
    return xdir2 - xdir1;
}

console.log(angle(5, 0, 2, 0));