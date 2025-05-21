// index.js
require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const axios = require("axios");
const {post} = require("axios");

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const savedMessages = [];

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

// Commande pour l'aide
    if (message.content.startsWith("!help")) {
        const help = message.content.replace("!help", "").trim();
        if (!help) return (await message.reply("---- Liste des commandes ----\n \n" + "🏓  Ping : Pong !\n \n"
            + "💾  Save : Permet d'enregistrer la phrase reprise.\n \n" + "📑  List : liste tous les messages enregistrés avec la commande !save.\n \n"
            + "🗑️  delete_list : permet de supprimer tout ce qui a été sauvegardé avec la commande save."));
    }

    // Commande pour tester la connexion du bot

    if (message.content.startsWith("!ping")) {
        const ping = message.content.replace("!ping", "").trim();
        if (!ping) return message.reply("pong !");
    }

    if (message.content.startsWith("!pong")) {
        const pong = message.content.replace("!pong", "").trim();
        if (!pong) return message.reply("ping !");
    }

    // Commande pour résumer un text


    // Commande pour sauvegarder un text
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
            message.reply(`📬 Messages sauvegardés :\n${list}`);
        }
    }

    if (message.content === '!delete_list') {
        const delete_list = message.content.replace("!delete_list", "").trim();
        if (!delete_list) {
            return savedMessages.length = 0,
                message.reply("🗑️ les message sauvgarder on bien était supprimer");
        } else {
            return  message.reply("❌ Les message sauvgarder n'on pas était supprimer");
        }
    }


    // Commande pour shutdown le bot

    if (message.content === '!shutdown') {
        await message.reply("🚧  Swappy s'est éteint...  🚧");
        await client.destroy();
        process.exit(0);
        console.log("🪫 Swappy est déconnecter")
    }




});


client.on("ready", () => {
    console.log(`✅ ${client.user.tag} est connecté !`);
});

// Pour ce connecter au TOKEN du BOT
console.log("⚡ Swappy démarre !");
client.login(process.env.DISCORD_TOKEN);

