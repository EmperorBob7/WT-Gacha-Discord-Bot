const { SlashCommandBuilder } = require('discord.js');
const spreadsheet = require("../index.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('Redeems your daily credit reward.'),
    execute(msg, args) {
        let data = spreadsheet.getDate(msg.user.id);
        if (data === null) {
            msg.editReply({ content: "You must Register before getting your Daily, do b!register" });
        } else {
            let date = new Date(data);
            let x = (new Date() - date) / 86400000;
            if (x < 1) {
                msg.editReply({ content: "You must wait until: " + new Date(date.setDate(date.getDate() + 1)).toUTCString() + " before getting your daily." });
            } else {
                spreadsheet.setCurrency(msg.user.id, spreadsheet.getCurrency(msg.user.id) + 1000);
                spreadsheet.setDate(msg.user.id);
                msg.editReply({ content: "Your balance has been updated!" });
            }
        }
    }
};