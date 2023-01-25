const { SlashCommandBuilder, ChannelType } = require("discord.js");
const {initializeApp} = require("firebase/app");
const {getFirestore, doc, updateDoc} = require("firebase/firestore");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Setup the bot to work on your server")
      .addRoleOption(role =>
          role.setName('adminrole')
              .setDescription('Role for administrators (these will be able to use the bot web dashboard)')
              .setRequired(true))
      .addChannelOption(option =>
          option.setName('ticketcategory')
              .setDescription('Category to create tickets in')
              .setRequired(true)
              .addChannelTypes(ChannelType.GuildCategory))
    .addRoleOption(role =>
        role.setName('staffrole')
            .setDescription('Role for staff')
            .setRequired(true))
      .addRoleOption(role =>
          role.setName('moderatorrole')
              .setDescription('Role for moderators')
              .setRequired(false))
      .addStringOption(option =>
          option.setName('prefix')
                .setDescription('Prefix for the bot')
                .setRequired(false))
      .setDefaultMemberPermissions(0)
      .setDMPermission(false),
  async execute(interaction) {
    try {
      if (!interaction.member === interaction.guild.owner || !interaction.member.permissions.has("ADMINISTRATOR")){
        return interaction.reply({
          content: "You do not have permission to use this command.",
          ephemeral: true,
        });
      }
        const category = interaction.options.getChannel("ticketcategory");
        const staffRole = interaction.options.getRole("staffrole");
        const moderatorRole = interaction.options.getRole("moderatorrole");
        const adminRole = interaction.options.getRole("adminrole");
        const prefix = interaction.options.getString("prefix");

        const firebaseConfig = {
            apiKey: "AIzaSyAsFPkrCVt2w5vjzZ-JaajZvIjwSLfRwwE",
            authDomain: "agile-bot-2003.firebaseapp.com",
            projectId: "agile-bot-2003",
            storageBucket: "agile-bot-2003.appspot.com",
            messagingSenderId: "1014532189070",
            appId: "1:1014532189070:web:5a0c45449e27bc068312df"
        };
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);

        const docRef = doc(db, "Guilds", interaction.guild.id);

        await updateDoc(docRef, {
            ticketCat: category.id,
            setup: true,
            prefix: ((prefix) ? prefix : "/"),
            staffRoleId: ((staffRole) ? staffRole.id : null),
            adminRoleId: adminRole.id,
            moderatorRoleId: ((moderatorRole) ? moderatorRole.id : null),
        }).then(() => {
            interaction.reply({
                content: `Setup complete!`,
                ephemeral: true,
            });
        }).catch((error) => {
            console.error("Error writing document: ", error);
            interaction.reply({
                content: "There was an error while executing this command!",
                ephemeral: true,
            });
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
