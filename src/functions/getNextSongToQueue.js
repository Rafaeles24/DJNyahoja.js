const Song = require("../db/models/Song");
const Queue = require("../db/models/Queue");

async function getNextSongToQueue(guild) {
    try {
        const queue = await Queue.findOne({
            where: { id: guild.id }
        })

        if (queue) {
            const nextSong = await Song.findOne({
                where: { queue_id: queue.id, position: queue.is_loop ? queue.now_playing : queue.now_playing + 1 }
            });

            if (nextSong) {
                if (queue.is_loop == false) {
                    queue.now_playing += 1;
                    await queue.save();
                }

                return { status: 'success', data: nextSong, loop: queue.is_loop };
            }
        }

        return { status: 'no-data', data:  null};

    } catch (err) {
        console.log(`[FUNCION OBTENER MUSICA DE COLA] Ha ocurrido un error => ${err}`);
        return { status: 'no-data', data:  null};
    }
}

module.exports = getNextSongToQueue;