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
      .addChannelOption(option =>
          option.setName('ticketcategory')
              .setDescription('Category to create tickets in')
              .setRequired(true)
              .addChannelTypes(ChannelType.GuildCategory))
      .addChannelOption(channel =>
          channel.setName('logs')
                .setDescription('Channel for logs.')
                .setRequired(true))
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
                .setRequired(false))
      .addBooleanOption(option =>
          option.setName('AllowHelpersInTickets')
            .setDescription('Allow helpers to see tickets (default: false)')
            .setRequired(false))
      .addBooleanOption(option =>
          option.setName('AllowModeratorToBan')
            .setDescription('Allow moderators to ban users (default: false)')
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


    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: "There was an error while executing this command!",
            ephemeral: true,
        });
    }
  },
};


//TODO: add the values to the promises!
async function pushSetupDataToFirebase(interaction){
    const category = interaction.options.getChannel("ticketcategory");
    const staffRole = interaction.options.getRole("staffrole");
    const moderatorRole = interaction.options.getRole("moderatorrole");
    const adminRole = interaction.options.getRole("adminrole");
    const muteRole = interaction.options.getRole("muterole");
    const helperRole = interaction.options.getRole("helperrole");
    const allowHelpersInTickets = interaction.options.getBoolean("AllowHelpersInTickets");
    const allowModeratorToBan = interaction.options.getBoolean("AllowModeratorToBan");
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

    const createTicketStatsRef = doc(db, "Guilds", guild.id, "stats", "tickets");
    const createModStatsRef = doc(db, "Guilds", guild.id, "stats", "moderation");
    const createSettingsCatagoriesRef = doc(db, "Guilds", guild.id, "settings", "catagories");
    const createSettingsAccessRef = doc(db, "Guilds", guild.id, "settings", "access");
    const createSettingsRolesRef = doc(db, "Guilds", guild.id, "settings", "roles");
    const createSettingsChannelsRef = doc(db, "Guilds", guild.id, "settings", "channels");
    const createfeaturesEnabledSettingsRef = doc(db, "Guilds", guild.id, "settings", "featuresEnabled");
    const createSetupRef = doc(db, "Guilds", guild.id);

    const promise1 = setDoc(createTicketStatsRef, {
        numbTicketsOpend: 0,
        numbTicketsClosed: 0,
    });

    const promise2 = setDoc(createModStatsRef, {
        bans: 0,
        kicks: 0,
        mutes: 0,
        clears: 0,
        clearMessages: 0,
    });

    const promise3 = setDoc(createSettingsCatagoriesRef, {
        ticketId: "none"
    });

    const promise4 = setDoc(createSettingsAccessRef, {
        helperTicket: false,
        moderatorBan: false
    });

    const promise5 = setDoc(createSettingsRolesRef, {
        adminRoleId: "none",
        moderatorRoleId: "none",
        helperRoleId: "none",
        mutedRoleId: "none",
        staffRoleId: "none",
    });

    const promise6 = setDoc(createSettingsChannelsRef, {
        logsId: "none"
    });

    const promise7 = setDoc(createfeaturesEnabledSettingsRef, {
        logs: false,
        tickets: true
    })

    const promise8 = setDoc(createSetupRef, {
        setup: false,
    });

    await Promise.all([promise1, promise2, promise3, promise4, promise5, promise6, promise7, promise8]).catch((error) => {
        channel.send("Error setting up database, please try again later. If this error persists, please contact the developer.")
        return console.error("Error writing document: ", error);
    });
}
