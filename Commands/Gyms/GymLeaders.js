const { MessageEmbed, Message, GuildMemberManager } = require('discord.js');

module.exports = {
	name: "gymleaders",
	aliases: [],
	category: "Gyms",
	description: "Displays the Gym Leaders of each type.",
	usage: "",
	permissions: [],
	run: async (client, message, args) => {
		await message.guild.members.fetch();
        await message.guild.roles.fetch();

        const embed = new MessageEmbed()
        .setTitle(`Gym Leaders of ${message.guild.name}`)
        .setColor(client.config.color)
        .setThumbnail(message.guild.iconURL());

		let types = Object.keys(client.config.gymTypes);

        const leaderRole = message.guild.roles.cache.find(r => r.name === 'Gym Leaders');
        const subRole = message.guild.roles.cache.find(r => r.name === 'Gym Subs');
        if(leaderRole && subRole){
            for(const type of types){
                const gymType = client.config.gymTypes[type];
                const typeRole = message.guild.roles.cache.find(r => r.name === `${gymType.name} Gym Leader`);
                if(!typeRole) continue;
                const gymLeaders = message.guild.members.cache.filter(member => member.roles.cache.has(typeRole.id) && member.roles.cache.has(leaderRole.id));
                const gymSubs = message.guild.members.cache.filter(member => member.roles.cache.has(typeRole.id) && member.roles.cache.has(subRole.id));
                const unknown = message.guild.members.cache.filter(member => member.roles.cache.has(typeRole.id) && !(member.roles.cache.has(leaderRole.id) || member.roles.cache.has(subRole.id)));
                let str = ``;
                if(gymLeaders && gymLeaders.array().length > 0){
                    str += `**Gym Leader(s):**\n${Array.from(gymLeaders.array(), x => `${x.user.tag} (${x})`).join('\n')}\n`;
                }
                if(gymSubs && gymSubs.array().length > 0){
                    str += `**Gym Sub(s):**\n${Array.from(gymSubs.array(), x => `${x.user.tag} (${x})`).join('\n')}`;
                }
                if(unknown && unknown.array().length > 0){
                    str += `**Unknown:**\n${Array.from(unknown.array(), x => `${x.user.tag} (${x})`).join('\n')}`;
                }
                if(str){
                    embed.addField(`__${gymType.name}__`, str, true);
                }
            }
        }else{
            embed.addField("No Gym Leaders/Subs");
        }

        message.channel.send(embed);
	}
}
