const { Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`[CLIENTE] Bot logueado y listo como => ${client.user.tag}`);
    },
};