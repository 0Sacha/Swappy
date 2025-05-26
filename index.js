require("dotenv").config();
const { Client, Collection, GatewayIntentBits, Events } = require("discord.js");
const { token } = require("./config.json");
const fs = require('node:fs');
const path = require('node:path');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.once(Events.ClientReady, c => {
    console.log(`✅ ${c.user.tag} est connecté !`);
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
}

client.on(Events.InteractionCreate, async interaction => {
    try {
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            await command.execute(interaction);
        } else if (interaction.isMessageContextMenuCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            await command.execute(interaction);
        }
    } catch (error) {
        console.error(error);
        if (interaction.deferred || interaction.replied) {
            await interaction.editReply({ content: '❌ Erreur lors de l’exécution de cette commande.' });
        } else {
            await interaction.reply({ content: '❌ Erreur lors de l’exécution de cette commande.', ephemeral: true });
        }
    }
});

client.on(Events.MessageCreate, async message => {
    if (message.content === '!shutdown') {
        await message.reply("🚧  Swappy s'est éteint...  🚧");
        console.log("⛔ Swappy est déconnecté");
        await client.destroy();
        process.exit(0);
    }
});

console.log("⚡ Swappy démarre !");
client.login(token);
