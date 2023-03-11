const Rolling = require("./utilities/rolling.js");
var now = require("performance-now")

const gacha = new Rolling();
let arr = [0, 0, 0, 0];
let loop = 5_000_000;
for (let i = 0; i < loop; i++) {
    let rollResult = gacha.roll("starter");
    if (arr[rollResult.pick.id] == undefined)
        arr[rollResult.pick.id] = 0;
    arr[rollResult.pick.id]++;
}

let arr2 = [];
let arr3 = [0, 0, 0, 0, 0, 0, 0];
for (let i = 4; i < arr.length; i++) {
    arr2[i] = [Number((arr[i] / loop * 100).toFixed(2)), gacha.getCharacter(i).rarity];
    arr3[gacha.getCharacter(i).rarity] += Number((arr[i] / loop * 100).toFixed(2));
}
console.table(arr2);
console.table(arr3);

let sum = 0;
for(let i of arr3) {
    sum += i;
}
console.log(sum);