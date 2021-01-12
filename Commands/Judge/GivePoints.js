const { mongodb_uri } = require("../../token.json");
const mongoose = require('mongoose');
const Badges = require('../../Models/Badges.js');

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

    if(!(message.author.id === message.guild.ownerID || (judgeRole && message.member.roles.cache.has(judgeRole.id)) || (gymLeaderRole && message.member.roles.cache.has(gymLeaderRole.id)))) return message.author.id('Only Gym Leaders or Judges can use this command').then(m => m.delete({timeout: 5000}));

    let pUser = message.mentions.users.first();
    let points = parseInt(args[1]);

    if(!pUser) return client.errors.noUser(message);
    if(!points || isNaN(points)) return message.channel.send('You must enter the number of points to give').then(m => m.delete({timeout: 5000}));

    const db = await mongoose.connect(mongodb_uri, {useNewUrlParser: true, useUnifiedTopology: true});
    let badges = await Badges.findOne({userID: pUser.id, serverID: message.guild.id});

    badges.points += Math.abs(points);
    badges.save()
          .then(() => db.disconnect())
          .then(() => message.channel.send(`Awarded ${Math.abs(points)} to ${pUser}.`))
          .then(m => m.delete({timeout: 5000}))
          .catch(err => console.log(err));
  }
}
