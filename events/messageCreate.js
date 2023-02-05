const { Events } = require("discord.js");

//TODO: wait for message content intent to work

module.exports = {
    name: Events.MessageCreate,
    once: false,
    execute(message) {
        if(message.author.bot) return;
        if(message.author.me) return;
        message.reply(`Message content: ${message}`);
        console.log(message)
    },
};
