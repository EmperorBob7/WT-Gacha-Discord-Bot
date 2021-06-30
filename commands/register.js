const database = require("better-sqlite3")("Storage.db");
const getUser = require("./getUser.js");
module.exports = {
	name: 'register',
	description: 'Registers user in database',
	execute(msg, args) {
		if (getUser(msg.author.id) === undefined) {
            database.prepare(`INSERT INTO CharacterList VALUES (?, ?, ?, ?)`).run(msg.author.id, "[]", 0, 5000);
            msg.channel.send({ content: "Successfully registered " + msg.author.username });
        } else {
            msg.channel.send({ content: "You can't register twice." });
        }
	}
};