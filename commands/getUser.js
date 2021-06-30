const database = require("better-sqlite3")("Storage.db");
module.exports = function(ID) {
    return database.prepare(`SELECT * FROM CharacterList WHERE userID = ?`).get(ID);
}