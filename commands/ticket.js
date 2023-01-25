const { SlashCommandBuilder, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require("discord.js");
const { getFirestore, updateDoc, doc, increment, getDoc } = require("firebase/firestore");
const { initializeApp } = require ("firebase/app");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("tickets")
        .setDescription("ticket commands")
        .addSubcommand(subcommand =>
            subcommand
                .setName('new')
                .setDescription('Create a new ticket'))
    .setDMPermission(false),

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
        if (subcommand === 'new') {
            const docRef = doc(db, "Guilds", interaction.guild.id);
            const docSnap = await getDoc(docRef);

            const ticketCategory = docSnap.data().ticketCat;

            if(ticketCategory === "none" || ticketCategory === null || docSnap.data().staffRoleId === "none" || docSnap.data().staffRoleId === null) {
                await interaction.reply("Please set up the ticket system first by running /setup");
                return;
            } else if (interaction.guild.channels.cache.find(channel => channel.id === ticketCategory) === undefined) {
                await interaction.reply("Can not find the category, please set up the ticket system again");
                return;
            }


            const channel = await interaction.guild.channels.create({
                name: `ticket-${interaction.user.username}`,
                type: ChannelType.GuildText,
            });
            await channel.setParent(ticketCategory);

            await channel.permissionOverwrites.create(interaction.guild.id, [{
                SendMessage: false,
                ViewChannel: false,
            }]);
            await channel.permissionOverwrites.create(interaction.user, [{
                SendMessage: true,
                ViewChannel: true,
            }]);

            await channel.permissionOverwrites.create(docSnap.data().staffRoleId, [{
                SendMessage: true,
                ViewChannel: true,
            }]);

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('ticketClose')
                        .setLabel('Close ticket!')
                        .setStyle(ButtonStyle.Danger),
                );

            await channel.send({content: 'Thank you for contacting support!', components: [row]});

            interaction.reply({ content: `You can view your ticket at ${channel}`, ephemeral: true});

            const ticketsCountRef = doc(db, "Guilds", interaction.guild.id, "stats", "tickets");

            await updateDoc(ticketsCountRef, {
                numbTicketsOpend: increment(1)
            });

        }
    },
};
