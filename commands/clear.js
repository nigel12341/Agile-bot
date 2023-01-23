const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const {doc, getFirestore, updateDoc, increment} = require("firebase/firestore");
const {initializeApp} = require("firebase/app");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clears messages.")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("The amount of messages to clear.")
        .setRequired(true)
          .setMinValue(1)
          .setMaxValue(100)
    )
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
      .setDMPermission(false),
  async execute(interaction) {
    const firebaseConfig = {
      apiKey: "AIzaSyAsFPkrCVt2w5vjzZ-JaajZvIjwSLfRwwE",
      authDomain: "agile-bot-2003.firebaseapp.com",
      projectId: "agile-bot-2003",
      storageBucket: "agile-bot-2003.appspot.com",
      messagingSenderId: "1014532189070",
      appId: "1:1014532189070:web:5a0c45449e27bc068312df"
    };
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app)
    try {
      const createModStatsRef = doc(db, "Guilds", interaction.guild.id, "stats", "moderation");
      const amount = interaction.options.getInteger("amount");
      await interaction.channel.bulkDelete(amount, true);
      await interaction.reply({
        content: `Cleared ${amount} messages.`,
        ephemeral: true,
      });

      await updateDoc(createModStatsRef, {
        clears: increment(1),
        clearMessages: increment(amount)
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
