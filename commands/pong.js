const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pong')
        .setDescription('ping !'),

    async execute(interaction) {
        await interaction.reply('ping !')
    }
}