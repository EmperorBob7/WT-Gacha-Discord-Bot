const { EmbedBuilder } = require('discord.js');
module.exports = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle('Game Start!')
    .setDescription('Beginning Battle Game, all participants take damage at set intervals, so work together to defeat bosses.\nExp Earned correlates directly with damage done.')
    .addField('b!attack air', 'Use this command to use an aerial attack that powers up based on your Mee6 exp.', false)
    .addField('b!attack2 ground', 'Use this command to use an aerial attack that powers up based on your Mee6 exp.', false)
    .addField('b!shield','Blocks yourself and any ally who reacts to your shield command, will take more damage depending on how many people react.', false)
    .addField('b!bailout','Bail out before your trion runs out in order to cut Yen lost in half.', false)
    .setTimestamp()