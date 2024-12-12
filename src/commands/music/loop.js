const { getVoiceConnection } = require("@discordjs/voice");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const loopMusic = require("../../functions/loopMusic");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('Haz que una cancion se repita indefinida veces'),

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

            const looped = await loopMusic(guild);
            if (looped.status === 'loop') {
                const loopEmbed = new EmbedBuilder()
                    .setDescription('⏸️ /ᐠ - ˕ -マ Ⳋ Loop activado para esta canción')
                    .setFooter({ text: `${user.globalName}`, iconURL: `${user.avatarURL()}`})
                
                return interaction.reply({ embeds: [loopEmbed] });
            } else if (looped.status === 'no-loop') {
                const loopEmbed = new EmbedBuilder()
                    .setDescription('⏸️ /ᐠ - ˕ -マ Ⳋ Loop desactivado para esta canción')
                    .setFooter({ text: `${user.globalName}`, iconURL: `${user.avatarURL()}`})
                
                return interaction.reply({ embeds: [loopEmbed] });
            }

            return await interaction.reply({
                content: '❌ No hay música reproduciéndose actualmente.',
                ephemeral: false
            });
        }

}