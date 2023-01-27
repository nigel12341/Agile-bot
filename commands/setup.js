const { SlashCommandBuilder, ChannelType } = require("discord.js");
const {initializeApp} = require("firebase/app");
const {getFirestore, doc, writeBatch} = require("firebase/firestore");

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
      .addBooleanOption(option =>
          option.setName('moderation')
              .setDescription('Enable moderation features')
              .setRequired(true))
      .addBooleanOption(option =>
          option.setName('automod')
              .setDescription('Enable automod features')
              .setRequired(true))
      .addBooleanOption(option =>
          option.setName('enablelogs')
              .setDescription('Enable logs')
              .setRequired(true))
      .addBooleanOption(option =>
          option.setName('tickets')
              .setDescription('Enable tickets')
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
    const moderation = interaction.options.getBoolean("moderation");
    const automod = interaction.options.getBoolean("automod");
    const enablelogs = interaction.options.getBoolean("enablelogs");
    const tickets = interaction.options.getBoolean("tickets");

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
    const createSettingsFeaturesRef = doc(db, "Guilds", interaction.guild.id, "settings", "featuresEnabled");
    const createSetupRef = doc(db, "Guilds", interaction.guild.id);

    // Get a new write batch
    const batch = writeBatch(db);

    batch.update(createSettingsCatagoriesRef, {
        ticketId: ticketcategory.id
    });

    batch.update(createSettingsAccessRef, {
        helperTicket: allowHelpersInTickets,
        moderatorBan: allowModeratorToBan
    });

    batch.update(createSettingsRolesRef, {
        adminRoleId: adminRole.id,
        moderatorRoleId: moderatorRole.id,
        helperRoleId: helperRole.id,
        mutedRoleId: muteRole.id,
        staffRoleId: staffRole.id,
    });

    batch.update(createSettingsChannelsRef, {
        logsId: logs.id
    });

    batch.update(createSetupRef, {
        setup: true,
    });

    batch.update(createSettingsFeaturesRef, {
        moderation: moderation,
        automod: automod,
        logs: enablelogs,
        tickets: tickets
    });

    await batch.commit();
}
