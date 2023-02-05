const { Events } = require("discord.js");
const {initializeApp} = require("firebase/app");
const {getFirestore, doc, onSnapshot} = require("firebase/firestore");


//TODO: wait for message content intent to work

module.exports = {
    name: Events.MessageCreate,
    once: false,
    execute(message) {
        if(message.author.bot) return;
        if(message.author.me) return;
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
        const badWordsRef = doc(db, "Guilds", message.guild.id, "settings", "badWordsFilter");

        onSnapshot(badWordsRef, (doc) => {
            if(!doc.exists()) return;
            if(doc.data().toggle === false) return;
            const badWords = doc.data().badWords;
            if(badWords === undefined || badWords.length === 0) return;
            if(badWords.includes(message.content.toLowerCase())) {
                message.reply("Please don't use bad words.");
                message.delete();
            }
        });
    },
};
