const result = require('dotenv').config().parsed;
const Discord = require('discord.js');
const client = new Discord.Client();
const disbut = require('discord-buttons')(client);
const { MessageButton } = require("discord-buttons");
const parse = require("discord-command-parser").parse;

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity('Use b!help', { type: 'Using' });
});

client.on('message', async msg => {
    //const parsed = parse(msg, "b!", { allowBots: false, allowSpaceBeforeCommand: true, ignorePrefixCase: true });
    if (msg.author.bot)
        return;
    let n = msg.member.displayName.split(" ");
    msg.channel.send("Based " + n[0]);
});

client.on('clickButton', async(button) => {
    if (button.id === "gacha") {
        button.channel.send("You pulled your tendons");
        button.defer();
    }
});

async function send(chId, msg) {
    const channel = await client.channels.fetch(chId);
    await channel.send(msg);
}
client.login(result.TOKEN);