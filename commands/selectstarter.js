const database = require("better-sqlite3")("Storage.db");
const getUser = require("./getUser.js");
module.exports = {
    name: 'selectstarter',
    description: 'Lets the player select a starter',
    execute(msg, args) {
        msg.content = msg.content.substring(15).trim();
        let data = getUser(msg.author.id);
        if (data === undefined) {
            msg.channel.send({ content: "You are not registered yet. Use b!register to register." });
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
                    msg.channel.send({ content: "Sorry, that is not a valid starter, check help for proper syntax or do b!selectstarter {osamu, yuma, chika, jin}" });
                    return;
            }
            database.prepare(`UPDATE CharacterList SET characters = ? WHERE userID = ?`).run(JSON.stringify(characters), msg.author.id);
            database.prepare(`UPDATE CharacterList SET starter = 1 WHERE userID = ?`).run(msg.author.id);
            msg.channel.send({
                embeds: [new Discord.MessageEmbed()
                    .setDescription("Congratulations, you have started your journey. Your starter is: ")
                    .setImage(c.source)]
            });
        } else {
            msg.channel.send({ content: "You have already picked a starter, use b!reset to reset everything if you truly wish to reset." })
        }
    }
};