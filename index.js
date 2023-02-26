const fs = require('fs');
require('dotenv').config();

const SpreadSheet = require("./utilities/spreadsheet");
const spreadsheet = new SpreadSheet();
module.exports = spreadsheet;

const { Client, GatewayIntentBits, Partials, Routes, Collection, EmbedBuilder, Message, ButtonInteraction } = require('discord.js');
const { REST } = require('@discordjs/rest');
const client = new Client({ intents: [GatewayIntentBits.Guilds], partials: [Partials.Channel] });
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const getUser = require("./commands/getUser.js").getById;

const Rolling = require("./utilities/rolling.js");
const gacha = new Rolling();
//const os = require('os');


client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.commands = new Collection();
    const commands = []; // For Routes

    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        commands.push(command.data.toJSON());
        client.commands.set(command.data.name, command);
    }
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands("658766290454052886"), // Bot ID
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }

    client.channels.cache.get("825206515940982804").send("Started");
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await interaction.deferReply();
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.editReply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;
    let x = interaction.customId.split(" ");
    let banner = x[0];
    if (x[1] === "gacha1") {
        roll(interaction, banner);
    } else {
        roll10(interaction, banner);
    }
});

/**
 * 
 * @param {ButtonInteraction} msg 
 * @param {String} banner
 */
function roll(msg, banner) {
    const id = msg.user.id;
    const cost = 500;
    if (getUser(id) === undefined) {
        msg.reply({ content: "You need to register before doing this command, do b!register" });
        return;
    }
    let currency = getCurrency(id);
    if (currency === null) {
        msg.reply({ content: "You are not registered." });
    } else if (currency < cost) {
        msg.reply({ content: "I'm sorry, you do not have enough currency to do a 1x roll, try again later.\nYour remaining balance is: " + currency });
    } else {
        removeCurrency(id, currency, cost);
        let rollResult = gacha.roll(banner);
        spreadsheet.addCharacter(id, rollResult.pick.id);
        spreadsheet.canSave = true; // Update Sheet Allowed

        rollResult = gacha.getCharacter(rollResult.pick.id);
        msg.reply({
            embeds: [new EmbedBuilder()
                .setDescription(`${msg.user.username}#${msg.user.discriminator} You Pulled: ${rollResult.name}`)
                .setImage(rollResult.source)]
        });
    }
}

/**
 * 
 * @param {ButtonInteraction} msg 
 * @param {String} banner 
 * @returns 
 */
async function roll10(msg, banner) {
    const id = msg.user.id;
    const cost = 500 * 10;

    if (getUser(id) === undefined) {
        msg.reply({ content: "You need to register before doing this command, do b!register" });
        return;
    }

    let currency = getCurrency(id);
    if (currency === null) {
        msg.reply({ content: "You are not registered." });
    } else if (currency < cost) {
        msg.reply({ content: "I'm sorry, you do not have enough currency to do a 10x roll, try again later.\nYour remaining balance is: " + currency });
    } else {
        rollMultiple(id, currency, cost, msg, banner);
    }
}

/**
 * 
 * @param {String} id 
 * @param {Number} currency 
 * @param {Number} cost 
 * @param {ButtonInteraction} msg 
 * @param {String} banner 
 */
async function rollMultiple(id, currency, cost, msg, banner) {
    removeCurrency(id, currency, cost);
    await msg.reply({ content: "Pulling x10" });

    /** @type {Message} */
    let msgToEdit;
    let embed;
    let output = [];

    for (let i = 0; i < 10; i++) {
        // Roll a character
        /**@type {Character} */
        let rollResult = gacha.roll(banner);
        output.push(spreadsheet.characterToString(rollResult.pick.id));
        spreadsheet.addCharacter(id, rollResult.pick.id);
        rollResult = gacha.getCharacter(rollResult.pick.id);

        // Update message
        let desc = `${msg.user.username}#${msg.user.discriminator} You Pulled: ${rollResult.name}`;
        embed = new EmbedBuilder()
            .setDescription(desc)
            .setImage(rollResult.source);

        // Send new message?
        if (msgToEdit) {
            await msgToEdit.edit({ embeds: [embed] });
        } else {
            msgToEdit = await msg.channel.send({ embeds: [embed] });
        }

        let sleepTime = 500;
        sleepTime += (1000 * rollResult.rarity) / 2;
        await sleep(sleepTime);
    }
    spreadsheet.canSave = true; // Let Save

    embed.setDescription(`${msg.user.username}#${msg.user.discriminator} You Pulled:\n${output.join("\n")}`);
    msgToEdit.edit({ embeds: [embed] });
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function getCurrency(id) {
    return spreadsheet.getCurrency(id);
}

function removeCurrency(id, currency, amount) {
    spreadsheet.setCurrency(id, currency - amount);
}

client.login(process.env.TOKEN);