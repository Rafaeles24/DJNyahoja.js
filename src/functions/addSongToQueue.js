const Queue = require("../db/models/Queue");
const Song = require("../db/models/Song");
const getSongInfo = require("./getSongInfo");

async function addSongToQueue(url, guild, user) {
    try {
        const getQueue = await Queue.findOne({ 
            where: { id: guild.id }
        });

        if (getQueue) {
            getQueue.total_songs += 1;
            await getQueue.save(); 

            const songInfo = await getSongInfo(url);

            const songAdded = await Song.create({
                queue_id: getQueue.id,
                url: url,
                user_id: user.id,
                title: songInfo.title,
                duration: songInfo.duration,
                thumbnail: songInfo.thumbnail,
                user_globalName: user.globalName,
                user_avatar: user.displayAvatarURL(),
                position: getQueue.total_songs 
            })

            return { status: 'added', data: songAdded };
        }

        return { status: 'not-added', data: null };

    } catch (err) {
        console.log(`[ADDSONGTOQUEUE] Ocurrio un error al agregar la musica a la cola.`);
        return { status: 'not-added', data: null };

    }
}

module.exports = addSongToQueue;