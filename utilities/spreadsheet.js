const { GoogleSpreadsheet } = require("google-spreadsheet");
const creds = JSON.parse(process.env.CREDENTIALS);
const characters = require("./characters.json");
const doc = new GoogleSpreadsheet("18xP6Is3Wsb-cyfxnmJ4uk7GZa8qSBD0z8hAbDE-jKAE");

module.exports = class SpreadsheetManager {
    constructor() {
        this.setUpSheet();
        this.changed = new Set();
        this.canSave = true;
        setInterval(this.save.bind(this), 30_000); // Avoid API Explosion
    }

    async setUpSheet() {
        await doc.useServiceAccountAuth(creds);
        await doc.loadInfo();
        this.sheet = doc.sheetsByIndex[0];
        this.rows = {};
        this.updateLocalRow();
    }

    async updateLocalRow() {
        return new Promise(async (res, rej) => {
            let rows = await this.sheet.getRows();
            for (let i = 0; i < rows.length; i++) {
                if (this.rows[rows[i].userID] == null)
                    this.rows[rows[i].userID] = rows[i];
            }
            res();
        });
    }

    getDate(userID) {
        if (this.rows[userID])
            return this.rows[userID].date;
        return null;
    }

    setDate(userID) {
        if (this.rows[userID]) {
            this.changed.add(userID);
            this.rows[userID].date = new Date().toUTCString();
        }
    }

    getCharacters(userID) {
        if (this.rows[userID])
            return JSON.parse(this.rows[userID].characters);
        return null;
    }

    addCharacter(userID, characterID) {
        this.canSave = false;

        if (this.rows[userID]) {
            this.changed.add(userID);

            let set = new Set(JSON.parse(this.rows[userID].characters));
            set.add(Number(characterID));
            this.rows[userID].characters = JSON.stringify([...set]);
        }
    }

    getStarter(userID) {
        if (this.rows[userID]) {
            return Number(this.rows[userID].starter);
        }
        return null;
    }

    setStarter(userID, starter) {
        if (this.rows[userID]) {
            this.changed.add(userID);
            this.rows[userID].starter = starter;
        }
    }

    getCurrency(userID) {
        if (this.rows[userID])
            return Number(this.rows[userID].currency);
        return null;
    }

    setCurrency(userID, amount) {
        if (this.rows[userID]) {
            this.changed.add(userID);
            this.rows[userID].currency = amount;
        }
    }

    getUserInfo(userID) {
        let row = this.rows[userID];
        if (row == null) {
            return null;
        } else {
            return `You have ${row.currency} bobux`;
        }
    }

    async registerUser(userID) {
        return new Promise(async (res, rej) => {
            this.canSave = false;

            let newRow = {
                "userID": userID,
                "characters": "[]",
                "starter": -1,
                "currency": 10000,
                "date": new Date(new Date() - 86400000).toUTCString()
            };
            await this.sheet.addRow(newRow);
            await this.updateLocalRow();

            this.changed.add(userID);
            this.canSave = true;
            res();
        });
    }

    async save() {
        //console.log("SAVING", this.canSave);
        if (this.canSave) {
            //console.log(this.changed);

            let arr = [...this.changed];
            for(let i = 0; i < arr.length && i < 30; i++) {
                let id = arr[i];
                await this.rows[id].save();
            }
            if(arr.length > 30) {
                arr = arr.slice(30); // API LIMIT
            } else {
                arr = [];
            }
            this.changed = new Set(arr);
        }
    }

    getUserCharacterList(userID, rarity) {
        let row = this.rows[userID];
        if (row == null) {
            return null;
        }
        let output = [];
        const chars = this.getCharacters(userID);
        for (const charID of chars) {
            if (characters[charID].rarity == rarity) {
                output.push(this.characterToString(charID));
            }
        }
        output.sort();
        return output.join("\n");
    }

    characterToString(characterID) {
        const char = characters[characterID];
        return `${char.rarity}★ ${char.name} - ${char.series} - ${characterID}`;
    }
};