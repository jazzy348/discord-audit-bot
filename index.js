const { Client, GatewayIntentBits, Collection, Events, Partials, EmbedBuilder } = require('discord.js');
const config = require('./config.json');

// Add needed intents and partials for reactions
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setStatus("online");
    client.user.setActivity("to wubz", { type: "LISTENING" });
});

client.on('messageDelete', async message => {
  if (!message.guildId || message.author?.bot) return;

  const logChannel = message.guild.channels.cache.get(config.loggingChannelId);
  if (!logChannel) return console.log("Log channel not found: " + config.loggingChannelId);

  const embed = new EmbedBuilder()
    .setTitle("Message Deleted")
    .addFields(
      { name: "Author", value: `${message.author.tag}` },
      { name: "Channel", value: `${message.channel}` },
      { name: 'Content', value: message.content || "" }
    )
    .setTimestamp()
    .setColor('Red');
  
    logChannel.send({ embeds: [embed] });

});

client.on('messageUpdate', async (oldMessage, newMessage) => {
  if (!oldMessage.guild || oldMessage.author?.bot) return;

  if (oldMessage.content === newMessage.content) return;

  const logChannel = oldMessage.guild.channels.cache.get(config.loggingChannelId);
  if (!logChannel) return console.log("Log channel not found: " + config.loggingChannelId);

  const embed = new EmbedBuilder()
    .setTitle("Message Updated")
    .addFields(
      { name: "Author", value: `${newMessage.author.tag}` },
      { name: "Channel", value: `${newMessage.channel}` },
      { name: "Before", value: `${oldMessage.content}` || "" },
      { name: "After", value: `${newMessage.content}` || "" }
    )
    .setTimestamp()
    .setColor('Yellow');

    logChannel.send({ embeds: [embed] });
})


client.login(config.discordToken);