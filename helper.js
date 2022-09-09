let dash = require("./banners/StartDash.json");
let arr = [];
let val = 1;
for(let i in dash) {
    arr.push({
        "id": ('0000' + val++).slice(-4),
        "weight": dash[i].weight
    });
}
console.log(JSON.stringify(arr));