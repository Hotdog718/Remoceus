const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "mute",
  aliases: [],
  category: "Moderation",
  description: "Mutes a user",
  usage: "<@user>",
  permissions: ["Manage Roles"],
  run: async (client, message, args) => {
    let tomute = message.guild.member(message.mentions.users.first());
    if(!tomute){
      client.errors.noUser(message);
      message.react('❌')
						 .catch(console.error);
      return;
    }
    if(!message.member.hasPermission("MANAGE_ROLES", {checkOwner: true, checkAdmin: true})){
      client.errors.noPerms(message, "Manage Roles");
      message.react('❌')
						 .catch(console.error);
      return;
    }
    
    let muterole = message.guild.roles.cache.find(role => role.name === client.config.muteRole);

    if(!muterole){
      message.channel.send("No \"Timeout\" role");
      message.react('❌')
						 .catch(console.error);
      return;
    }

    let mutechannel = message.guild.channels.cache.find(channel => channel.name === client.config.logsChannel) || message.channel;

    let muteEmbed = new MessageEmbed()
    .setDescription("Temp Mute")
    .setColor(client.config.color)
    .addField("Muted User", `${tomute} with ID: ${tomute.id}`)
    .addField("Muted By",`${message.author} with ID: ${message.author.id}`);

    const prom = tomute.roles.add(muterole)
    prom.then(() => message.channel.send(`${tomute.user.tag} has been muted`));
    prom.then(() => mutechannel.send(muteEmbed))
        .catch(console.error);
    prom.then(() => message.react('✅'))
				.catch(console.error);
    prom.catch(err => message.channel.send("I'm sorry, but I was unable to mute this user."));
    prom.catch((err) => message.react('❌'))
				.catch(console.error);
  }
}
