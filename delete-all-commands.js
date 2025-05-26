const { REST, Routes } = require('discord.js');
const { token, CLIENT_ID, GUILD_ID } = require('./config.json');

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('--- Suppression des commandes globales ---');

        const globalCommands = await rest.get(Routes.applicationCommands(CLIENT_ID));

        await Promise.all(globalCommands.map(cmd =>
            rest.delete(Routes.applicationCommand(CLIENT_ID, cmd.id))
        ));

        console.log('✔️ Commandes globales supprimées.');

        console.log('--- Suppression des commandes de guilde ---');

        const guildCommands = await rest.get(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID));

        await Promise.all(guildCommands.map(cmd =>
            rest.delete(Routes.applicationGuildCommand(CLIENT_ID, GUILD_ID, cmd.id))
        ));

        console.log('✔️ Commandes de guilde supprimées.');
    } catch (error) {
        console.error('❌ Erreur pendant la suppression :', error);
    }
})();
