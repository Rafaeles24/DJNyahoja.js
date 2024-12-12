const { Events } = require("discord.js");
const sequelize = require("../db/config/db");

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute() {
        sequelize.sync({force: true})
            .then(() => console.log('[DATABASE - SUCCESS] Tablas sincronizadas.'))
            .catch((err) => console.error('[DATABASE - ERROR] Error al sincronizar la base de datos:', err));
    }
}