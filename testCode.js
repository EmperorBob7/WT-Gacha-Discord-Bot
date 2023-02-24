const Rolling = require("./utilities/rolling.js");
var now = require("performance-now")

const gacha = new Rolling();
let arr = [0, 0, 0, 0];
let loop = 1_000_000;
for (let i = 0; i < loop; i++) {
    let rollResult = gacha.roll("starter");
    if (arr[rollResult.pick.id] == undefined)
        arr[rollResult.pick.id] = 0;
    arr[rollResult.pick.id]++;
}

let arr2 = [];
for (let i = 4; i < arr.length; i++) {
    arr2[i] = [Number((arr[i] / loop * 100).toFixed(2)), gacha.getCharacter(i).rarity];
}
console.table(arr2);
console.log(arr2.reduce((x,y) => x+y));