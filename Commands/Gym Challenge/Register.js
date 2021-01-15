module.exports = {
	name: "register",
	aliases: [],
	category: "Gym Challenge",
	description: "Sign up for the Ginune Region Gym Challenge",
	usage: "[Hometown]",
	permissions: [],
	run: async (client, message, args) => {
		let hometown = args.join(" ");
		let badges = await client.badges.getBadges(message.author.id, message.guild.id);

		if(!badges){
			await client.badges.register(message.author.id, message.guild.id, (hometown ? hometown : 'Location TBA'));
			message.channel.send(`You are now signed up for the Ginune Region Gym Challenge with a hometown of ${hometown}`);
			message.react('✅')
			.catch(console.error);
		}else{
			await client.badges.changeHometown(message.author.id, message.guild. id, (hometown ? hometown : 'Location TBA'))
			message.channel.send(`Changed hometown to ${hometown}`)
			message.react('✅')
			.catch(console.error);
		}
	}
}