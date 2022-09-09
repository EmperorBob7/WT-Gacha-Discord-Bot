const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('game')
		.setDescription('TBD'),
	execute(msg, args) {
	}
};