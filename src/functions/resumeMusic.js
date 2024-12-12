const player = require("../utils/player");

async function resumeMusic(guild) {
    if (player) {
        player.unpause();
        console.log(`[REPRODUCTOR - ${guild.name}]: La canción ha sido resumida.`);
        return true;
    }

    return false;
}

module.exports = resumeMusic;