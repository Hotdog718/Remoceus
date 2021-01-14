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
    if(!message.member.hasPermission("MANAGE_ROLES", {checkOwner: true, checkAdmin: true})){
      client.error.noPerms(message, "Manage Roles");
      return;
    }

    let roleName = args.join(" ").toLowerCase();
    if(!roleName){
      message.channel.send("No role found");
      message.react('❌');
      return;
    }

    const db = await mongoose.connect(mongodb_uri, {useNewUrlParser: true, useUnifiedTopology: true});
    const assignableRoles = await AssignableRoles.findOne({serverID: message.guild.id});
    if(!assignableRoles){
      message.channel.send("No data found for assignable roles");
      message.react('❌');
      return;
    }

    if(assignableRoles.roles[roleName]){
      delete assignableRoles.roles[roleName];
      assignableRoles.markModified('roles')
      const prom = assignableRoles.save();
      prom.then(() => message.react('✅'));
      prom.then(() => db.disconnect());
      prom.then(() => message.channel.send(`Removed ${roleName} from assignable roles.`));
      prom.catch(console.error);
      prom.catch(err => message.react('❌'));
    }else{
      message.channel.send(`${roleName} was not a self assignable role.`);
      message.react('❌');
      db.disconnect();
    }
  }
}
