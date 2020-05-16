

module.exports = {
	toTitleCase: (word) => {
		//takes a string as an argument and returns a string (getTitleCase("hello") => returns "Hello")
		if(word.length === 0) return word;
		let wordArr = word.split(" ");
		for(let i = 0; i < wordArr.length; i++){
			wordArr[i] = wordArr[i].charAt(0).toUpperCase() + wordArr[i].substring(1).toLowerCase();
		}
		return wordArr.join(" ");
	},
	rankLinks: {
		"SS": "https://i.imgur.com/DQun29l.png",
		"S": "https://i.imgur.com/tdHZnt4.png",
		"A": "https://i.imgur.com/hCcIx73.png",
		"B": "https://i.imgur.com/Q32a9Ys.png",
		"C": "https://i.imgur.com/JFbzol2.png",
		"D": "https://i.imgur.com/TSAzjav.png",
	},
	checkGyms: (client, type, member, checkAdmin=false) => {
		return (checkAdmin && member.hasPermission("MANAGE_ROLES", false, true, true)) || (client.gymTypes.includes(type.toLowerCase()) && member.roles.cache.find(role => role.name === `${client.helpers.toTitleCase(type)} Gym Leader`))
		/*if(checkAdmin && member.hasPermission("MANAGE_ROLES", false, true, true)){
			return true;
		}else if((type === "normal" && member.roles.cache.find(role => role.name === "Normal Gym Leader"))
    || (type === "fire" && member.roles.cache.find(role => role.name === "Fire Gym Leader"))
    || (type === "water" && member.roles.cache.find(role => role.name === "Water Gym Leader"))
    || (type === "grass" && member.roles.cache.find(role => role.name === "Grass Gym Leader"))
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
		}*/
	},
	checkFrontier: (member) => {
		return member.roles.cache.find(role => role.name === "Battle Frontier") || member.hasPermission("MANAGE_ROLES", false, true, true)
	}
}
