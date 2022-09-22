const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('game')
		.setDescription('TBD'),
	execute(msg, args) {
		msg.editReply({ content: "Does not exist yet" });
	}
};