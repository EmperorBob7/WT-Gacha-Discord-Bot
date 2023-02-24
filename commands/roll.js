const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const getUser = require("./getUser.js").getById;
const Rolling = require("../utilities/rolling.js");
const gacha = new Rolling();
const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Sends a Rolling Banner Embed')
        .addStringOption(option =>
            option.setName('banner')
            .setDescription('The banner you wish to roll')
            .setRequired(true)
            .addChoices(
                {name: "startDash", value: "starter"},
                {name: "rigged", value: "rigged"}
            )),
    execute(msg, args) {
        if (getUser(msg.user.id) === undefined) {
            msg.editReply({ content: "You need to register before doing this command, do b!register" });
            return;
        }
        const banner = msg.options.getString("banner");
        let bannerImg = gacha.getBanner(banner);
        if (bannerImg === null) {
            msg.editReply({ content: "Not a valid Banner" });
            return;
        }
        const embed = new EmbedBuilder()
            .setTitle("Roll or Die")
            .setImage(bannerImg);
        const one = new ButtonBuilder()
            .setLabel("Summon x1")
            .setStyle(ButtonStyle.Success)
            .setCustomId(banner + " gacha1");
        const ten = new ButtonBuilder()
            .setLabel("Summon x10")
            .setStyle(ButtonStyle.Success)
            .setCustomId(banner + " gacha10");
        const row = new ActionRowBuilder()
            .addComponents(one, ten);
        msg.editReply({
            content: "Press Below to Summon",
            embeds: [embed],
            components: [row]
        });
    }
};