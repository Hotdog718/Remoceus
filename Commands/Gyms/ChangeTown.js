const Badges = require("../../Models/Badges.js");

module.exports = {
	name: "changetown",
	aliases: [],
	category: "Gyms",
	description: "Changes the hometown for the gym challenge page",
	usage: "<newTown>",
	permissions: [],
	run: async (client, message, args) => {
    if(message.deletable) message.delete();
    let townname = args.join(" ");
    let newTown = townname.replace(/[^A-Z:() ]/gi, "").trim();

    if(!newTown || newTown === "") newTown = "Location TBA";

    Badges.findOne({
      userID: message.author.id,
      serverID: message.guild.id
    }, (err, badges) => {
      if(err) console.log(err);
      if(!badges){
        message.channel.send(`You haven't registered for the gym challenge. Please use !register.`).then(m => m.delete(5000));
      }else{
        badges.hometown = newTown;
        badges.save().catch(err => console.log(err));
        message.channel.send(`You have now changed your town to ${newTown}`).then(m => m.delete(5000));
      }
    })
	}
}
