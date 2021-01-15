const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "displaybadges",
	aliases: [],
	category: "Gym Challenge",
	description: "Displays who has the given types gym badge",
	usage: "<type>",
	permissions: [],
	run: async (client, message, args) => {
		const itemsPerPage = 10;
		let type = args[0]? args[0].toLowerCase(): "";
		if(!type) return client.errors.noType(message);

		if(!client.gymTypes.includes(type)) return client.errors.noType(message)
		let badges = await client.badges.getDocumentWithBadge(message.guild.id, type);

		await message.guild.members.fetch();
		badges.sort((a, b) => {
			let userA = message.guild.members.cache.get(a.userID);
			let userB = message.guild.members.cache.get(b.userID);
			let nameA = userA ? (userA.nickname || userA.user.username) : 'No User Found';
			let nameB = userB? (userB.nickname || userB.user.username) : 'No User Found';

			if(nameA.toUpperCase() > nameB.toUpperCase()){
				return 1;
			}
			if(nameA.toUpperCase() < nameB.toUpperCase()){
				return -1;
			}
			return 0;
		});

		
		client.helpers.createListEmbed(client, message, badges, itemsPerPage, getEmbed);
	}
}

function getEmbed(client, message, badges, resultsPerPage, index){
	let maxPages = Math.ceil(badges.length/resultsPerPage);
	let embed = new MessageEmbed()
	.setThumbnail(message.guild.iconURL())
	.setColor(client.config.color)
	.setFooter(`Page ${index+1} of ${maxPages}`);
	if(badges.length === 0){
		embed.setDescription("No one has earned this badge on the current server.");
	}else{
		let users = [];
		for(let i = index*resultsPerPage; i<(index+1)*resultsPerPage && i<badges.length; i++){
			let user = message.guild.members.cache.get(badges[i].userID);
			if(user){
				users.push(user.nickname || user.user.username);
			}else{
				users.push('User not found.');
			}
		}
		embed.addField('Users with the badge', users.join('\n'));
	}
	return embed;
}