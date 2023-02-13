const charByRarity = {
    "1": [],
    "2": [],
    "3": [],
    "4": [],
    "5": [],
    "6": []
};

window.onload = async function () {
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
    charByRarity[character.rarity].push(character);
    tr.classList.remove("no");
}

function removeFromList(index, tr) {
    let character = characters[index];
    if (charByRarity[character.rarity].includes(character)) {
        charByRarity[character.rarity].splice(charByRarity[character.rarity].indexOf(character));
    }
    tr.classList.add("no");
}