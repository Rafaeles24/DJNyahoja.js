const { getVoiceConnection } = require("@discordjs/voice");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const skipMusic = require("../../functions/skipMusic");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Salta a la siguiente cancion'),

        async execute(interaction) {
            const { guild, member, user } = interaction;
            await interaction.deferReply();

            const memberVoiceChannel = member.voice.channel;

            if (!memberVoiceChannel) {
                return interaction.editReply({
                    content: '❌ Debes estar en un canal de voz para usar este comando.',
                    ephemeral: true
                });
            }

            const connection = getVoiceConnection(guild.id);

            if (!connection) {
                return interaction.editReply({
                    content: '❌ El bot no está conectado a ningún canal de voz.',
                    ephemeral: true
                });
            }

            if (connection.joinConfig.channelId !== memberVoiceChannel.id) {
                return interaction.editReply({
                    content: '❌ NO estas en el mismo canal de voz.',
                    ephemeral: true
                });
            }

            const skiped = await skipMusic(guild);

            if (skiped.status === 'skiped') {
                const pauseEmbed = new EmbedBuilder()
                    .setDescription('⏭️ /ᐠ - ˕ -マ Ⳋ Saltando cancion.')
                    .setFooter({ text: `${user.globalName}`, iconURL: `${user.avatarURL()}`})
                
                return interaction.editReply({ embeds: [pauseEmbed] });

            } else if (skiped.status === 'no-songs') {
                const noMusicEmbed = new EmbedBuilder()
                    .setDescription('⏭️ /ᐠ - ˕ -マ Ⳋ No hay mas canciones en cola.')
                    .setFooter({ text: `${user.globalName}`, iconURL: `${user.avatarURL()}`})
                
                return interaction.editReply({ embeds: [noMusicEmbed] });
            }
        }

}