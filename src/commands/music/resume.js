const { getVoiceConnection } = require("@discordjs/voice");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const resumeMusic = require("../../functions/resumeMusic");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Resume el reproductor activo'),

        async execute(interaction) {
            const { guild, member, user } = interaction;

            const memberVoiceChannel = member.voice.channel;

            if (!memberVoiceChannel) {
                return interaction.reply({
                    content: '❌ Debes estar en un canal de voz para usar este comando.',
                    ephemeral: true
                });
            }

            const connection = getVoiceConnection(guild.id);

            if (!connection) {
                return interaction.reply({
                    content: '❌ El bot no está conectado a ningún canal de voz.',
                    ephemeral: true
                });
            }

            if (connection.joinConfig.channelId !== memberVoiceChannel.id) {
                return interaction.reply({
                    content: '❌ NO estas en el mismo canal de voz.',
                    ephemeral: true
                });
            }

            const resumed = await resumeMusic(guild);
            if (resumed) {
                const pauseEmbed = new EmbedBuilder()
                    .setDescription('▶️ /ᐠ - ˕ -マ Ⳋ Reproductor en curso.')
                    .setFooter({ text: `${user.globalName}`, iconURL: `${user.avatarURL()}`})
                
                return interaction.reply({ embeds: [pauseEmbed] });
            } 

            return await interaction.reply({
                content: '❌ No hay música reproduciéndose actualmente.',
                ephemeral: false
            });
        }

}