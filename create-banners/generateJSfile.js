const fs = require('fs');

let content = "let characters = ";
(async function () {
    console.log(fs.realpathSync);
    let input = fs.readFileSync("./utilities/characters.json");
    content += input;
    content += ";";
    fs.writeFileSync("./create-banners/characters.js", content);
})();