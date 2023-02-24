const charByRarity = {
    "1": [],
    "2": [],
    "3": [],
    "4": [],
    "5": [],
    "6": []
};

window.onload = async function () {
    let id = 0;
    for (let character of characters) {
        character.id = id++;
    }

    const table = document.getElementById("list");
    let index = 0;
    for (let character of characters) {
        let tr = document.createElement("tr");

        let name = document.createElement("td");
        name.innerText = character.name;

        let imgTD = document.createElement("td");
        let img = document.createElement("img");
        imgTD.appendChild(img);
        img.src = character.source;

        let checkTD = document.createElement("td");
        let checkButton = document.createElement("button");
        checkButton.innerText = "✅";
        let i = index;
        checkButton.addEventListener("click", () => {
            addToList(i, tr);
        });
        checkTD.appendChild(checkButton);

        let removeTD = document.createElement("td");
        let removeButton = document.createElement("button");
        removeButton.innerText = "❌";
        removeButton.addEventListener("click", () => {
            removeFromList(i, tr);
        });
        removeTD.appendChild(removeButton);

        tr.appendChild(name);
        tr.appendChild(imgTD);
        tr.appendChild(checkTD);
        tr.appendChild(removeTD);
        tr.classList.add("no");

        table.appendChild(tr);
        index++;
    }
};

function addToList(index, tr) {
    let character = characters[index];
    if (!charByRarity[character.rarity].includes(character)) {
        charByRarity[character.rarity].push(character);
    }
    tr.classList.remove("no");
}

function removeFromList(index, tr) {
    let character = characters[index];
    if (charByRarity[character.rarity].includes(character)) {
        charByRarity[character.rarity].splice(charByRarity[character.rarity].indexOf(character), 1);
    }
    tr.classList.add("no");
}

function generateData() {
    let out = [];
    for (let rarity in charByRarity) {
        let data = charByRarity[rarity];
        for (let character of data) {
            if(character.id < 4) {
                continue;
            }
            let current = {
                "id": Number(character.id),
                "weight": Number(document.getElementById(`rate${character.rarity}`).value) / data.length
            };
            out.push(current);
        }
    }
    out.sort((x, y) => x.id - y.id);
    console.log(out);
}