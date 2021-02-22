module.exports = (client) => {

	const updateGymCache = async () => {
		// Update Gym Cache
		try{
			return await client.gymrules.updateCache();
		}catch(e){
			throw 'Something went wrong updating gymrules cache';
		}
	}

	const updateBadgeCache = async () => {
		// Update badge cache
		try{
			return await client.badges.updateCache();
		}catch(e){
			throw 'Something went wrong updating badge cache';
		}
	}

	const updateGameInfoCache = async () => {
		// Update Game Info Cache
		try{
			await client.gameinfo.updateCache();
		}catch(e){
			throw "Failed to update Game Info cache.";
		}
	}

	client.once("ready", async () => {
		try{
			await updateBadgeCache();
			console.log("Updated Badge Cache");
			await updateGymCache();
			console.log("Updated Gym Cache");
			await updateGameInfoCache();
			console.log("Updated Game Info Cache");
		}catch(e){
			console.error(e);
		}finally{
			console.log(`${client.user.tag} is online!`);
		}
	});

	client.setInterval(async () => {
		try{
			await updateBadgeCache();
			console.log("Updated Badge Cache");
			await updateGymCache();
			console.log("Updated Gym Cache");
			await updateGameInfoCache();
			console.log("Updated Game Info Cache");
		}catch(e){
			console.error(e);
		}
	}, 21600000);

	client.on("guildMemberAdd", async (member) => {
		let joinMessage = ["Please leave your soul at the door, LowRes will come to collect it later.", "Be sure to leave a tribute to appease the glitch gods!", "Don't ask the humble merchant about the monkey's paw, he's out of stock!", "Please don't clap your hands thinking it'll rain. That stopped working after Gen 5.", "If you don't pick Moo Moo Meadows, you're against freedom."]
		let channel = member.guild.systemChannel;
		if(channel){
			channel.send(`Welcome ${member} to ${member.guild.name}! ${joinMessage[Math.floor(Math.random()*joinMessage.length)]}`, {
				files: [{
					attachment: `./Images/Banner.png`,
					name: `Banner.png`
				}]
			}).catch(err => console.log(err));
		}
	})

	const checkMember = async (member) => {
		let memberRole = member.guild.roles.cache.find(r => r.name === "Members");
		if(member.roles.cache.has(memberRole.id)){
			return;
		}
		if(memberRole){
			member.roles.add(memberRole.id).catch(err => {});
		}
		return;
	}

	client.on("message", async (message) => {
		if(message.channel.type === "dm") return;
		if(message.author.bot){
			return;
			// let currentMember = message.guild.members.cache.find(member => member.user.tag === message.author.username);
			// if(currentMember){
			// 	message.author = currentMember.user;
			// 	message.member = currentMember;
			// }else{
			// 	return;
			// }
		}
		checkMember(message.member);
		for(let i = 0; i < client.bannedWords.length; i++){
			if(message.content.toLowerCase().includes(client.bannedWords[i])){
				message.delete();
				return message.author.send("We don't use those words on this server (If this was on accident, please message Hotdog)");
			}
		}

		if(message.content === "update cache" && message.author.id === client.config.botowner){
			// Update Gym Cache
			try{
				await client.gymrules.updateCache();
				message.channel.send("Updated Gym Cache");
			}catch(e){
				message.channel.send('Something went wrong updating gymrules cache');
				console.error(e);
			}
			
			// Update badge cache
			try{
				await client.badges.updateCache();
				message.channel.send("Updated Badge Cache");
			}catch(e){
				message.channel.send('Something went wrong updating badge cache');
				console.error(e);
			}

			// Update Game Info Cache
			try{
				await client.gameinfo.updateCache();
				message.channel.send("Updated Game Info Cache");
			}catch(e){
				message.channel.send("Failed to update Game Info cache.");
				console.error(e);
			}
		}
		
		if(/^wins:\s*[0-9]+$/gmi.test(message.content) && /^losses:\s*[0-9]+$/gmi.test(message.content) && /^total\spoints\scollected:\s*[0-9]+$/gmi.test(message.content)){
			let wins = message.content.match(/^wins:\s*[0-9]+$/gmi)[0].split(/:\s*/gmi)[1];
			let losses = message.content.match(/^losses:\s*[0-9]+$/gmi)[0].split(/:\s*/gmi)[1];
			let points = message.content.match(/^total\spoints\scollected:\s*[0-9]+$/gmi)[0].split(/:\s*/gmi)[1];
			
			let type = client.helpers.getGymType(client, message.member);
			if(type){
				try{
					await client.gymrules.updateGymStats(wins, losses, points, type, message.guild.id);
					message.channel.send('Updated gym wins-losses');
					message.react('☑️');
				}catch(e){
					console.error(e);
					message.channel.send(`Something went wrong trying to update your score, please try again later or just ask hotdog to do it for you`);
					message.react('❌');
				}
			}
		}

		let prefix = client.config.prefix;
		let messageArray = message.content.split(" ");
		let cmd = messageArray[0];
		let args = messageArray.slice(1);
		let command = client.commands.get(cmd.slice(prefix.length) || client.aliases.get(cmd.slice(prefix.length)));

		if(!command || !message.content.startsWith(prefix)){
			return;
		}
		try{
			command.run(client, message, args);
		}catch(e){
			console.log(e)
		}
	})

	client.on("messageUpdate", async (oldMessage, newMessage) => {
		for(let i = 0; i < client.bannedWords.length; i++){
			if(newMessage.content.toLowerCase().includes(client.bannedWords[i])){
				newMessage.delete();
				return newMessage.author.send("We don't use those words on this server (If this was on accident, please message Hotdog)");
			}
		}
	})

	// client.on('presenceUpdate', async (oldPresence, newPresence) => {
	// 	if(newPresence.status === 'offline'){
	// 		let guildMember = newPresence.member;
	// 		let type = client.helpers.getGymType(client, guildMember);
	// 		if(type){
	// 			let rules = await client.gymrules.getGymType(type, guildMember.guild.id);
	// 			if(rules.open){
	// 				guildMember.send('You forgot to close your gym');
	// 			}
	// 		}
	// 	}
	// })

	client.on("error", (err) => console.log(err));
	client.on("warn", (info) => console.warn(info));

	client.login(process.env.TOKEN);
}
