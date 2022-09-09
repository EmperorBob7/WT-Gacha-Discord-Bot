const { SlashCommandBuilder } = require('discord.js');
const spreadsheet = require("../index.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("getuser")
    .setDescription("Gets player information."),
  async execute(interaction) {
    let s = spreadsheet.getUserInfo(interaction.user.id);
    if(s)
      await interaction.editReply(s);
    else
      await interaction.editReply("Not registered.");
  },
  getById(ID) {
    return spreadsheet.getUserInfo(ID);
  }
}