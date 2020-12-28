const { MessageEmbed } = require("discord.js");

module.exports = (client) => {
  let help = new MessageEmbed()
  .setTitle("Assignable Roles")
  .setThumbnail(client.user.displayAvatarURL)
  .setColor(client.config.color)
  .addField("Doubles", "Receive pings when players want double battles.")
  .addField("FFAs", "Receive pings when players want FFA battles.")
  .addField("Gym Challenger", "Receive pings when gyms open up.")
  .addField("Multi", "Receive pings when players want multi battles.")
  .addField("Singles", "Receive pings when players want single battles.")
  .addField("Smash", "Receive pings from players wanting to smash.")
  .addField("Spoilers", "Lets you see the spoilers channel.");
  return help;
}
