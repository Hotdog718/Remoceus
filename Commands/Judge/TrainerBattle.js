const { mongodb_uri } = require("../../token.json");
const mongoose = require('mongoose');
const Badges = require('../../Models/Badges.js');
const { MessageEmbed } = require('discord.js');

module.exports = {
  name: "trainerbattle",
  aliases: [],
  category: "Judge",
  description: "Determines the point values from trainer battles",
  usage: "<@user1> <@user2>",
  permissions: [],
  run: async (client, message, args) => {
    let members = message.mentions.members.first(2);
    if(!members || members.length < 2) return client.errors.noUser(message);
    let member1 = members[0];
    let member2 = members[1];

    const db = await mongoose.connect(mongodb_uri, {useNewUrlParser: true, useUnifiedTopology: true});
    const badges1 = await Badges.findOne({userID: member1.id, serverID: message.guild.id});
    const badges2 = await Badges.findOne({userID: member2.id, serverID: message.guild.id});
    db.disconnect();

    if(!badges1 || !badges2) return message.channel.send(`One or both of the members is not signed up for the gym challenge.`);

    let name1 = member1.nickname || member1.user.username;
    let name2 = member2.nickname || member2.user.username;

    let PD = Math.abs(badges1.points - badges2.points);

    const embed = new MessageEmbed()
    .setTitle(`${name1} vs ${name2}`)
    .setColor(client.config.color)
    .setThumbnail(message.guild.iconURL())
    .addField(`If ${name1} Wins`, `${name1} earns ${(badges1.points >= badges2.points) ? Math.ceil(10 + ((PD/4)+(PD*client.modifiers[badges1.count]))) : Math.ceil(10 + ((PD/2)+(PD*client.modifiers[badges1.count])))}\n${name2} loses ${(badges2.points >= badges1.points) ? Math.ceil((5 + PD/2)) : Math.ceil((5+(PD/4)))}`)
    .addField(`If ${name2} Wins`, `${name2} earns ${(badges2.points >= badges1.points) ? Math.ceil(10 + ((PD/4)+(PD*client.modifiers[badges2.count]))) : Math.ceil(10 + ((PD/2)+(PD*client.modifiers[badges2.count])))}\n${name1} loses ${(badges1.points >= badges2.points) ? Math.ceil((5 + PD/2)) : Math.ceil((5+(PD/4)))}`);

    message.channel.send(embed);
  }
}
