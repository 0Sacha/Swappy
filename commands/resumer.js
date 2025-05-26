const { SlashCommandBuilder } = require('discord.js');
const { MISTRAL_API_KEY } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Fait un résumé automatique d\'un texte donné')
        .addStringOption(option =>
            option.setName('texte')
                .setDescription('Le texte à résumer')
                .setRequired(true)
        ),

    async execute(interaction) {
        const text = interaction.options.getString('texte');

        if (text.length < 10) {
            return interaction.reply({ content: 'Le texte est trop court pour être résumé.', ephemeral: true });
        }

        await interaction.deferReply();

        try {
            const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${MISTRAL_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "mistral-medium",
                    messages: [
                        {
                            role: "system",
                            content: "Résume ce texte en quelques phrases seulement. Le ton doit être naturel et humain, sans dire que c’est un résumé. Va à l’essentiel, mets en avant les idées principales, comme si quelqu’un expliquait simplement ce qu’il a compris. Pas de détails superflus."
                        },
                        {
                            role: "user",
                            content: `Résume ce texte : ${text}`
                        }
                    ],
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                throw new Error(`Erreur API Mistral : ${response.statusText}`);
            }

            const data = await response.json();

            const summary = data.choices?.[0]?.message?.content?.trim();

            if (!summary) {
                return interaction.editReply("Erreur lors du résumé du texte.");
            }

            return interaction.editReply(`Résumé : ${summary}`);
        } catch (error) {
            console.error(error);
            return interaction.editReply('Une erreur est survenue lors de la génération du résumé.');
        }
    }
};
