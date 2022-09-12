const { SlashCommandBuilder } = require('discord.js');
const spreadsheet = require("../index.js");
const admins = ["259841719141531649", "549336604590735367"];
module.exports = {
    data: new SlashCommandBuilder()
        .setName('givecurrency')
        .setDescription('[Admin Only] Gives a user Currency')
        .addIntegerOption(option =>
            option.setName("amount")
                .setDescription("The amount of currency you want.")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("id")
                .setDescription("ID of user you wish to give currency to.")
                .setRequired(true)
        ),
    execute(msg, args) {
        if (admins.includes(msg.user.id)) {
            let ID = msg.options.getString("id");
            let AMOUNT = msg.options.getInteger("amount");
            if (spreadsheet.getUserInfo(ID) === null) {
                msg.editReply({ content: "Not a valid User ID" });
            } else {
                spreadsheet.setCurrency(ID, spreadsheet.getCurrency(ID) + AMOUNT);
                msg.editReply({ content: "Balance successfully updated." });
            }
        }
    }
};