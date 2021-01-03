
module.exports = {
	name: "weather",
	aliases: [],
	category: "Fun",
	description: "Get the weather from your best friend, Politoed!",
	usage: "",
	permissions: [],
	run: async (client, message, args) => {
		message.channel.createWebhook('Politoed', {
			avatar: 'https://i.imgur.com/CDAvMyH.png',
			reason: 'Weather Report'
		})
		.then(async wb => {
			 await wb.send(`It\'s raining, with a ${Math.floor(Math.random()*100) + 1}% chance of rain!`);
			 return wb.delete();
		})
		.catch(err => console.log(err));
	}
}
