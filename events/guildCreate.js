const { Events, ChannelType } = require("discord.js");
const { getFirestore, setDoc, doc} = require("firebase/firestore");
const { initializeApp } = require ("firebase/app");

module.exports = {
    name: Events.GuildCreate,
    async execute(guild) {
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

        await setDoc(doc(db, "Guilds", guild.id), {
            ticketCat: null,
            setup: false,
            prefix: "/",
            staffRoleId: null,
            adminRoleId: null,
            moderatorRoleId: null
        });

        const createDocumentRef = doc(db, "Guilds", guild.id, "stats", "tickets");

        await setDoc(createDocumentRef, {
            numbTicketsOpend: 0,
            numbTicketsClosed: 0,
        });

        const channel = guild.channels.cache.find(
            (c) => c.type === ChannelType.GuildText && c.permissionsFor(guild.members.me).has("SEND_MESSAGES")
        );
        // Do something with the channel

        if(channel){
            channel.send("Thanks for adding me to your server! To get started, use the /setup command in a channel. Please note this is required for the bot to function correctly! \n If you need help, use the /help command. \nIf you have already had this bot in the past you need to set it up again.")
        } else {
            console.log(`No channel found to send message to in ${guild.name}!`)
        }

    },
};
