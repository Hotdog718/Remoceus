const { mongodb_uri } = require("../../token.json");
const mongoose = require("mongoose");
const AssignableRoles = require("../../Models/AssignableRoles.js");

module.exports = {
  name: "addrole",
  aliases: [],
  category: "Roles",
  description: "Adds a new self assignable role",
  usage: "<@role> <description>",
  permissions: ["Mange Roles"],
  run: async (client, message, args) => {
    // Check user permissions
    if(!message.member.hasPermission("MANAGE_ROLES", {checkOwner: true, checkAdmin: true})){
      client.errors.noPerms(message, "Manage Roles");
      return;
    }

    // Get role
    let role = message.mentions.roles.first();
    if(!role){
      message.channel.send("You must provide a role");
      message.react('❌')
						 .catch(console.error);
      return;
    }

    // Get description
    let description = args.slice(1).join(" ") || "";

    // Connect to database
    const db = await mongoose.connect(mongodb_uri, {useNewUrlParser: true, useUnifiedTopology: true});
    const assignableRoles = await AssignableRoles.findOne({serverID: message.guild.id});
    if(!assignableRoles){
      const newAssignableRoles = new AssignableRoles({
        serverID: message.guild.id,
        roles: {}
      })
      newAssignableRoles.roles[role.name.toLowerCase()] = {
        id: role.id,
        description: description
      }
      const prom = newAssignableRoles.save()
      prom.then(() => message.react('✅'))
				.catch(console.error);
      prom.then(() => db.disconnect());
      prom.then(() => message.channel.send(`Added ${role.name} to assignable role list!`));
      prom.catch(console.error);
      prom.catch(err => message.react('❌'));
    }else{
      assignableRoles.roles[role.name.toLowerCase()] = {
        id: role.id,
        description: description
      }
      assignableRoles.markModified('roles')
      const prom = assignableRoles.save();
      prom.then(() => message.react('✅'))
				.catch(console.error);
      prom.then(() => db.disconnect());
      prom.then(() => message.channel.send(`Added ${role.name} to assignable role list!`));
      prom.catch(console.error);
      prom.catch(err => message.react('❌'));
    }
  }
}
