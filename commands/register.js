const getUser = require("./getUser.js").getById;
const { SlashCommandBuilder } = require('discord.js');
const spreadsheet = require("../index.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('Registers user in database'),
    async execute(msg, args) {
        if (getUser(msg.user.id) === null) {
            await spreadsheet.registerUser(msg.user.id);
            msg.editReply({ content: "Successfully registered " + msg.user.username });
        } else {
            msg.editReply({ content: "You can't register twice." });
        }
    }
};