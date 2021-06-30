"use strict";
const result = require('dotenv').config().parsed;
const Discord = require('discord.js');
const { Client, Intents, MessageActionRow, MessageButton} = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const helpEmbed = require("./helpEmbed.js");
const gameStartEmbed = require("./gameStartEmbed.js");
const rollEmbed = require("./rollEmbed.js");
const Participant = require("./Participant.js");
const Rolling = require("./rolling.js");
const gacha = new Rolling();
const database = require("better-sqlite3")("Storage.db");
const parse = require("discord-command-parser").parse;

let gameRunning = false;
let participants = {};

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async msg => {
    const parsed = parse(msg, "b!", { allowBots: false, allowSpaceBeforeCommand: true, ignorePrefixCase: true });
    if (!parsed.success)
        return;
    if (parsed.command === "help") { //Get Commands Lol
        msg.channel.send({embeds: [helpEmbed]});
    } else if (parsed.command === "game") { //Start the Game
        runGame(msg);
    } else if (parsed.command === "roll" && parsed.body.length == 0) { //Incomplete Roll
        msg.channel.send({embeds: [rollEmbed]});
    } else if (parsed.command.startsWith("roll")) { //Roll Method
        summonBanner(msg);
    } else if (parsed.command.startsWith("selectstarter")) { //Selects a Starter
        selectStarter(msg);
    } else if (parsed.command === "register") { //Registers user obviously
        register(msg);
    } else if (parsed.command === "currency") {
        if (getUser(msg.author.id) === undefined) {
            msg.channel.send({content:"You need to register before doing this command, do b!register"});
            return;
        }
        msg.channel.send({content:"Your balance is currently: " + getCurrency(msg.author.id)});
    }
});
/**
 * 
 * @param {Discord.Message} msg The original message 
 * @returns void
 */
function runGame(msg) {
    participants = {};
    participants.push(msg.author.id);
    if (gameRunning) {
        msg.channel.send("Game already in progress!");
        return;
    }
    gameRunning = true;
    msg.channel.send(gameStartEmbed);
}
/**
 * 
 * @param {Discord.Message} msg 
 */
function summonBanner(msg) {
    if (getUser(msg.author.id) === undefined) {
        msg.channel.send({content:"You need to register before doing this command, do b!reguster"});
        return;
    }
    msg.content = msg.content.substring(6).trim().toLowerCase();
    let bannerImg = gacha.getBanner(msg.content);
    if (bannerImg === null) {
        msg.channel.send({content:"Not a valid Banner"});
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

client.on('interaction', async interaction => {
    if (!interaction.isButton()) return;
    let x = interaction.customID.split(" ");
    let banner = x[0];
    if (x[1] === "gacha1") {
        roll(interaction, banner);
    } else {
        interaction.reply({content:"Sorry x10 isn't available currently."});
    }
});
/**
 * 
 * @param {Discord.Message} msg 
 */
function roll(msg, banner) {
    let id = msg.member.user.id;
    if (getUser(id) === undefined) {
        msg.reply({content:"You need to register before doing this command, do b!register"});
        return;
    }
    let currency = getCurrency(id);
    if (currency < 500) {
        msg.reply({content:"I'm sorry, you do not have enough currency to do a 1x roll, try again later.\nYour remaining balance is: " + currency});
        return;
    } else {
        removeCurrency(id, currency, 500);
    }
    let rollResult = gacha.roll(banner);
    rollResult = gacha.getCharacter(rollResult.pick.id);
    msg.reply({embeds: [new Discord.MessageEmbed()
        .setDescription(msg.member.user.tag + " You Pulled: " + rollResult.name)
        .setImage(rollResult.source)]});
}

function getCurrency(id) {
    return database.prepare(`SELECT * FROM CharacterList WHERE userID = ?`).get(id).currency;
}

function removeCurrency(id, currency, amount) {
    database.prepare(`UPDATE CharacterList SET currency = ? WHERE userID = ?`).run(currency - amount, id);
}

/**
 * 
 * @param {Discord.Message} msg 
 */
function register(msg) {
    if (getUser(msg.author.id) === undefined) {
        database.prepare(`INSERT INTO CharacterList VALUES (?, ?, ?, ?)`).run(msg.author.id, "[]", 0, 5000);
        msg.channel.send({content:"Successfully registered " + msg.author.username});
    } else {
        msg.channel.send({content:"Why are you registering twice."});
    }
}

function getUser(ID) {
    return database.prepare(`SELECT * FROM CharacterList WHERE userID = ?`).get(ID);
}
/**
 * 
 * @param {Discord.Message} msg 
 */
function selectStarter(msg) {
    msg.content = msg.content.substring(15).trim();
    let data = getUser(msg.author.id);
    if (data === undefined) {
        msg.channel.send({content:"You are not registered yet. Use b!register to register."});
        return;
    }
    let characters = JSON.parse(data.characters);
    if (data.starter === 0) {
        let c;
        switch (msg.content) {
            case "osamu":
                characters.push(0);
                c = gacha.getCharacter(0);
                break;
            case "yuma":
                characters.push(1);
                c = gacha.getCharacter(1);
                break;
            case "chika":
                characters.push(2);
                c = gacha.getCharacter(2);
                break;
            case "jin":
                characters.push(3);
                c = gacha.getCharacter(3);
                break;
            default:
                msg.channel.send({content:"Sorry, that is not a valid starter, check help for proper syntax or do b!selectstarter {osamu, yuma, chika, jin}"});
                return;
        }
        database.prepare(`UPDATE CharacterList SET characters = ? WHERE userID = ?`).run(JSON.stringify(characters), msg.author.id);
        database.prepare(`UPDATE CharacterList SET starter = 1 WHERE userID = ?`).run(msg.author.id);
        msg.channel.send({embeds: [new Discord.MessageEmbed()
            .setDescription("Congratulations, you have started your journey. Your starter is: ")
            .setImage(c.source)]});
    } else {
        msg.channel.send({content:"You have already picked a starter, use b!reset to reset everything if you truly wish to reset."})
    }
}

client.login(result.TOKEN);