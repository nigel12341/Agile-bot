const { SlashCommandBuilder, ChannelType } = require("discord.js");
const {initializeApp} = require("firebase/app");
const {getFirestore, doc, updateDoc, setDoc} = require("firebase/firestore");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Setup the bot to work on your server")
      .addRoleOption(role =>
          role.setName('adminrole')
              .setDescription('Role for administrators (these will be able to use the bot web dashboard)')
              .setRequired(true))
      .addChannelOption(channel =>
          channel.setName('ticketcategory')
              .setDescription('Category to create tickets in')
              .setRequired(true)
              .addChannelTypes(ChannelType.GuildCategory))
      .addChannelOption(channel =>
          channel.setName('logs')
                .setDescription('Channel for logs.')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText))
    .addRoleOption(role =>
        role.setName('staffrole')
            .setDescription('Role for staff')
            .setRequired(true))
      .addRoleOption(role =>
          role.setName('moderatorrole')
              .setDescription('Role for moderators')
              .setRequired(true))
      .addRoleOption(role =>
            role.setName('muterole')
                .setDescription('Role for muted users')
                .setRequired(true))
      .addRoleOption(role =>
            role.setName('helperrole')
                .setDescription('Role for helpers')
                .setRequired(true))
      .addBooleanOption(option =>
          option.setName('allowhelpersintickets')
            .setDescription('Allow helpers to see tickets (default: false)')
            .setRequired(true))
      .addBooleanOption(option =>
          option.setName('allowmoderatortoban')
            .setDescription('Allow moderators to ban users (default: false)')
            .setRequired(true))
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

        await pushSetupDataToFirebase(interaction);

        await interaction.reply({content: "Setup complete!"});

    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: "There was an error while executing this command!",
            ephemeral: true,
        });
    }
  },
};


async function pushSetupDataToFirebase(interaction){
    const ticketcategory = interaction.options.getChannel("ticketcategory");
    const staffRole = interaction.options.getRole("staffrole");
    const moderatorRole = interaction.options.getRole("moderatorrole");
    const adminRole = interaction.options.getRole("adminrole");
    const muteRole = interaction.options.getRole("muterole");
    const helperRole = interaction.options.getRole("helperrole");
    const allowHelpersInTickets = interaction.options.getBoolean("allowhelpersintickets");
    const allowModeratorToBan = interaction.options.getBoolean("allowmoderatortoban");
    const logs = interaction.options.getChannel("logs");

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

    const createSettingsCatagoriesRef = doc(db, "Guilds", interaction.guild.id, "settings", "catagories");
    const createSettingsAccessRef = doc(db, "Guilds", interaction.guild.id, "settings", "access");
    const createSettingsRolesRef = doc(db, "Guilds", interaction.guild.id, "settings", "roles");
    const createSettingsChannelsRef = doc(db, "Guilds", interaction.guild.id, "settings", "channels");
    const createSetupRef = doc(db, "Guilds", interaction.guild.id);


    const promise1 = setDoc(createSettingsCatagoriesRef, {
        ticketId: ticketcategory.id
    });

    const promise2 = setDoc(createSettingsAccessRef, {
        helperTicket: allowHelpersInTickets,
        moderatorBan: allowModeratorToBan
    });

    const promise3 = setDoc(createSettingsRolesRef, {
        adminRoleId: adminRole.id,
        moderatorRoleId: moderatorRole.id,
        helperRoleId: helperRole.id,
        mutedRoleId: muteRole.id,
        staffRoleId: staffRole.id,
    });

    const promise4 = setDoc(createSettingsChannelsRef, {
        logsId: logs.id
    });

    const promise5 = setDoc(createSetupRef, {
        setup: true,
    });

    await Promise.all([promise1, promise2, promise3, promise4, promise5]).catch((error) => {
        interaction.channel.send("Error setting up database, please try again later. If this error persists, please contact the developer.")
        return console.error("Error writing document: ", error);
    });
}
