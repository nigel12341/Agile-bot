const { Events, ChannelType } = require("discord.js");
const { getFirestore, setDoc, doc} = require("firebase/firestore");
const { initializeApp } = require ("firebase/app");

module.exports = {
    name: Events.GuildCreate,
    async execute(guild) {
        const channel = guild.channels.cache.find(
            (c) => c.type === ChannelType.GuildText && c.permissionsFor(guild.members.me).has("SEND_MESSAGES")
        );
        // Do something with the channel
        await setupDatabase(guild, channel);
        if(channel){
            channel.send("Thanks for adding me to your server! **To get started, use the /setup command in a channel.** Please note this is required for the bot to function correctly! \nIf you need help, use the /help command. \nIf you have already had this bot in the past you still need to set it up again.")
        } else {
            console.log(`No channel found to send message to in ${guild.name}!`)
        }

    },
};

async function setupDatabase(guild, channel) {
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
