
module.exports = {
  name: "deletepoll",
  aliases: [],
  category: "Poll",
  description: "Deletes the poll for the current channel (Deletes the message associated with the poll as well)",
  usage: "",
  permissions: ["Manage Channels"],
  run: async (client, message, args) => {
    if(message.deletable) message.delete();

    if(!message.member.hasPermission("MANAGE_CHANNELS", {checkAdmin: true, checkOwner: true})){
      message.channel.send("Sorry, but you do not have permission to use this command").then(m => m.delete({timeout: 5000}));
      return;
    }

    let poll = client.polls.get(message.channel.id);
    if(!poll) return message.channel.send("There is no poll for this channel, make sure you're in the right channel").then(m => m.delete({timeout: 5000}));

    let m = await message.channel.messages.fetch(poll.messageID);
    if(!m) return;

    if(m.deletable) m.delete();

    client.polls.delete(message.channel.id);
  }
}
