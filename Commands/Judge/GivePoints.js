module.exports = {
  name: "givepoints",
  aliases: [],
  category: "Judge",
  description: "Gives points to a trainer (Does not work on the gyms)",
  usage: "<@user> <# of points>",
  permissions: ["Judge"],
  run: async (client, message, args) => {
    let judgeRole = message.guild.roles.cache.find(r => r.name === 'Battle Judge');
    let gymLeaderRole = message.guild.roles.cache.find(r => r.name === "Gym Leaders")

    if(!(message.author.id === message.guild.ownerID || (judgeRole && message.member.roles.cache.has(judgeRole.id)) || (gymLeaderRole && message.member.roles.cache.has(gymLeaderRole.id)))){
      message.channel.send('Only Gym Leaders or Judges can use this command');
      message.react('❌')
						 .catch(console.error);
      return;
    }

    let pUser = message.mentions.users.first();
    let points = parseInt(args[1]);

    if(!pUser){
      client.errors.noUser(message);
      return;
    }
    if(!points || isNaN(points)){
      message.channel.send('You must enter the number of points to give');
      message.react('❌')
						 .catch(console.error);
      return;
    }

    const badges = await client.badges.getBadges(pUser.id, message.guild.id);

    if(!badges){
      message.channel.send(`${pUser} is not registered for the gym challenge, use !register [hometown] to sign up!`);
      message.react('❌')
      .catch(console.error);
      return;
    }

    await client.badges.givePoints(pUser.id, message.guild.id, Math.abs(points));
    message.channel.send(`Awarded ${Math.abs(points)} to ${pUser}.`);
    message.react('✅')
    .catch(console.error);
  }
}
