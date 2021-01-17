const { MessageEmbed } = require('discord.js');

module.exports = {
  name: "poll",
  aliases: [],
  category: "General",
  description: "Displays a poll",
  usage: "<question>? <response>, <response>, <response>...",
  permissions: ["Manage Channels"],
  run: async (client, message, args) => {
    if(!message.member.hasPermission("MANAGE_CHANNELS", {checkAdmin: true, checkOwner: true})){
      client.errors.noPerms(message, "Manage Channels");
      return;
    }
    if(args.length < 0){
      message.channel.send("No question given, what do you expect me to do with this?");
      return;
    }
    let argString = args.join(" ");
    let argsArray = argString.split(/\?\s*/);
    let question = argsArray[0];
    let answerString = argsArray[1];
    let answerArray = answerString.split(/,\s*/g);

    if(!question || answerArray.length <= 0) return message.channel.send("Not enough arguments");
    if(answerArray >= 25) return message.channel.send("Sorry, a max of 24 responses are allowed.");

    let responses = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯', '🇰', '🇱', '🇲', '🇳', '🇴', '🇵', '🇶', '🇷', '🇸', '🇹', '🇺', '🇻', '🇼', '🇽', '🇾', '🇿'];

    let poll = {};
    poll.question = question;

    //create client.polls object for current channel
    for(let i = 0; i < answerArray.length; i++)
    {
      poll[responses[i]] = {
        response: answerArray[i]
      }
    }

    const filter = m => m.author.id === message.author.id && (m.content.toLowerCase() == "yes" || m.content.toLowerCase() == "no");
    const m = await message.channel.send("Allow for multiple responses? Yes or No (Multiple responses means that users can vote on multiple options rather than one) (Defaults to No after 10 seconds)");
    let collected = await message.channel.awaitMessages(filter, {max: 1, time: 10000});
    if(m.deletable) m.delete();
    let multipleVotes = collected.size > 0 && collected.first().content.toLowerCase() === "yes";
    if(collected.first().deletable) collected.first().delete();
    let embed = getPoll(client, message, poll);

    message.channel.send(embed).then(async msg => {
      for(let i = 0; i < answerArray.length; i++){
        await msg.react(responses[i]);
      }

      //set filter to only let only set reactions and message author to respond
			const filter = (reaction, user) => {
				return responses.includes(reaction.emoji.toString()) && user.id !== client.user.id;
			}

			//create Reaction Collector
      const collector = msg.createReactionCollector(filter, {dispose: true});
      
      collector.on('collect', async (reaction, user) => {
        if(!multipleVotes){
          const userReactions = msg.reactions.cache.filter(reaction => reaction.users.cache.has(user.id));
          if(userReactions.size <= 1){
            msg.edit(getPoll(client, msg, poll));
          }
          try {
            for (const r of userReactions.values()) {
              if(r !== reaction){
                await r.users.remove(message.author.id);
              }
            }
          } catch (error) {
            console.error('Failed to remove reactions.');
          }
        }else{
          msg.edit(getPoll(client, msg, poll));
        }
      })

      collector.on('remove', async (reaction, user) => {
        msg.edit(getPoll(client, msg, poll));
      })

      collector.on('end', collected => {});
    })
    if(message.deletable) message.delete();
  }
}

function getPoll(client, msg, poll){
  let responses = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯', '🇰', '🇱', '🇲', '🇳', '🇴', '🇵', '🇶', '🇷', '🇸', '🇹', '🇺', '🇻', '🇼', '🇽', '🇾', '🇿'];
  
  let embed = new MessageEmbed()
  .setTitle("Poll")
  .setThumbnail(msg.guild.iconURL())
  .setColor(client.config.color)
  .addField("Question:", poll.question);

  for(let i = 0; i < responses.length; i++){
    if(!poll[responses[i]]) continue;
    let reactions = msg.reactions.cache.find(r => r.emoji.toString() === responses[i]);
    if(!reactions){
      embed.addField(`${responses[i]}: ${poll[responses[i]].response}`, `Votes: 0`);
    }else{
      const userReactions = reactions.users.cache.filter(u => u.id != client.user.id);
      embed.addField(`${responses[i]}: ${poll[responses[i]].response}`, `Votes: ${userReactions.size}`);
    }
  }

  return embed;
}