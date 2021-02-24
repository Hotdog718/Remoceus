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

    await message.guild.members.fetch();

    let badgeArray = await client.badges.getAllBadges(message.guild.id);
    badgeArray = badgeArray.filter(value => {
			const member = message.guild.members.cache.get(value.userID);
			if(!member) return false;
			return true;
		})

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
  let rankWin = client.helpers.getRanking(message, winnerBadges, badgeArray);
  let rankLoser = client.helpers.getRanking(message, loserBadges, badgeArray);
  
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

  let rankWinPost = getWinnerRanking(message, WinnerTemp, loserTemp, badgeArray);
  let rankLoserPost = getLoserRanking(message, WinnerTemp, loserTemp, badgeArray);

  if(rankWinPost && rankWin !== rankWinPost){
    arr.push(`${winnerName} goes from #${rankWin} to #${rankWinPost}`);
  }

  if(rankLoserPost && rankLoser !== rankLoserPost){
    arr.push(`${loserName} goes from #${rankLoser} to #${rankLoserPost}`);
  }

  return arr.join('\n');
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

function getWinnerRanking(message, winnerPoints, loserPoints, pointsArray){
  const isWinner = (user) => winnerPoints.userID == user.userID && winnerPoints.serverID == user.serverID;
  const isLoser = (user) => loserPoints.userID == user.userID && loserPoints.serverID == user.serverID;
      
  const badgeArray = pointsArray.filter(value => {
    const member = message.guild.members.cache.get(value.userID);
    if(!member) return false;
    return true;
  })
  .sort((a, b) => {
    let aPoints = (isWinner(a) ? winnerPoints.points : (isLoser(a) ? loserPoints.points : a.points));
    let bPoints = (isWinner(b) ? winnerPoints.points : (isLoser(b) ? loserPoints.points : b.points));
    return bPoints - aPoints;
  })

  let ranking = 1;
  for(let i = 0; i < badgeArray.length; i++){
    if(i > 0){
      let a = badgeArray[i];
      let b = badgeArray[i-1];

      let aPoints = (isWinner(a) ? winnerPoints.points : (isLoser(a) ? loserPoints.points : a.points));
      let bPoints = (isWinner(b) ? winnerPoints.points : (isLoser(b) ? loserPoints.points : b.points));

      if(bPoints > aPoints) ranking++;
    }
    if(winnerPoints.userID === badgeArray[i].userID && winnerPoints.serverID === badgeArray[i].serverID) break;
  }
  return ranking;
}

function getLoserRanking(message, winnerPoints, loserPoints, pointsArray){
  const isWinner = (user) => winnerPoints.userID == user.userID && winnerPoints.serverID == user.serverID;
  const isLoser = (user) => loserPoints.userID == user.userID && loserPoints.serverID == user.serverID;
      
  const badgeArray = pointsArray.filter(value => {
    const member = message.guild.members.cache.get(value.userID);
    if(!member) return false;
    return true;
  })
  .sort((a, b) => {
    let aPoints = (isWinner(a) ? winnerPoints.points : (isLoser(a) ? loserPoints.points : a.points));
    let bPoints = (isWinner(b) ? winnerPoints.points : (isLoser(b) ? loserPoints.points : b.points));
    return bPoints - aPoints;
  });

  let ranking = 1;
  for(let i = 0; i < badgeArray.length; i++){
    if(i > 0){
      let a = badgeArray[i];
      let b = badgeArray[i-1];

      let aPoints = (isWinner(a) ? winnerPoints.points : (isLoser(a) ? loserPoints.points : a.points));
      let bPoints = (isWinner(b) ? winnerPoints.points : (isLoser(b) ? loserPoints.points : b.points));

      if(bPoints > aPoints) ranking++;
    }
    if(loserPoints.userID === badgeArray[i].userID && loserPoints.serverID === badgeArray[i].serverID) break;
  }
  return ranking;
}