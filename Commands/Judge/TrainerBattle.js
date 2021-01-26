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

    const badgeArray = await client.badges.getAllBadges(message.guild.id);
    
    const embed = new MessageEmbed()
    .setTitle(`${name1} vs ${name2}`)
    .setColor(client.config.color)
    .setThumbnail(message.guild.iconURL())
    .addField(`If ${name1} Wins`, tempName(client, message, name1, name2, badges1, badges2, badgeArray))
    .addField(`If ${name2} Wins`, tempName(client, message, name2, name1, badges2, badges1, badgeArray));
    
    message.channel.send(embed);
  }
}

function tempName(client, message, winnerName, loserName, winnerBadges, loserBadges, badgeArray){
  let rankWin = client.helpers.getRanking(winnerBadges, badgeArray);
  let rankLoser = client.helpers.getRanking(loserBadges, badgeArray);
  
  let pointsEarned = winnerPoints(client, winnerBadges, loserBadges, rankWin, rankLoser);
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
  let WinnerTemp = {
    userID: winnerBadges.userID,
    serverID: winnerBadges.serverID,
    points: winnerBadges.points + pointsEarned
  }
  let loserTemp = {
    userID: loserBadges.userID,
    serverID: loserBadges.serverID,
    points: Math.max((loserBadges.points - pointsLost), 0)
  }
  let {rankWinPost, rankLoserPost} = getUpdatedRankings(message, WinnerTemp, loserTemp, badgeArray);
  if(rankWinPost && rankWin != rankWinPost){
    arr.push(`${winnerName} goes from #${rankWin} to #${rankWinPost}`);
  }

  if(rankLoserPost && rankLoser != rankLoserPost){
    arr.push(`${loserName} goes from #${rankLoser} to #${rankLoserPost}`);
  }

  return arr.join('\n');
}

function getUpdatedRankings(message, user1, user2, arr){
  const isUser = (user, check) => user.userID == check.userID && user.serverID == check.serverID;
  const getPoints = (check) => isUser(user1, check) ? user1.points : (isUser(user2, check) ? user2.points : check.points);

  arr.sort((a, b) => {
    let aPoints = getPoints(a);
    let bPoints = getPoints(b);
    if(aPoints > bPoints){
      return -1;
    }
    if(a.points < b.points){
      return 1;
    }
    if(a.count == b.count){
      let aUser = message.guild.members.cache.get(a.userID);
      let bUser = message.guild.members.cache.get(b.userID);
      let aName = aUser ? aUser.user.username : "User not found";
      let bName = bUser ? bUser.user.username : "User not found";
      if(aName > bName){
        return 1;
      }
      if(aName < bName){
        return -1;
      }
      return 0;
    }
    return b.count - a.count;
  })

  let ranking = 1;
  let obj = {};
  for(let i = 0; i < arr.length; i++){
    if(i > 0 && getPoints(arr[i-1]) > getPoints(arr[i])) ranking++;
    if(user1.userID == arr[i].userID && user1.serverID == arr[i].serverID){
      obj.rankWinPost = ranking;
    }
    if(user2.userID == arr[i].userID && user2.serverID == arr[i].serverID){
      obj.rankLoserPost = ranking;
    }
  }
  return obj;
}

function winnerPoints(client, winner, loser, rankWin, rankLoser){
  let PD = Math.abs(winner.points - loser.points);
  let RD = Math.abs(rankWin-rankLoser);
  if(winner.points > loser.points){
    return Math.ceil(((PD/4)/RD + (1000 + (loser.points/4)/RD)) * client.modifiers[winner.count]);
  }else{
    return Math.ceil((PD/4 + (1000 + loser.points/4)) * client.modifiers[winner.count]);
  }
}

function loserPoints(winner, loser){
  let PD = Math.abs(winner.points - loser.points);
  if(loser.points >= winner.points){
    return Math.ceil(5 + (PD / 4));
  }else{
    return Math.ceil(5 + (PD / 8));
  }
}