const ytdl = require('@distube/ytdl-core');

async function getSongInfo(url) {
    try {
        const songInfo = await ytdl.getBasicInfo(url);
        const duracionSeg = songInfo.videoDetails.lengthSeconds;
        const duracionString = `**${Math.floor(duracionSeg / 60)}m ${(duracionSeg % 60).toString().padStart(2, '0')}s.**`;
        
        const songTitle = songInfo.videoDetails.title;
        const songDuration = duracionString;
        const songThumbnail = songInfo.videoDetails.thumbnails[0].url;
        
        return {
            title: songTitle,
            duration: songDuration,
            thumbnail: songThumbnail
        }

    } catch (err) {
        console.log(`Hubo un error al intentar obtener la info de la cancion ${err}`);
        return null;
    }
}

module.exports = getSongInfo;