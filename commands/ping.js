const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Show the user latency"),
  async execute(interaction) {
    await interaction.reply(`Pong! \nLatency: ${interaction.client.ws.ping}ms`);
  },
};
