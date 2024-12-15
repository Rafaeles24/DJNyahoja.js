const { getVoiceConnection } = require("@discordjs/voice");
const { Events, EmbedBuilder } = require("discord.js");
const player = require("../utils/player");
const Queue = require("../db/models/Queue");

module.exports = {
    name: Events.VoiceStateUpdate,
    once: false,
    async execute(oldState, newState) {
        const connection = getVoiceConnection(oldState.guild.id);

        if (!newState.channel && connection) {
            console.log(`[VOICE-CHANNEL - ${oldState.guild.name}] Desconectado del canal de voz de manera forzada.`);
            player.stop();
            const queue = await Queue.findOne({ where: { id: oldState.guild.id } });
            if (queue) {
                queue.destroy();
            }
            
            connection.destroy();
            
            const channel = oldState.guild.channels.cache.find(ch => ch.id === oldState.channelId);
            
            if (channel) {
                const disconnectEmbed = new EmbedBuilder()
                    .setDescription(`/ᐠ - ˕ -マ Ⳋ Desconectado de manera forzada.`);
            
                await channel.send({ embeds: [disconnectEmbed] });
            }
        }
    }       
}