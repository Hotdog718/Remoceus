const { mongodb_uri } = require("../../token.json");
const mongoose = require("mongoose");
const AssignableRoles = require("../../Models/AssignableRoles.js");

module.exports = {
  name: "removerole",
  aliases: [],
  category: "Roles",
  description: "Removes a self assignable role",
  usage: "[rolename]",
  permissions: ["Mange Roles"],
  run: async (client, message, args) => {
    if(!message.member.hasPermission("MANAGE_ROLES", {checkOwner: true, checkAdmin: true})) return message.channel.send("You do not have permission for this.");

    let roleName = args.join(" ").toLowerCase();
    if(!roleName) return message.channel.send("No role found");

    const db = await mongoose.connect(mongodb_uri, {useNewUrlParser: true, useUnifiedTopology: true});
    const assignableRoles = await AssignableRoles.findOne({serverID: message.guild.id});
    if(!assignableRoles) return message.channel.send("No data found for assignable roles");

    if(assignableRoles.roles[roleName]){
      delete assignableRoles.roles[roleName];
      assignableRoles.markModified('roles')
      assignableRoles.save()
           .then(() => db.disconnect())
           .then(() => message.channel.send(`Removed ${roleName} from assignable roles.`))
           .catch(err => console.log(err))
    }else{
      message.channel.send(`${roleName} was not a self assignable role.`);
      db.disconnect()
    }
  }
}
