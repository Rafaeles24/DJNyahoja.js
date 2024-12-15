const { createAudioResource, StreamType } = require("@discordjs/voice");
const ytdl = require("@distube/ytdl-core");
const Ffmpeg = require("fluent-ffmpeg");

async function decodeUrlSong(url) {
    try {
        console.log('[DECODIFICAR_URL]: Decodificando url solicitado...');

        const stream = ytdl(url,{
            filter: 'audioonly',
            quality: 'lowestaudio',
            highWaterMark: 1 << 20
        }); 

        if (stream) {
            console.log('[DISTUBE/YTDL-CORE]: Stream obtenido correctamente.');
        }

        const opusStream = Ffmpeg(stream)
            .audioCodec('libopus')
            .format('ogg')
            .on('error', () => {
                opusStream.destroy();
            })
            .on('close', () => {
                console.log('[FFmpeg Close]: Stream cerrado.');
            })
            .pipe(); 

        const resource = createAudioResource(opusStream, {
            inputType: StreamType.OggOpus
        });

        console.log('[DECODIFICAR_URL_SUCCESS]: Url solicitado decodificado.');
        //console.log(resource);
        return resource;
        
    } catch (err) {
        console.error(`[DECODIFICAR_URL_ERROR]: No se puedo decodificar la url solicitada => ${err}`);
        return null;
    }
}

module.exports = {
    decodeUrlSong
};