const { SlashCommandBuilder } = require('discord.js');


module.exports = {

    data: new SlashCommandBuilder()
        .setName('save')
        .setDescription('enregistre le message dans un tableau'),

    async execute(interaction) {
            try {
                // On récupère le message auquel il a répondu
                const referencedMessage = await interaction.channel.messages.fetch(interaction.reference, interaction.messageId);

                // On le stocke (ici dans un tableau, mais ça pourrait être une base de données)
                savedMessages.push({
                    content: referencedMessage.content,
                    author: referencedMessage.author.tag,
                    id: referencedMessage.id,
                    savedBy: message.author.tag
                });

                await interaction.reply(`💾 Message sauvegardé : "${referencedMessage.content}"`);
            } catch (err) {
                console.error(err);
                await interaction.reply("❌ Impossible de récupérer le message.");
            }
        }
};


