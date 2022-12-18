const { SlashCommandBuilder } = require('discord.js');
const spreadsheet = require("../index.js");
const admins = process.env.ADMINS;
module.exports = {
    data: new SlashCommandBuilder()
        .setName('shutdown')
        .setDescription('[Admin Only] Stops the bot'),
    execute(msg, args) {
        if (admins.includes(msg.user.id)) {
            msg.editReply({ content: "SHUTTING DOWN" });
            setInterval(async () => {
                if (spreadsheet.canSave) {
                    await spreadsheet.save();
                    process.exit(0);
                }
            }, 1000);
        } else {
            msg.editReply({ content: "Not an ADMIN" });
        }
    }
};