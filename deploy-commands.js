const fs = require('node:fs');
const path = require('node:path');
const { REST, Routes, SlashCommandBuilder } = require('discord.js');
const { CLIENT_ID, GUILD_ID, token } = require('./config.json');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// On lit chaque fichier de commande et on l'ajoute à la liste
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    commands.push(command.data.toJSON());
}

const rest = new REST({version: '10'}).setToken(token);

(async () => {
    try {
        const data = await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands }
        );

        console.log('Commandes enregistrées avec succès !');
    } catch (error) {
        console.log('une erreur est survenue : ' + error);
    }
})();

process.on('unhandledRejection', error => {
    console.error('une erreur est survenue : ' + error);
})