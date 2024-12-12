const { createAudioResource, StreamType } = require("@discordjs/voice");
const ytdl = require("@distube/ytdl-core");
const Ffmpeg = require("fluent-ffmpeg");

async function decodeUrlSong(url) {
    try {
        console.log('[DECODIFICAR_URL]: Decodificando url solicitado...');
        const stream = ytdl(url,{
            filter: 'audioonly',
            quality: 'highestaudio',
            highWaterMark: 1 << 25
        });

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

        opusStream.on('error', () => {
            opusStream.destroy();
        });

        const resource = createAudioResource(opusStream, {
            inputType: StreamType.OggOpus
        });

        console.log('[DECODIFICAR_URL_SUCCESS]: Url solicitado decodificado.');

        return resource;
        
    } catch (err) {
        console.error(`[DECODIFICAR_URL_ERROR]: No se puedo decodificar la url solicitada => ${err}`);
        return null;
    }
}

module.exports = {
    decodeUrlSong
};