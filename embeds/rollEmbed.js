const { EmbedBuilder } = require('discord.js');
module.exports = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle('World Trigger Bot')
    .setURL('https://discord.gg/WvbBzgS')
    .setAuthor({ name: 'Emperor Bob#7598', iconURL: 'https://cdn.discordapp.com/attachments/571784589882949692/944335696263520328/RowletPFP.png', url: 'https://emperorbob7.github.io/' })
    .setDescription('Rolling')
    .setThumbnail('https://cdn.discordapp.com/attachments/571784589882949692/944335696263520328/RowletPFP.png')
    .addFields(
        {name: "b!roll starter", value: 'Does a multi roll from the starting dash banner.'},
        {name: "b!roll gold-chibi", value: "Does a multi roll from the gold chibi series."}
    )
    .setTimestamp()