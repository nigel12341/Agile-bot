const { SlashCommandBuilder, PermissionsBitField} = require("discord.js");
const {initializeApp} = require("firebase/app");
const {getFirestore, doc, getDoc, arrayUnion, updateDoc, setDoc, arrayRemove} = require("firebase/firestore");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("settings")
        .setDescription("Change bot settings!")
        .addSubcommand(subcommand =>
            subcommand.setName("badwords")
                .setDescription("Change the bad words list.")
                .addStringOption(option =>
                    option.setName("add-remove")
                        .setDescription("Add or remove a word from the list.")
                        .setRequired(true)
                        .addChoices(
                            {name: "Add", value: "add"},
                                    {name: "Remove", value: "remove"}
                        ))
                .addStringOption(option =>
                    option.setName("word")
                        .setDescription("The word to add or remove.")
                        .setRequired(true)
                        .setMinLength(2)
                        .setMaxLength(30)))
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionsBitField.ManageGuild),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
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

        if(subcommand === "badwords") {
            const addRemove = interaction.options.getString("add-remove");
            const word = interaction.options.getString("word");
            const settingsBadWordsFilter = doc(db, "Guilds", interaction.guild.id, "settings", "badWordsFilter");
            const docSnap = await getDoc(settingsBadWordsFilter);
            const badWords = docSnap.data().badWords;

            if(addRemove === "add") {
                if(badWords === undefined || badWords.length === 0) {
                    await setDoc(settingsBadWordsFilter, {
                        badWords: arrayUnion(word)
                    })
                    await interaction.reply(`${word} added to the list.`);
                } else {
                    if(badWords.includes(word)) {
                        return await interaction.reply("This word is already in the list.");
                    } else {
                        await updateDoc(settingsBadWordsFilter, {
                            badWords: arrayUnion(word)
                        })
                        await interaction.reply(`${word} added to the list.`);
                    }
                }
            }
            if(addRemove === "remove") {
                if(badWords === undefined || badWords.length === 0) {
                    return await interaction.reply("The list is empty.");
                } else {
                    if(badWords.includes(word)) {
                        await updateDoc(settingsBadWordsFilter, {
                            badWords: arrayRemove(word)
                        })
                        await interaction.reply(`${word} removed from the list.`);
                    } else {
                        return await interaction.reply("This word is not in the list.");
                    }
                }
            }
        }
    }
};
