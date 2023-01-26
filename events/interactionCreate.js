const { Events, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const { serverTimestamp } = require("firebase/firestore");
const discordTranscripts = require('discord-html-transcripts');
const { getStorage, ref, uploadBytes, getDownloadURL } = require("firebase/storage");
const { initializeApp } = require("firebase/app");

module.exports = {
  name: Events.InteractionCreate,
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
      const storage = getStorage(app);
    if(interaction.isButton()){

      const buttonId = interaction.customId;
      if(buttonId === "ticketClose" && interaction.channel.name.startsWith("ticket-") && interaction.member.permissionsIn(interaction.channel).has(PermissionFlagsBits.SendMessage)){
          const channel = interaction.channel;
          await channel.permissionOverwrites.edit(interaction.member.id, {
            SendMessages: false,
          });

          const row = new ActionRowBuilder()
              .addComponents(
                  new ButtonBuilder()
                      .setCustomId('ReopenTicket')
                      .setLabel('Reopen ticket!')
                      .setStyle(ButtonStyle.Success),
              )
              .addComponents(
                  new ButtonBuilder()
                      .setCustomId('ticketDelete')
                      .setLabel('Delete ticket!')
                      .setStyle(ButtonStyle.Danger),
              )
              .addComponents(
                  new ButtonBuilder()
                      .setCustomId('getTicketTransscript')
                      .setLabel('Get transscript!')
                      .setStyle(ButtonStyle.Primary),
              );

          await interaction.update({content: 'Ticket closed!', components: [row]})
        }
      if(buttonId === "ReopenTicket" && interaction.channel.name.startsWith("ticket-")){
            const channel = interaction.channel;
            await channel.permissionOverwrites.edit(interaction.member.id, {
                SendMessages: true,
            });

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('ticketClose')
                        .setLabel('Close ticket!')
                        .setStyle(ButtonStyle.Danger),
                );

            await interaction.update({content: 'Ticket reopened!', components: [row]})
            setTimeout(async () => {
              await interaction.editReply({content: 'Welcome to your ticket!', components: [row]})
            }, 2000);
      }
      if(buttonId === "ticketDelete" && interaction.channel.name.startsWith("ticket-")){
          await interaction.channel.delete();
      }
      if(buttonId === "getTicketTransscript" && interaction.channel.name.startsWith("ticket-")) {
          interaction.deferReply();
          const channel = interaction.channel;

          const metadata = {
              contentType: 'text/html',
          };

          const attachment = await discordTranscripts.createTranscript(channel, {
              poweredBy: false,
              saveImages: true,
              filename: `ticket ${interaction.member.id} in ${interaction.guild.name}.html`
          });

            // Create a reference
          const transscriptFileRef = ref(storage, interaction.member.id + "/" + attachment.name);
          await uploadBytes(transscriptFileRef, attachment.attachment, metadata).then(async () => {
              const url = await getDownloadURL(ref(storage, interaction.member.id + "/" + attachment.name))

              interaction.member.send({content: `Here is the transcript for this ticket: \nYou can also view it from this link: ${url}`}).then(async () => {
                  await interaction.followUp({content: `I have sent you the transcript in your DMs!`, ephemeral: true});
              }).catch(() => interaction.followUp({
                  content: `Here is the transcript for this ticket: \nYou can also view/download it from this link: ${url}`,
                  ephemeral: true
              }));
          }).catch(err => {
                return interaction.followUp({content: `Error uploading file: ${err}`, ephemeral: true})
          })




      }

    }
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`
      );
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`Error executing ${interaction.commandName}`);
      console.error(error);
    }
    },
};

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}