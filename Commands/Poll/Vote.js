
module.exports = {
  name: "vote",
  aliases: [],
  category: "Poll",
  description: "Submits a vote on a poll (Voting for the same option twice removes your vote)",
  usage: "<A-Z>",
  permissions: [],
  run: async (client, message, args) => {
    let vote = args.length > 0 ? args[0].toUpperCase() : null;
    if(!vote) return message.channel.send("Enter a value from A-Z");
    let responses = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    if(!responses.includes(vote)) return message.channel.send("Enter a valid vote");
    let poll = client.polls.get(message.channel.id);
    if(!poll) return message.channel.send("There is no poll for this channel, make sure you're in the right channel");
    if(!poll[vote]) return message.channel.send("Enter a valid vote");

    // Check for if the user has already voted, and if so, remove the vote;
    if(!poll.multipleVotes){
      for(let i = 0; i < responses.length; i++){
        let res = responses[i];
        if(!poll[res]) continue;
        if(res != vote && poll[res].voters.includes(message.author.id)){
          poll[res].voters.splice(poll[res].voters.indexOf(message.author.id), 1);
        }
      }
    }

    if(!poll[vote].voters.includes(message.author.id)){
      poll[vote].voters.push(message.author.id);
    }else{
      poll[vote].voters.splice(poll[vote].voters.indexOf(message.author.id), 1);
    }
    poll.update(client, message.channel);
  }
}
