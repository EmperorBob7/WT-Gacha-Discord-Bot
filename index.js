const fs = require('fs');
require('dotenv').config();

const SpreadSheet = require("./utilities/spreadsheet");
const spreadsheet = new SpreadSheet();
module.exports = spreadsheet;

const { Client, GatewayIntentBits, Partials, Discord, Routes, Collection, EmbedBuilder, Embed } = require('discord.js');
const { REST } = require('@discordjs/rest');
const client = new Client({ intents: [GatewayIntentBits.Guilds], partials: [Partials.Channel] });
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
client.commands = new Collection();

const prefix = "b!";
const getUser = require("./commands/getUser.js").getById;

const Rolling = require("./utilities/rolling.js");
const gacha = new Rolling();

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        commands.push(command.data.toJSON());
        client.commands.set(command.data.name, command);
    }
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands("658766290454052886"),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
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

client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;
    let x = interaction.customId.split(" ");
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
    let id = msg.user.id;
    if (getUser(id) === undefined) {
        msg.reply({ content: "You need to register before doing this command, do b!register" });
        return;
    }
    let currency = getCurrency(id);
    if (currency === null) {
        msg.reply({ content: "You are not registered." });
    } else if (currency < 500) {
        msg.reply({ content: "I'm sorry, you do not have enough currency to do a 1x roll, try again later.\nYour remaining balance is: " + currency });
        return;
    } else {
        removeCurrency(id, currency, 500);
    }
    let rollResult = gacha.roll(banner);
    spreadsheet.addCharacter(id, rollResult.pick.id);
    rollResult = gacha.getCharacter(rollResult.pick.id);
    msg.reply({
        embeds: [new EmbedBuilder()
            .setDescription(`${msg.user.username}#${msg.user.discriminator} You Pulled: ${rollResult.name}`)
            .setImage(rollResult.source)]
    });
}

function getCurrency(id) {
    return spreadsheet.getCurrency(id);
}

function removeCurrency(id, currency, amount) {
    spreadsheet.setCurrency(id, currency - amount);
}

client.login(process.env.TOKEN);