const { Events} = require("discord.js");
const { getFirestore, deleteDoc, doc} = require("firebase/firestore");
const { initializeApp } = require ("firebase/app");

module.exports = {
    name: Events.GuildDelete,
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
        const deleteDocRef = doc(db, "Guilds", guild.id);

        await deleteDoc(deleteDocRef);

        console.log(`Removed ${guild.name} from the database!`)
    },
};
