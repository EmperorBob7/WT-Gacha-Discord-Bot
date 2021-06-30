const Discord = require('discord.js');
const { MessageActionRow, MessageButton } = require('discord.js');
const getUser = require("./getUser.js");
const Rolling = require("../rolling.js");
const gacha = new Rolling();

module.exports = {
    name: 'roll',
    description: 'Sends a Rolling Banner Embed',
    execute(msg, args) {
        if (getUser(msg.author.id) === undefined) {
            msg.channel.send({ content: "You need to register before doing this command, do b!register" });
            return;
        }
        msg.content = msg.content.substring(6).trim().toLowerCase();
        let bannerImg = gacha.getBanner(msg.content);
        if (bannerImg === null) {
            msg.channel.send({ content: "Not a valid Banner" });
            return;
        }
        const embed = new Discord.MessageEmbed()
            .setTitle("Roll or Die")
            .setImage(bannerImg);
        const one = new MessageButton()
            .setLabel("Summon x1")
            .setStyle("SUCCESS")
            .setCustomID(msg.content + " gacha1");
        const ten = new MessageButton()
            .setLabel("Summon x10")
            .setStyle("SUCCESS")
            .setCustomID(msg.content + " gacha10");
        const row = new MessageActionRow()
            .addComponents(one, ten);
        msg.channel.send({
            content: "Press Below to Summon",
            embeds: [embed],
            components: [row]
        });
    }
};