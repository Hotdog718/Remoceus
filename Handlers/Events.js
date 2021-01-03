const token = require("../token.json")

module.exports = (client) => {

	client.on("ready", () => {
		console.log(`${client.user.tag} is online!`);
		client.user.setPresence({
			status: "online",
			activity: {
				name: "!help or !help list"
			}
		})
	});

	client.on("guildMemberAdd", async (member) => {
		let joinMessage = ["Please leave your soul at the door, LowRes will come to collect it later.", "Be sure to leave a tribute to appease the glitch gods!", "Don't ask the humble merchant about the monkey's paw, he's out of stock!", "Please don't clap your hands thinking it'll rain. That stopped working after Gen 5.", "If you don't pick Moo Moo Meadows, you're against freedom."]
		let channel = member.guild.systemChannel;
		if(channel){
			channel.send(`Welcome ${member} to ${member.guild.name}! ${joinMessage[Math.floor(Math.random()*joinMessage.length)]}`).catch(err => console.log(err));
		}
		await member.guild.roles.fetch();
		let memberRole = member.guild.roles.cache.find(r => r.name === "Members");
		if(memberRole){
			member.roles.add(memberRole.id).catch(err => {});
		}
	})

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

		for(let i = 0; i < client.bannedWords.length; i++){
			if(message.content.includes(client.bannedWords[i])){
				message.delete();
				return message.author.send("We don't use those words on this server (If this was on accident, please message Hotdog)");
			}
		}

		let prefix = client.config.prefix;
		let messageArray = message.content.split(" ");
		let cmd = messageArray[0];
		let args = messageArray.slice(1);
		let command = client.commands.get(cmd.slice(prefix.length) ||client.aliases.get(cmd.slice(prefix.length)));
		if(!command || !message.content.startsWith(prefix)){
			return;
		}
		try{
			command.run(client, message, args);
		}catch(e){
			console.log(e)
		}
	})

	client.on("error", (err) => console.log(err));
	client.on("warn", (info) => console.warn(info));

	client.login(token.token);
}
