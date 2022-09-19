const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Rolling = require("../utilities/rolling.js");
const gacha = new Rolling();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('getcharacter')
        .setDescription('Get the character by ID.')
        .addIntegerOption(option =>
            option.setName("id")
                .setRequired(true)
                .setDescription("Character ID, from 0 to 39 currently")
        ),
    execute(msg, args) {
        let id = msg.options.getInteger("id");
        let rollResult = gacha.getCharacter(id);
        if (rollResult) {
            msg.channel.send({
                embeds: [new EmbedBuilder()
                    .setDescription(`${msg.user.username}#${msg.user.discriminator} the character you requested: ${rollResult.name}`)
                    .setImage(rollResult.source)]
            });
            msg.editReply("Completed Request.");
        } else {
            msg.editReply("This ID is not valid. Try 0 to 39");
        }
    }
};