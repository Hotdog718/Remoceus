const { MessageEmbed } = require("discord.js");

module.exports = (client) => {
  let help = new MessageEmbed()
  .setTitle("Assignable Roles")
  .setThumbnail(client.user.displayAvatarURL)
  .setColor(client.config.color)
  .addField("Spoilers", "Lets you see the spoilers channel");
  return help;
}
