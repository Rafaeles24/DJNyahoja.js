const { AudioPlayerStatus } = require("@discordjs/voice");
const player = require("../utils/player");
const Queue = require("../db/models/Queue");

async function skipMusic(guild) {
    if (player && player.state.status === AudioPlayerStatus.Playing) {
        const isSong = await Queue.findOne({
            where: { id: guild.id }
        });

        if (isSong && isSong.total_songs > isSong.now_playing) {
            const resource = player.state.resource;
            if (resource && resource.playStream) {
                resource.playStream.destroy();
            }
            
            player.stop();
            console.log(`[REPRODUCTOR - ${guild.name}]: La canción ha sido saltado.`); 

            return { status: 'skiped' };
        } 
        
        return { status: 'no-songs' };
    }
}

module.exports = skipMusic;