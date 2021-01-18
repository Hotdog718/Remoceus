const { MessageEmbed } = require('discord.js');

module.exports = {
  name: "trainerbattle",
  aliases: [],
  category: "Judge",
  description: "Determines the point values from trainer battles",
  usage: "<@user1> <@user2>",
  permissions: [],
  run: async (client, message, args) => {
    let members = message.mentions.members.size > 1 ? message.mentions.members.first(2) : (message.mentions.members.size == 1 ? [message.member, message.mentions.members.first()] : '');

    if(!members || members.length < 2){
      return client.errors.noUser(message);
    }

    let member1 = members[0];
    let member2 = members[1];

    const badges1 = await client.badges.getBadges(member1.id, message.guild.id);
    const badges2 = await client.badges.getBadges(member2.id, message.guild.id);

    if(!badges1 || !badges2) return message.channel.send(`One or both of the members is not signed up for the gym challenge.`);

    let name1 = member1.nickname || member1.user.username;
    let name2 = member2.nickname || member2.user.username;
    
    const embed = new MessageEmbed()
    .setTitle(`${name1} vs ${name2}`)
    .setColor(client.config.color)
    .setThumbnail(message.guild.iconURL())
    .addField(`If ${name1} Wins`, tempName(client, name1, name2, badges1, badges2))
    .addField(`If ${name2} Wins`, tempName(client, name2, name1, badges2, badges1));
    
    message.channel.send(embed);
  }
}

function tempName(client, winnerName, loserName, winnerBadges, loserBadges){
  let pointsEarned = winnerPoints(client, winnerBadges, loserBadges);
  let pointsLost = loserPoints(winnerBadges, loserBadges);

  let arr = [];
  arr.push(`${winnerName} earns ${pointsEarned}`);
  arr.push(`${loserName} loses ${pointsLost}`);
  if(client.helpers.getClass(winnerBadges.points) !== client.helpers.getClass(winnerBadges.points + pointsEarned)){
    arr.push(`${winnerName} goes from ${client.helpers.getClass(winnerBadges.points)} to ${client.helpers.getClass(winnerBadges.points + pointsEarned)} division.`)
  }
  if(client.helpers.getClass(loserBadges.points) !== client.helpers.getClass(Math.max(loserBadges.points - pointsLost, 0))){
    arr.push(`${loserName} goes from ${client.helpers.getClass(loserBadges.points)} to ${client.helpers.getClass(Math.max(loserBadges.points - pointsLost, 0))} division.`)
  }
  return arr.join('\n');
}

function winnerPoints(client, winner, loser){
  let PD = Math.abs(winner.points - loser.points);
  if(winner.points >= loser.points){
    return Math.ceil((PD / 4) + ((10 + loser.points) * client.modifiers[winner.count]));
  }else{
    return Math.ceil((PD / 2) + ((10 + (loser.points/2)) * client.modifiers[winner.count]));
  }
}

function loserPoints(winner, loser){
  let PD = Math.abs(winner.points - loser.points);
  if(loser.points >= winner.points){
    return Math.ceil(5 + (PD / 2));
  }else{
    return Math.ceil(5 + (PD / 4));
  }
}