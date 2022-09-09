const helpEmbed = require("../embeds/helpEmbed.js");
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
	.setName('help')
	.setDescription('Brings up a list of commands'),
	execute(msg, args) {
        console.log(args);
		msg.editReply({embeds: [helpEmbed]});
	}
};