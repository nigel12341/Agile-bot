const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Select a member and kick them.')
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription('The member to kick')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('The reason for kicking the member')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .setDMPermission(false),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('yesKickButton')
                    .setLabel('Yes!')
                    .setStyle(ButtonStyle.Danger),
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('noKickButton')
                    .setLabel('No...')
                    .setStyle(ButtonStyle.Secondary),
            );

        await interaction.reply({ content: 'Are you sure?', components: [row] , ephemeral: true,});
        const filter = i => i.customId === 'yesKickButton' || i.customId === 'noKickButton';
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

        collector.on('collect', async i => {
            if (i.customId === 'yesKickButton') {
                await i.deferUpdate();
                if(!interaction.guild.members.cache.get(target.id).kickable) return i.editReply({ content: '❎ I cannot kick this member.\nThis is possibly caused by the permissions setup incorrectly.', components: []});
                await interaction.guild.members.kick(target, interaction.options.getString('reason') ? interaction.options.getString('reason') : `Kicked by ${interaction.user.username}`);
                await i.editReply({ content: `✅ ${target.username} has been kicked.`, components: [] });
            }
            if (i.customId === 'noKickButton') {
                await i.deferUpdate();
                await i.editReply({ content: '❎ Cancelled!', components: []});
            }
        });
    },
};