const { SlashCommandBuilder, ChannelType } = require("discord.js");
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
        .addSubcommand(subcommand =>
            subcommand
                .setName('close')
                .setDescription('Close open ticket'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('setup')
                .setDescription('Setup ticket system by entering the category id')
                .addStringOption(option =>
                    option.setName('categoryid')
                        .setDescription('Category to create tickets in')
                        .setRequired(true)))
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
            // Your web app's Firebase configuration

            const docRef = doc(db, "Guilds", interaction.guild.id);
            const docSnap = await getDoc(docRef);

            const ticketCategory = docSnap.data().ticketCat;

            if(ticketCategory === "none") {
                await interaction.reply("Please set up the ticket system first");
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

            await channel.send('Thank you for contacting support!');

            interaction.reply({ content: `You can view your ticket at ${channel}`, ephemeral: true});



            const ticketsCountRef = doc(db, "Guilds", interaction.guild.id, "stats", "tickets");

            await updateDoc(ticketsCountRef, {
                numbTicketsOpend: increment(1)
            });

        }
        else if (subcommand === 'close') {
            const channel = interaction.channel;
            if (channel.name.startsWith('ticket-')) {
                await channel.delete();
                interaction.reply('Ticket closed!');

                const ticketsCountRef = doc(db, "Guilds", interaction.guild.id, "stats", "tickets");

                await updateDoc(ticketsCountRef, {
                    numbTicketsClosed: increment(1)
                })
            } else {
                interaction.reply('You can only close ticket channels!');
            }
        }
    },
};
