const spreadsheet = require("../index.js");
const getUser = require("./getUser.js").getById;
const { SlashCommandBuilder } = require('discord.js');
const Rolling = require("../utilities/rolling.js");
const gacha = new Rolling();
const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('selectstarter')
        .setDescription('Lets the player select a starter')
        .addStringOption(option =>
            option.setName('starter')
                .setDescription('The starter you select.')
                .setRequired(true)
                .addChoices(
                    { name: "Osamu", value: "osamu" },
                    { name: "Yuma", value: "yuma" },
                    { name: "Chika", value: "chika" },
                    { name: "Jin", value: "jin" }
                )),
    execute(msg, args) {
        let data = getUser(msg.user.id);
        if (data === undefined) {
            msg.editReply({ content: "You are not registered yet. Use b!register to register." });
            return;
        }
        let characters = spreadsheet.getCharacters(msg.user.id);
        if (spreadsheet.getStarter(msg.user.id) === -1) {
            let c;
            let id = 0;
            switch (msg.options.getString('starter')) {
                case "osamu":
                    characters.push(0);
                    c = gacha.getCharacter(0);
                    break;
                case "yuma":
                    id = 1;
                    characters.push(1);
                    c = gacha.getCharacter(1);
                    break;
                case "chika":
                    id = 2;
                    characters.push(2);
                    c = gacha.getCharacter(2);
                    break;
                case "jin":
                    id = 3;
                    characters.push(3);
                    c = gacha.getCharacter(3);
                    break;
                default:
                    msg.channel.send({ content: "Sorry, that is not a valid starter, check help for proper syntax or do b!selectstarter {osamu, yuma, chika, jin}" });
                    return;
            }
            spreadsheet.addCharacter(msg.user.id, id);
            spreadsheet.setStarter(msg.user.id, id);
            msg.editReply({
                embeds: [new EmbedBuilder()
                    .setDescription("Congratulations, you have started your journey. Your starter is: ")
                    .setImage(c.source)]
            });
        } else {
            msg.editReply({ content: "You have already picked a starter, use b!reset to reset everything if you truly wish to reset." })
        }
    }
};