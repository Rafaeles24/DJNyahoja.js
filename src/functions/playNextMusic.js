const player = require("../utils/player");
const { decodeUrlSong } = require("./decodeUrlSong");
const getNextSongToQueue = require("./getNextSongToQueue");

async function playNextMusic(connection, guild) {
    try {
        const nextSong = await getNextSongToQueue(guild);
        if (nextSong.status === 'success') {
            const resource = await decodeUrlSong(nextSong.data.url);
            connection.subscribe(player);
            player.play(resource);

            return { action: 'playing', song: nextSong.data, loop: nextSong.loop };
        }

        return { action: 'noMusic', song: null };

    } catch (err) {
        console.log(`Ocurrio un error al intentar cambiar la musica: ${err}`);
    }
}

module.exports = playNextMusic;