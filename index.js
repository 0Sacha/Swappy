// index.js
require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const axios = require("axios");
const {post} = require("axios");

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.on("ready", () => {
    console.log(`🤖 Le bot est connecté en tant que ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    if (message.content.startsWith("!help")) {
        const help = message.content.replace("!help", "").trim();
        if (!help) return (await message.reply("---- Liste des commandes ----\n" + "- Ping : Pong !"));
    }
});

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    if (message.content.startsWith("!ping")) {
        const ping = message.content.replace("!ping", "").trim();
        if (!ping) return message.reply("pong !");
    }
});

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    if (message.content.startsWith("!resume")) {
        const resume = message.content.replace("!resume", "").trim();
        if (!resume) return message.reply("Resumé en cours...");

        try {
            const response = await axios.post("https://api.deepseek.com/v1/chat/completions", {
                model: "deepseek-chat",
                messages: [{ role: "user", content: resume }]
            }, {
                headers: {
                    "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
                    "Content-Type": "application/json"
                }
            });

            const answer = response.data.choices[0].message.content;
            message.reply(answer);
        } catch (error) {
            console.error(error);
            message.reply("Oops ! Il y a eu un problème avec DeepSeek.");
        }

    }

    const savedMessages = [];

    client.on('messageCreate', async (message) => {
        if (message.author.bot) return;

        // Si l'utilisateur tape "!save" en réponse à un message
        if (message.content === '!save' && message.reference) {
            try {
                // On récupère le message auquel il a répondu
                const referencedMessage = await message.channel.messages.fetch(message.reference.messageId);

                // On le stocke (ici dans un tableau, mais ça pourrait être une base de données)
                savedMessages.push({
                    content: referencedMessage.content,
                    author: referencedMessage.author.tag,
                    id: referencedMessage.id,
                    savedBy: message.author.tag
                });

                message.reply(`💾 Message sauvegardé : "${referencedMessage.content}"`);
            } catch (err) {
                console.error(err);
                message.reply("❌ Impossible de récupérer le message.");
            }
        }

        // Pour voir tous les messages enregistrés
        if (message.content === '!list') {
            if (savedMessages.length === 0) {
                message.reply("📭 Aucun message sauvegardé.");
            } else {
                const list = savedMessages.map((m, i) => `${i + 1}. ${m.content} (par ${m.author})`).join("\n");
                message.reply(`📝 Messages sauvegardés :\n${list}`);
            }
        }
    });

});

client.login(process.env.DISCORD_TOKEN);