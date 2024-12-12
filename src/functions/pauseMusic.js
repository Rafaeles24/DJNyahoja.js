const player = require("../utils/player");

async function pauseMusic(guild) {
    if (player) {
        player.pause();
        console.log(`[REPRODUCTOR - ${guild.name}]: La canción ha sido pausada.`);
        return true;
    }

    return false;
}

module.exports = pauseMusic;