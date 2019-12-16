const Discord = require('discord.js');
const client = new Discord.Client()
const flexDiscord = require('./flex.js');
const flex = new flexDiscord(Discord ,client, "!")
const token = process.env.arcadia

client.on("ready", async () =>{
    console.log(`${client.user.username}, is online and is in ${client.guilds.size}`)
    function chaning_status() {
    let status =  ["Zayvia", `serving ${client.guilds.size}`, "Developed By Zayvia"]
    let ranomStatus = status[Math.floor(Math.random() * status.length)]
    client.user.setActivity(ranomStatus, {type: "PLAYING"});
    }
    setInterval(chaning_status, 20000)  
  })

  client.on("messageDelete", async (message) =>{
      
    let loggingEmbed = new Discord.RichEmbed()
    .setTitle("Deleted message.")
    .setColor("#RANDOM")
    .setThumbnail(message.author.avatarURL)
    .addField("Delete By:", message.author.tag)
    .addField("Deleted In:", Message.channel)
    .addField("Deleted At:", message.createdAt)
    .setFooter("The Hub");

    let logChannel = message.guild.channels.find(c => c.name === "logs")
    if(!logChannel) return;


  logChannel.send(loggingEmbed);

});

client.on('message', message =>{
    flex.rainbowRole(message, "disco");
});

client.on("raw", packet => {
// We don't want this to run on unrelated packets
if (!["MESSAGE_REACTION_ADD", "MESSAGE_REACTION_REMOVE"].includes(packet.t))
    return;
// Grab the channel to check the message from
const channel = client.channels.get(packet.d.channel_id);
// There's no need to emit if the message is cached, because the event will fire anyway for that
if (channel.messages.has(packet.d.message_id)) return;
// Since we have confirmed the message is not cached, let's fetch it
channel.fetchMessage(packet.d.message_id).then(message => {
    // Emojis can have identifiers of name:id format, so we have to account for that case as well
    const emoji = packet.d.emoji.id
    ? `${packet.d.emoji.name}:${packet.d.emoji.id}`
    : packet.d.emoji.name;
    // This gives us the reaction we need to emit the event properly, in top of the message object
    const reaction = message.reactions.get(emoji);
    // Adds the currently reacting user to the reaction's users collection.
    if (reaction)
    reaction.users.set(packet.d.user_id, client.users.get(packet.d.user_id));
    // Check which type of event it is before emitting
    if (packet.t === "MESSAGE_REACTION_ADD") {
    client.emit(
        "messageReactionAdd",
        reaction,
        client.users.get(packet.d.user_id)
    );
    }
    if (packet.t === "MESSAGE_REACTION_REMOVE") {
    client.emit(
        "messageReactionRemove",
        reaction,
        client.users.get(packet.d.user_id)
    );
    }
});
});
flex.initialize(token);
client.login(process.env.token);


