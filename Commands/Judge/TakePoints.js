const { mongodb_uri } = require("../../token.json");
const mongoose = require('mongoose');
const Badges = require('../../Models/Badges.js');

module.exports = {
  name: "takepoints",
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

    const db = await mongoose.connect(mongodb_uri, {useNewUrlParser: true, useUnifiedTopology: true});
    let badges = await Badges.findOne({userID: pUser.id, serverID: message.guild.id});

    badges.points -= Math.abs(points);
    if(badges.points < 0) badges.points = 0;
    const prom = badges.save();
    prom.then(() => db.disconnect());
    prom.then(() => message.react('✅'))
        .catch(console.error);
    prom.then(() => message.channel.send(`Removed ${Math.abs(points)} from ${pUser}.`))
    prom.catch(console.error);
    prom.catch((err) => message.react('❌'))
        .catch(console.error);
  }
}
