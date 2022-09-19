const getUser = require("./getUser.js").getById;
const spreadsheet = require("../index.js");
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('currency')
		.setDescription('Get amount of currency you have in the Database.'),
	execute(msg, args) {
		if (getUser(msg.user.id) === null) {
			msg.editReply({ content: "You need to register before doing this command, do b!register" });
			return;
		}
		msg.editReply(spreadsheet.getUserInfo(msg.user.id));
	}
};