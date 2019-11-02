const { Attachment } = require("discord.js");

module.exports = {
	name: "flip",
	aliases: [],
	category: "Fun",
	description: "Flips a coin",
	usage: "",
	permissions: [],
	run: async (client, message, args) => {
		if(message.deletable) message.delete();
		let leFlip = Math.round(Math.random());
		if(leFlip === 1){
			let attachment = new Attachment("./Images/Coin Heads.png");
			message.channel.send("You got heads", attachment);
		}else{
			let attachment = new Attachment("./Images/Coin Tails.png");
			message.channel.send("You got tails", attachment);
		}
	}
}
