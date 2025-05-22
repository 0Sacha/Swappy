const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('liste des commande'),

    async execute(interaction) {
        await interaction.reply("---- Liste des commandes ----\n\n"
            + "💾  Save : Permet d'enregistrer la phrase reprise.\n\n"
            + "📑  List : liste tous les messages enregistrés avec la commande !save.\n\n"
            + "🗑️  delete_list : permet de supprimer tout ce qui a été sauvegardé avec la commande save.\n\n"
            + "📑  Resumer : resume la phrase reprise.\n");
    }
};
