const helpEmbed = require("../embeds/helpEmbed.js");
const getUser = require("./getUser.js");
module.exports = {
	name: 'currency',
	description: 'Get amount of currency in database',
	execute(msg, args) {
        if (getUser(msg.author.id) === undefined) {
            msg.channel.send({ content: "You need to register before doing this command, do b!register" });
            return;
        }
		msg.channel.send("Your balance is currently: " + database.prepare(`SELECT * FROM CharacterList WHERE userID = ?`).get(id).currency);
	}
};