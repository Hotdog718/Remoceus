

module.exports = {
	getTitleCase: (word) => {
		//takes a string as an argument and returns a string (getTitleCase("hello") => returns "Hello")
		if(word.length === 0) return word;
		return `${word.substring(0,1).toUpperCase()}${word.substring(1).toLowerCase()}`;
	},
	rankLinks: {
		"SS": "https://i.imgur.com/DQun29l.png",
		"S": "https://i.imgur.com/tdHZnt4.png",
		"A": "https://i.imgur.com/hCcIx73.png",
		"B": "https://i.imgur.com/Q32a9Ys.png",
		"C": "https://i.imgur.com/JFbzol2.png",
		"D": "https://i.imgur.com/TSAzjav.png",
	}
}
