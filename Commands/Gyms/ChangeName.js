const Badges = require("../../Models/Badges.js");

module.exports = {
	name: "changename",
	aliases: [],
	category: "Gyms",
	description: "",
	usage: "<new name>",
	permissions: [],
	run: async (client, message, args) => {
		if(message.deletable) message.delete();
    if(args.length <= 0) return message.channel.send("Please enter a new name.").then(m => m.delete(5000));
    let newName = args.join(" ");

    Badges.findOne({
      userID: message.author.id,
      serverID: message.guild.id
    }, (err, badges) => {
      if(err) console.log(err);
      if(!badges){
        message.channel.send(`You haven't registered for the gym challenge. Please use !register.`).then(m => m.delete(5000));
      }else{
        badges.name = newName;
        badges.save().catch(err => console.log(err));
        message.channel.send(`You have now changed your name to ${newName}`).then(m => m.delete(5000));
      }
    })
	}
}
