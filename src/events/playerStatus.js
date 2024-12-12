const { AudioPlayerStatus, getVoiceConnection } = require("@discordjs/voice");
const playNextMusic = require("../functions/playNextMusic");
const { EmbedBuilder } = require("discord.js");
const Queue = require("../db/models/Queue");
const player = require("../utils/player");

module.exports = {
    name: 'playerStateChange',
    once: false,
    async execute(guild, channel) {
        let queue, nextSong, timeOut;
        
        player.on('stateChange', async (oldState, newState) => {
            if (oldState.status === AudioPlayerStatus.Playing && newState.status === AudioPlayerStatus.Idle) {
                console.log(`🔻 [REPRODUCTOR - ${guild.name}] Estado: Idle (Reproductor inactivo)`);
                clearTimeout(timeOut);
                try {
                    const connection = getVoiceConnection(guild.id);
                    if (connection) {
                        nextSong = await playNextMusic(connection, guild);
                    } else {
                        console.log('NO se ha podido encontrar una instancia a la conexion de voz.')
                    }
                    
                    if (nextSong.action === 'playing') {
                        const embedNextSong = new EmbedBuilder()
                            .setColor("#1DB954")
                            .setTitle(`<:Youtube_logo:1316629065997750282> ${nextSong.song.position}° Siguiente -> Ahora `)
                            .setDescription(`\n🎶 Título: ${nextSong.song.title} \nDuración: ⌚ ${nextSong.song.duration} \nLoop: ${nextSong.loop ? 'Activo' : 'Inactivo'}`)
                            .setThumbnail(nextSong.song.thumbnail)
                            .setFooter({ text: `Pedido por ${nextSong.song.user_globalName}`, iconURL: nextSong.song.user_avatar })
                            .setTimestamp();
    
                        channel.send({ embeds: [embedNextSong] });
                    } else if (nextSong.action === 'noMusic') {
                        console.log(`🔻 [REPRODUCTOR - ${guild.name}] No hay más canciones para reproducir, esperando otra cancion.`);

                        queue = await Queue.findOne({
                            where: { id: guild.id }
                        });
                        const embedFinishQueue = new EmbedBuilder()
                            .setColor("#bf9000")
                            .setDescription('/ᐠ - ˕ -マ Ⳋ No hay más canciones en la cola de reproducción');
                        
                        channel.send({ embeds: [embedFinishQueue] });

                        timeOut = setTimeout(() => {
                            player.removeAllListeners();
                            player.stop();
                            queue.destroy();
                            if (connection) {
                                if (connection.state.status !== "destroyed") {
                                    connection.destroy();
                                }
                            }
        
                            const embedDisconnect = new EmbedBuilder()
                                .setColor("#bf9000")
                                .setDescription('/ᐠ - ˕ -マ Ⳋ No hay más canciones en la cola de reproducción, me desconectaré');

                            console.log(`🔻 [REPRODUCTOR - ${guild.name}] El tiempo de espera ha finalizado, Bot Desconectado`);

                            return channel.send({ embeds: [embedDisconnect] });
                        }, 180000)

                    }
                } catch (err) {
                    console.log(`Hubo un error en el estado idle ${err}`);
                } 
            } else if (oldState.status === AudioPlayerStatus.Idle && newState.status === AudioPlayerStatus.Buffering) {
                console.log(`🔊 [REPRODUCTOR - ${guild.name}] Iniciando reproduccion del recurso decodificado...`);
            } else if (oldState.status === AudioPlayerStatus.Buffering && newState.status === AudioPlayerStatus.Playing) {
                console.log(`🔊 [REPRODUCTOR - ${guild.name}] Estado: Playing (Reproduciendo audio...)`);
            }
        });
    }
}
