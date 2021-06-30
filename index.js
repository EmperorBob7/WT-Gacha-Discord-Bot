"use strict";
const fs = require('fs');
const result = require('dotenv').config().parsed;
const Discord = require('discord.js');
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const prefix = "b!";

const Rolling = require("./rolling.js");
const gacha = new Rolling();
const database = require("better-sqlite3")("Storage.db");

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        client.commands.set(command.name, command);
    }
});

client.on('message', async msg => {
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;
    const args = msg.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (!client.commands.has(command)) return;

    try {
        client.commands.get(command).execute(msg, args);
    } catch (error) {
        console.error(error);
        message.reply('That is an invalid command, use b!help if you wish to see a list of commands.');
    }
});

client.on('interaction', async interaction => {
    if (!interaction.isButton()) return;
    let x = interaction.customID.split(" ");
    let banner = x[0];
    if (x[1] === "gacha1") {
        roll(interaction, banner);
    } else {
        interaction.reply({ content: "Sorry x10 isn't available currently." });
    }
});
/**
 * 
 * @param {Discord.Message} msg 
 */
function roll(msg, banner) {
    let id = msg.member.user.id;
    if (getUser(id) === undefined) {
        msg.reply({ content: "You need to register before doing this command, do b!register" });
        return;
    }
    let currency = getCurrency(id);
    if (currency < 500) {
        msg.reply({ content: "I'm sorry, you do not have enough currency to do a 1x roll, try again later.\nYour remaining balance is: " + currency });
        return;
    } else {
        removeCurrency(id, currency, 500);
    }
    let rollResult = gacha.roll(banner);
    rollResult = gacha.getCharacter(rollResult.pick.id);
    msg.reply({
        embeds: [new Discord.MessageEmbed()
            .setDescription(msg.member.user.tag + " You Pulled: " + rollResult.name)
            .setImage(rollResult.source)]
    });
}

function removeCurrency(id, currency, amount) {
    database.prepare(`UPDATE CharacterList SET currency = ? WHERE userID = ?`).run(currency - amount, id);
}

client.login(result.TOKEN);