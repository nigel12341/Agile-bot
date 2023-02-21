const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const {initializeApp} = require("firebase/app");
const {getFirestore, doc, updateDoc, increment} = require("firebase/firestore");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Select a member and kick them.')
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription('The member to kick')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('The reason for kicking the member')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .setDMPermission(false),
    async execute(interaction) {
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
        const moderationStatsRef = doc(db, "Guilds", interaction.guild.id, "stats", "moderation");
        const target = interaction.options.getUser('target');
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('yesKickButton')
                    .setLabel('Yes!')
                    .setStyle(ButtonStyle.Danger),
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('noKickButton')
                    .setLabel('No...')
                    .setStyle(ButtonStyle.Secondary),
            );

        await interaction.reply({ content: 'Are you sure?', components: [row] , ephemeral: true,});
        const filter = i => i.customId === 'yesKickButton' || i.customId === 'noKickButton';
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

        collector.on('collect', async i => {
            if (i.customId === 'yesKickButton') {
                await i.deferUpdate();
                if(!interaction.guild.members.cache.get(target.id).kickable) return i.editReply({ content: '❎ I cannot kick this member.\nThis is possibly caused by the permissions setup incorrectly.', components: []});
                await interaction.guild.members.kick(target, interaction.options.getString('reason') || `Kicked by ${interaction.user.username}`);
                await updateDoc(moderationStatsRef, {
                    kicks: increment(1),
                });
                await i.editReply({ content: `✅ ${target.username} has been kicked.`, components: [] });
            }
            if (i.customId === 'noKickButton') {
                await i.deferUpdate();
                await i.editReply({ content: '❎ Cancelled!', components: []});
            }
        });
    },
};