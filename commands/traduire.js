const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');
const { MISTRAL_API_KEY } = require('../config.json');
const fetch = require('node-fetch');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Traduire')
        .setType(ApplicationCommandType.Message),

    async execute(interaction) {
        const message = interaction.targetMessage;
        const textToTranslate = message.content;

        if (!textToTranslate || textToTranslate.length < 1) {
            return interaction.reply({ content: 'Le message est vide, impossible de traduire.', ephemeral: true });
        }

        await interaction.deferReply({ ephemeral: true });

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
                            content: "Tu es un traducteur professionnel. Traduis le texte fourni dans un français clair et naturel."
                        },
                        {
                            role: "user",
                            content: `Traduis ce texte : ${textToTranslate}`
                        }
                    ],
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                throw new Error(`Erreur API Mistral : ${response.statusText}`);
            }

            const data = await response.json();
            const translatedText = data.choices?.[0]?.message?.content?.trim();

            if (!translatedText) {
                return interaction.editReply({ content: "Erreur lors de la traduction du message.", ephemeral: true });
            }

            return interaction.editReply({ content: translatedText, ephemeral: true });

        } catch (error) {
            console.error(error);
            return interaction.editReply({ content: 'Une erreur est survenue lors de la traduction.', ephemeral: true });
        }
    }
};
