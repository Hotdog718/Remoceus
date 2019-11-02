const FC = require("../../Models/FC.js");
const { RichEmbed } = require("discord.js");

module.exports = {
	name: "fc",
	aliases: [],
	category: "Game Info",
	description: "Displays yours or other peoples FC",
	usage: "none or <@user>",
	permissions: [],
	run: async (client, message, args) => {
    if(message.deletable) message.delete();
    let leUser = message.guild.member(message.mentions.users.first()) || message.guild.members.find(member => member.user.username === args.join(" ")) || message.member;

    FC.findOne({
      userID: leUser.id
    }, (err, fc) => {
      if(err) console.log(err);
      let embed = new RichEmbed()
      .setTitle(`${leUser.user.username}\'s FC and IGN`)
      .setColor(client.config.color)
      .setThumbnail(leUser.user.displayAvatarURL)
      .addField("FC", fc? fc.fc: "No FC set, use !setfc <fc> to set your fc (ex. !setfc 3883-7141-8049)")
      .addField("IGN", fc? fc.ign: "No IGN set, use !setign <ign> to set your ign (ex. !setign Thot Slayer)");

      message.channel.send(embed);
    })
	}
}
