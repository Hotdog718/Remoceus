const { mongodb_uri } = require("../../token.json");
const mongoose = require("mongoose");
const Badges = require("../../Models/Badges.js");

module.exports = {
	name: "reset",
	aliases: [],
	category: "Gym Challenge",
	description: "Resets badges for the entire server",
	usage: "",
	permissions: ["Server Owner"],
	run: async (client, message, args) => {
		if(message.author.id !== message.guild.ownerID) return client.errors.noPerms(message, "Owner");

    message.channel.send(`You are about to revoke the badges of every member on the server, do you wish to continue? (Yes/No)`).then(m => m.delete({timeout: 60000}));
    const filter = m => m.author.id === message.author.id && (m.content.toLowerCase() === "yes" || m.content.toLowerCase() === "no");

    message.channel.awaitMessages(filter, {max: 1, time: 60000})
      .then(async collected => {
        if(collected.first().content.toLowerCase() === "yes"){
          const db = await mongoose.connect(mongodb_uri, {useNewUrlParser: true, useUnifiedTopology: true});
          await Badges.deleteMany({serverID: message.guild.id});
          db.disconnect();
          message.channel.send(`All badges on the server have been reset`);
        }
      })
      .catch(err => console.log(err))
	}
}
