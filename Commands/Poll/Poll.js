const { MessageEmbed } = require('discord.js');

module.exports = {
  name: "poll",
  aliases: [],
  category: "Poll",
  description: "Displays a poll",
  usage: "<question>? <response>, <response>, <response>...",
  permissions: ["Manage Channels"],
  run: async (client, message, args) => {
    if(!message.member.hasPermission("MANAGE_CHANNELS", {checkAdmin: true, checkOwner: true})){
      message.channel.send("Sorry, but you do not have permission to use this command").then(m => m.delete({timeout: 5000}));
      return;
    }
    let argString = args.join(" ");
    let argsArray = argString.split(/\?\s/);
    let question = argsArray[0];
    let answerString = argsArray[1];
    let answerArray = answerString.split(/,\s/g);
    //answerArray[answerArray.length - 1] = answerArray[answerArray.length - 1].substring(0, answerArray[answerArray.length - 1].length - 1);

    if(!question || answerArray.length <= 0) return message.channel.send("Not enough arguments").then(m => m.delete({timeout: 5000}));
    if(answerArray >= 25) return message.channel.send("Sorry, a max of 24 responses are allowed.").then(m => m.delete({timeout: 5000}));

    let responses = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    let poll = {};
    poll.question = question;
    //create client.polls object for current channel
    for(let i = 0; i < answerArray.length; i++)
    {
      poll[responses[i]] = {
        response: answerArray[i],
        voters: []
      }
    }

    const filter = m => m.author.id === message.author.id && (m.content.toLowerCase() == "yes" || m.content.toLowerCase() == "no");
    message.channel.send("Allow for multiple responses? Yes or No (Multiple responses means that users can vote on multiple options rather than one) (Defaults to No after 10 seconds)").then(m => m.delete({timeout: 10000}));
    let collected = await message.channel.awaitMessages(filter, {max: 1, time: 10000});
    poll.multipleVotes = collected.size > 0 && collected.first().content.toLowerCase() === "yes";
    let embed = new MessageEmbed()
    .setTitle("Poll")
    .setThumbnail(message.guild.iconURL())
    .setColor(client.config.color)
    .addField("Question:", question)
    .setFooter(`To vote, use the command !vote <A-Z> (ex. !vote A)`);

    for(let i = 0; i < answerArray.length; i++){
      embed.addField(`${responses[i]}: ${poll[responses[i]].response}`, `Votes: ${poll[responses[i]].voters.length}`);
    }

    let m = await message.channel.send(embed);
    poll.messageID = m.id;
    poll.update = updatePoll;

    client.polls.set(message.channel.id, poll);
  }
}

async function updatePoll(client, channel){
  let responses = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  let poll = client.polls.get(channel.id);
  let embed = new MessageEmbed()
  .setTitle("Poll")
  .setThumbnail(channel.guild.iconURL())
  .setColor(client.config.color)
  .addField("Question:", poll.question)
  .setFooter(`To vote, use the command !vote <A-Z> (ex. !vote A)`);

  for(let i = 0; i < responses.length; i++){
    if(!poll[responses[i]]) continue;
    embed.addField(`${responses[i]}: ${poll[responses[i]].response}`, `Votes: ${poll[responses[i]].voters.length}`);
  }
  let mID = poll.messageID;
  let m = await channel.messages.fetch(mID);
  if(m) m.edit(embed);
}
