const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const playMusic = require("../../functions/playMusic");
const { joinVoiceChannel, getVoiceConnection } = require("@discordjs/voice");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Reproduce musica de youtube mediante URL')
        .addStringOption( option => 
            option
            .setName('url')
            .setDescription('Pega aqui la url')
            .setRequired(true)
        ),

        async execute(interaction) {
            const { user, guild, channel, member, options } = interaction;
            await interaction.deferReply();

            const channelVoice = member.voice.channel;

            if (!channelVoice) return interaction.editReply({ content: '¡Debes estar en un canal de voz para usar este comando!', ephemeral: true });

            const url = options.getString('url');

            /* const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube|youtu|youtube-nocookie)\.(com|be)\/(watch\?v=|shorts\/|embed\/|v\/|c\/)([a-zA-Z0-9_-]{11})([?&].*)?$/;

            if (!youtubeRegex.test(url)) return interaction.editReply({ content: '¡Debes proporcionar una url valida!', ephemeral: true }); */

            let connection = getVoiceConnection(guild.id);

            if (!connection) {
                connection = joinVoiceChannel({
                    channelId: channelVoice.id,
                    guildId: guild.id,
                    adapterCreator: guild.voiceAdapterCreator
                });
            }

            const playSong = await playMusic(url, connection, guild, user, channel);

            if (playSong.action == 'queue') {   
                const embedQueue = new EmbedBuilder()
                .setColor("#f1c232")
                .setTitle(`<:youtube_logo:1316974495851876352>  🎶 ${playSong.song.position}° ¡Agregado a la cola!`)
                .setDescription(`🎶 Título: ${playSong.song.title} \n⌚ Tiempo: ${playSong.song.duration} \nURL: ${playSong.song.url} \nLoop: ${playSong.loop ? 'Activo' : 'Inactivo'}`);
            
                return interaction.editReply({ embeds: [embedQueue] });
            } else if (playSong.action == 'playing') {
                const embedPlay = new EmbedBuilder()
                .setColor("#1DB954")
                .setTitle("<:youtube_logo:1316974495851876352>  🎶 Let's go party!")
                .setDescription(`🎶 Título: ${playSong.song.title} \n⌚ Tiempo: ${playSong.song.duration} \nURL: ${playSong.song.url} \nLoop: ${playSong.loop ? 'Activo' : 'Inactivo'}`)
                .setThumbnail(playSong.song.thumbnail)
                .setFooter({ text: `Pedido por ${playSong.song.user_globalName}`, iconURL: playSong.song.user_avatar})
                .setTimestamp();
            
                return interaction.editReply({ embeds: [embedPlay] });
            }
        }
}