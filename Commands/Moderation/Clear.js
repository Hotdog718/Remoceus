
module.exports = {
  name: "clear",
  aliases: [],
  category: "Moderation",
  description: "Clears up to 100 messages at a time",
  usage: "<number between 0 and 100>",
  permissions: ["Manage Messages"],
  run: async (client, message, args) => {
    if(message.deletable) message.delete();
    if(!message.member.hasPermission("MANAGE_MESSAGES", {checkOwner: true, checkAdmin: true})) return client.errors.noPerms(message,"Manage Messages");
    if(!args[0] || isNaN(args[0])) return message.channel.send("You need to enter a number.");
    if(args[0]>100) return message.channel.send("Cannot delete more than 100 messages at a time.");
    if(args[0]<=0) return message.channel.send("Must enter a number greater than 0.");
    message.channel.bulkDelete(args[0], true)
                   .then(messages => message.channel.send(`Cleared ${messages.size} messages`))
                   .then(msg => msg.delete({timeout: 5000}).catch(err => {}));
  }
}
