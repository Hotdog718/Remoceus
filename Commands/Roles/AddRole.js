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
    if(!message.member.hasPermission("MANAGE_ROLES", {checkOwner: true, checkAdmin: true})) return message.channel.send("You do not have permission for this.").then(m => m.delete({timeout: 5000}))

    // Get role
    let role = message.mentions.roles.first();
    if(!role) return message.channel.send("You must provide a role").then(m => m.delete({timeout: 5000}));

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
      newAssignableRoles.save()
                        .then(() => db.disconnect())
                        .then(() => message.channel.send(`Added ${role.name} to assignable role list!`))
                        .then(m => m.delete({timeout: 5000}))
                        .catch(err => console.log(err))
    }else{
      assignableRoles.roles[role.name.toLowerCase()] = {
        id: role.id,
        description: description
      }
      assignableRoles.markModified('roles')
      assignableRoles.save()
                     .then(() => db.disconnect())
                     .then(() => message.channel.send(`Added ${role.name} to assignable role list!`))
                     .then(m => m.delete({timeout: 5000}))
                     .catch(err => console.log(err))
    }
  }
}
