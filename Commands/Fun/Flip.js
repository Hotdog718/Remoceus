module.exports = {
	name: "flip",
	aliases: [],
	category: "Fun",
	description: "Flips a coin",
	usage: "",
	permissions: [],
	run: async (client, message, args) => {
		if(message.deletable) message.delete();
		let leFlip = Math.round(Math.random()) == 1 ? "Heads" : "Tails";

		message.channel.send(`You got a ${leFlip}.`, {
			files: [{
				attachment: `./Images/Coin ${leFlip}.png`,
				name: `Coin ${leFlip}.png`
			}]
		})
	}
}
