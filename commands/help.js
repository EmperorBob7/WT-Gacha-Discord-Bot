const helpEmbed = require("../embeds/helpEmbed.js");
module.exports = {
	name: 'help',
	description: 'Brings up a list of commands',
	execute(msg, args) {
        console.log(args);
		msg.channel.send({embeds: [helpEmbed]});
	}
};