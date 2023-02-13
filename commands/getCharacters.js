const getUser = require("./getUser.js").getById;
const spreadsheet = require("../index.js");
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('getcharacters')
        .setDescription('Get the characters you have.')
        .addIntegerOption(option =>
            option.setName("rarity")
                .setRequired(true)
                .setDescription("From 1-6")
        ),
    execute(msg, args) {
        if (getUser(msg.user.id) === undefined) {
            msg.editReply({ content: "You need to register before doing this command, do b!register" });
            return;
        }
        let r = msg.options.getInteger("rarity");
        msg.editReply(`Your characters of ${r}★ rarity are:\n${spreadsheet.getUserCharacterList(msg.user.id, r)}`);
    }
};