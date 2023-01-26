const { SlashCommandBuilder, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require("discord.js");
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
                .setName('add')
                .setDescription('Adds a user to the ticket')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('User to add')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('remove a user to the ticket')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('User to remove')
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
        const docRef = doc(db, "Guilds", interaction.guild.id);
        const docSnap = await getDoc(docRef);

        if (subcommand === 'new') {
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
                parent: ticketCategory,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: [PermissionsBitField.Flags.ViewChannel],
                    },
                    {
                        id: interaction.user.id,
                        allow: [PermissionsBitField.Flags.ViewChannel],
                    },
                    {
                        id: docSnap.data().staffRoleId,
                        allow: [PermissionsBitField.Flags.ViewChannel],
                    }
                ],
            });

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
        if (subcommand === 'add') {
            const user = interaction.options.getUser('user');
            const channel = interaction.channel;

            if (channel.parentId === docSnap.data().ticketCat && channel.name.startsWith('ticket-')) {
                await channel.permissionOverwrites.create(user, {
                    ViewChannel: true,
                    SendMessages: true,
                    AttachFiles: true,
                    ReadMessageHistory: true,
                });
                await interaction.reply(`Added ${user} to the ticket`);
            } else {
                await interaction.reply("This command can only be used in a ticket");
            }
        }
        if (subcommand === 'remove') {
            const user = interaction.options.getUser('user');
            const channel = interaction.channel;

            if (channel.parentId === docSnap.data().ticketCat && channel.name.startsWith('ticket-')) {
                await channel.permissionOverwrites.create(user, {
                    ViewChannel: false,
                    SendMessages: false,
                    AttachFiles: false,
                    ReadMessageHistory: false,
                });
                await interaction.reply(`Removed ${user.username} to the ticket`);
            } else {
                await interaction.reply("This command can only be used in a ticket");
            }
        }
    },
};
