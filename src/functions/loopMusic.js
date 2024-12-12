const Queue = require("../db/models/Queue");

async function loopMusic(guild) {
    try {
        const queue = await Queue.findOne({
            where: { id: guild.id }
        })

        if (queue && !queue.is_loop) {
            queue.is_loop = true;
            queue.save();
            return { status: 'loop' };
        } else {
            queue.is_loop = false;
            queue.save();
            return { status: 'no-loop' };
        }
    } catch (err) {
        console.log('Ocurrio un error al asignar loop a una cancion');
    }
}

module.exports = loopMusic;