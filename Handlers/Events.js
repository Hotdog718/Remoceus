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
		let channel = member.guild.systemChannel;
		if(channel){
			channel.send(`Welcome ${member} to ${member.guild.name}! Please leave your soul at the door, Lowres will come to collect it later.`).catch(err => console.log(err));
		}
		member.roles.add("791897933276250163").catch(err => {});
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
