const Rolling = require("./rolling.js");
var now = require("performance-now")

const gacha = new Rolling();
let start = now();
let arr = [0];
let loop = 100000;
for (let i = 0; i < loop; i++) {
    let rollResult = gacha.roll("starter");
    if (arr[rollResult.pick.id] === undefined)
        arr[rollResult.pick.id] = 0;
    arr[rollResult.pick.id]++;
}
console.log(now() - start);
console.log(arr);
let arr2 = [];
for (let i = 0; i < arr.length; i++) {
    arr2[i] = arr[i] / loop;
}
console.log(arr2);