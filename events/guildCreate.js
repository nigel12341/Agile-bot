const { Events } = require("discord.js");
const { getFirestore, collection, setDoc, doc, increment, updateDoc} = require("firebase/firestore");
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
            ticketCat: "none",
        });

        const createDocumentRef = doc(db, "Guilds", guild.id, "stats", "tickets");

        await setDoc(createDocumentRef, {
            numbTicketsOpend: 0,
            numbTicketsClosed: 0,
        });

    },
};
