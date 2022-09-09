const { EmbedBuilder } = require('discord.js');
module.exports = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle('World Trigger Bot')
    .setURL('https://discord.gg/WvbBzgS')
    .setAuthor({ name: 'Emperor Bob#7598', iconURL: 'https://cdn.discordapp.com/attachments/571784589882949692/944335696263520328/RowletPFP.png', url: 'https://emperorbob7.github.io/' })
    .setDescription('Commands')
    .setThumbnail('https://cdn.discordapp.com/attachments/571784589882949692/944335696263520328/RowletPFP.png')
    .addFields(
        {name: "b!help", value: "This Message"},
        {name: "b!roll", value: "Shows help for roll command."},
        {name: "b!selectStarter {Yuma, Chika, Jin, Osamu", value: "Select your starter gacha character."},
        {name: "b!register", value: "Register your account."}
    )
    .setTimestamp()