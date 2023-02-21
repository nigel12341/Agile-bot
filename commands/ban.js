const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
      .setName('ban')
      .setDescription('Select a member and ban them.')
      .addUserOption(option =>
          option
              .setName('target')
              .setDescription('The member to ban')
              .setRequired(true))
      .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  async execute(interaction) {
    const target = interaction.options.getUser('target');
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('yesBanButton')
                .setLabel('Yes!')
                .setStyle(ButtonStyle.Danger),
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId('noBanButton')
                .setLabel('No...')
                .setStyle(ButtonStyle.Secondary),
        );

    await interaction.reply({ content: 'Are you sure?', components: [row] , ephemeral: true,});
    const filter = i => i.customId === 'yesBanButton' || i.customId === 'noBanButton';
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

    collector.on('collect', async i => {
      if (i.customId === 'yesBanButton') {
        await i.deferUpdate();
        await interaction.guild.members.ban(target);
        await i.editReply({ content: `✅ ${target.username} has been banned.`, components: [] });
      }
      if (i.customId === 'noBanButton') {
        await i.deferUpdate();
        await i.editReply({ content: '❎ Cancelled!', components: []});
      }
    });
  },
};
