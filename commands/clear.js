const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clears messages.")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("The amount of messages to clear.")
        .setRequired(true)
    )
      .setDMPermission(false),
  async execute(interaction) {
    try {
      if (!interaction.member.permissions.has("MANAGE_MESSAGES")) {
        return interaction.reply({
          content: "You do not have permission to use this command.",
          ephemeral: true,
        });
      }
      const amount = interaction.options.getInteger("amount");
      await interaction.channel.bulkDelete(amount);
      await interaction.reply({
        content: `Cleared ${amount} messages.`,
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  },
};
