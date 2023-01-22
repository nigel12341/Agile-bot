const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("server")
    .setDescription("Provides information about the server.")
      .setDMPermission(false),
  async execute(interaction) {
    if (interaction.guild) {
      await interaction.reply(
        `Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`
      );
    } else {
      await interaction.reply("This command can only be used in servers.");
    }
  },
};
