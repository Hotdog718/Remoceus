

module.exports = {
	noUser: (message) => {
		message.channel.send("No user found").then(m => m.delete({timeout: 5000}));
	},
	noPerms: (message, perm) => {
		message.channel.send(`Missing Permission: ${perm}`).then(m = m.delete({timeout: 5000}));
	},
	noType: (message) => {
		message.channel.send("Could not find gym type").then(m => m.delete({timeout: 5000}));
	},
	checkGyms: (type, member, checkAdmin=false) => {
		if(checkAdmin && member.hasPermission("MANAGE_ROLES", false, true, true)){
			return true;
		}else if((type === "normal" && member.roles.cache.find(role => role.name === "Normal Gym Leader"))
    || (type === "fire" && member.roles.cache.find(role => role.name === "Fire Gym Leader"))
    || (type === "water" && member.roles.cache.find(role => role.name === "Water Gym Leader"))
    || (type === "Grass" && member.roles.cache.find(role => role.name === "Grass Gym Leader"))
    || (type === "electric" && member.roles.cache.find(role => role.name === "Electric Gym Leader"))
    || (type === "flying" && member.roles.cache.find(role => role.name === "Flying Gym Leader"))
    || (type === "bug" && member.roles.cache.find(role => role.name === "Bug Gym Leader"))
    || (type === "ghost" && member.roles.cache.find(role => role.name === "Ghost Gym Leader"))
    || (type === "poison" && member.roles.cache.find(role => role.name === "Poison Gym Leader"))
    || (type === "psychic" && member.roles.cache.find(role => role.name === "Psychic Gym Leader"))
    || (type === "dragon" && member.roles.cache.find(role => role.name === "Dragon Gym Leader"))
    || (type === "dark" && member.roles.cache.find(role => role.name === "Dark Gym Leader"))
    || (type === "rock" && member.roles.cache.find(role => role.name === "Rock Gym Leader"))
    || (type === "ground" && member.roles.cache.find(role => role.name === "Ground Gym Leader"))
    || (type === "fairy" && member.roles.cache.find(role => role.name === "Fairy Gym Leader"))
    || (type === "ice" && member.roles.cache.find(role => role.name === "Ice Gym Leader"))
    || (type === "fighting" && member.roles.cache.find(role => role.name === "Fighting Gym Leader"))
    || (type === "steel" && member.roles.cache.find(role => role.name === "Steel Gym Leader"))){
			return true;
		}else{
			return false;
		}
	},
	checkFrontier: (member) => member.roles.cache.find(role => role.name === "Battle Frontier") || member.hasPermission("MANAGE_ROLES", false, true, true)
}
