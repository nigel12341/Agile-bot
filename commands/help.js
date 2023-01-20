const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Provides information about the bot."),
  async execute(interaction) {
    const commands = interaction.client.commands.map((command) => {
      return {
        name: command.data.name,
        description: command.data.description,
      };
    });
    await interaction.reply({
      content: "Here's a list of all my commands:",
      embeds: [
        {
          title: "Commands",
          description: commands
            .map((command) => {
              return `**${command.name}**: ${command.description}`;
            })
            .join("\n"),
        },
      ],
    });
  },
};
