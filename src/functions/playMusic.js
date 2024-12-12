const Queue = require("../db/models/Queue");
const addSongToQueue = require("./addSongToQueue");
const { decodeUrlSong } = require("./decodeUrlSong");
const playerStateChange = require('../events/playerStatus');
const player = require("../utils/player");
const getNextSongToQueue = require("./getNextSongToQueue");

async function playMusic(url, connection, guild, user, channel) {
    try {
        let [queue, created] = await Queue.findOrCreate({ where: { id: guild.id } });

        const addSong = await addSongToQueue(url, guild, user);
        if (addSong.status !== 'added') {
            return { action: 'error', message: 'No se pudo agregar la canción a la cola' };
        }

        if (!queue.is_playing) {
            const nextSong = await getNextSongToQueue(guild);
            if (nextSong.status !== 'success') {
                return { action: 'error', message: 'No se pudo obtener la siguiente canción' };
            }
            
            console.log(`[GUILD - ${guild.name}] Solicitando reproductor de audio en el servidor ${guild.name}`)
            const resource = await decodeUrlSong(nextSong.data.url);

            connection.subscribe(player);
            player.play(resource);
            playerStateChange.execute(guild, channel);
            queue.is_playing = true;
            await queue.save();

            return { action: 'playing', song: nextSong.data, loop: nextSong.loop };

        }
        
        return { action: 'queue', song: addSong.data };
        
    } catch (err) {
        console.error('Error al reproducir música:', err);
    }
}

module.exports = playMusic;