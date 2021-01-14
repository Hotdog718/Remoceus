const { MessageEmbed } = require("discord.js");
const { mongodb_uri } = require("../../token.json");
const mongoose = require("mongoose");
const AssignableRoles = require("../../Models/AssignableRoles.js");

module.exports = {
  name: "iam",
  aliases: [],
  category: "Roles",
  description: "Adds a role to the user",
  usage: "[rolename]",
  permissions: [],
  run: async (client, message, args) => {
    let rolename = args.join(" ");
    const db = await mongoose.connect(mongodb_uri, {useNewUrlParser: true, useUnifiedTopology: true});
    const assignableRoles = await AssignableRoles.findOne({serverID: message.guild.id});
    db.disconnect();

    if(!assignableRoles){
      message.channel.send("No self assignable roles found");
      message.react('❌');
      return;
    }

    let helpEmbed = require("../../Utils/iamroles.js")(client, message.guild, assignableRoles.roles);
    if(!rolename){
      return message.channel.send(helpEmbed);
    }

    let assignableRole = assignableRoles.roles[rolename.toLowerCase()];
    if(!assignableRole) return message.channel.send(helpEmbed);
    let role = message.guild.roles.cache.get(assignableRole.id);
    if(!role) return message.channel.send(`Could not find ${role.name} role`);
    const prom = message.member.roles.add(role)
    prom.then(() => message.react('✅'));
    prom.then(r => message.channel.send(`Added ${role.name} role to ${message.author.tag}`));
    prom.catch(err => message.channel.send(`Failed to add ${role.name} role to ${message.author.tag}`));
    prom.catch(err => message.react('❌'));
  }
}
