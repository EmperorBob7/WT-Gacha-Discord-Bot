const { GoogleSpreadsheet } = require("google-spreadsheet");
const creds = JSON.parse(process.env.CREDENTIALS);

const doc = new GoogleSpreadsheet("18xP6Is3Wsb-cyfxnmJ4uk7GZa8qSBD0z8hAbDE-jKAE");

module.exports = class SpreadsheetManager {
    constructor() {
        this.setUpSheet();
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
            this.rows[userID].date = new Date().toUTCString();
            this.rows[userID].save();
        }
    }

    getCharacters(userID) {
        if (this.rows[userID])
            return JSON.parse(this.rows[userID].characters);
        return null;
    }

    addCharacter(userID, characterID) {
        if (this.rows[userID]) {
            let set = new Set(JSON.parse(this.rows[userID].characters));
            set.add(Number(characterID));
            this.rows[userID].characters = JSON.stringify([...set]);
            this.rows[userID].save();
        }
    }

    getStarter(userID) {
        if (this.rows[userID])
            return Number(this.rows[userID].starter);
        return null;
    }

    setStarter(userID, starter) {
        if (this.rows[userID]) {
            this.rows[userID].starter = starter;
            this.rows[userID].save();
        }
    }

    getCurrency(userID) {
        if (this.rows[userID])
            return this.rows[userID].currency;
        return null;
    }

    setCurrency(userID, amount) {
        if (this.rows[userID]) {
            this.rows[userID].currency = amount;
            this.rows[userID].save();
        }
    }

    getUserInfo(userID) {
        let row = this.rows[userID];
        console.log(row);
        if (row == null) {
            return null;
        } else {
            return `You have ${row.currency} bobux`;
        }
    }

    async registerUser(userID) {
        return new Promise(async (res, rej) => {
            let newRow = {
                "userID": userID,
                "characters": "[]",
                "starter": -1,
                "currency": 10000,
                "date": new Date().toUTCString()
            };
            await this.sheet.addRow(newRow);
            await this.sheet.saveUpdatedCells();
            await this.updateLocalRow();
            res();
        });
    }
};