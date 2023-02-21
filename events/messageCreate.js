const { Events } = require("discord.js");
const {initializeApp} = require("firebase/app");
const {getFirestore, doc, getDoc} = require("firebase/firestore");

module.exports = {
    name: Events.MessageCreate,
    once: false,
    async execute(message) {
        if (message.author.bot) return;
        if (message.author.me) return;
        if(message.channel.type === "DM") return;
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
        await checkBadWords(message, db);
        await checkQuestions(message, db);
    },
};

async function checkBadWords(message, db) {

    const badWordsRef = doc(db, "Guilds", message.guild.id, "settings", "badWordsFilter");

    const badWords = await getDoc(badWordsRef);
    const badWordsList = badWords.data().badWords;

    if (!badWords.exists()) return;
    if (badWords.data().toggle === false) return;
    if (badWordsList === undefined || badWordsList.length === 0) return;
    if (badWordsList.includes(message.content.toLowerCase())) {
        message.channel.send({
            content: `Please don't use bad words ${message.author}!`});
        message.delete();
    }
}
async function checkQuestions(message, db) {
    const questionsRef = doc(db, "Guilds", message.guild.id, "settings", "autoAnswer");

    const questions = await getDoc(questionsRef);
    const badWordsList = badWords.data().badWords;

    if (!badWords.exists()) return;
    if (badWords.data().toggle === false) return;
    if (badWordsList === undefined || badWordsList.length === 0) return;
    if (badWordsList.includes(message.content.toLowerCase())) {
        message.channel.send({
            content: `Please don't use bad words ${message.author}!`});
        message.delete();
    }
}
