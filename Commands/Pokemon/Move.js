
const Pokemon = require("../../Utils/Pokemon.js");
const { RichEmbed } = require("discord.js");

module.exports = {
  name: "move",
  aliases: [],
  category: "Pokemon",
  description: "Pulls up pokemon move information",
  usage: "<move name>",
  permissions: [],
  run: async (client, message, args) => {
    if(message.deletable) message.delete();
    let move = args.join("").split("-").join("").toLowerCase().trim();
    if(!move) return message.channel.send("No arguments").then(m => m.delete(5000));
    let MoveInfo = Pokemon.MoveInfo[move];
    if(!MoveInfo) return message.channel.send(`Could not find ${args.join(" ")}.`).then(m => m.delete(5000));
    let url = `https://www.serebii.net/pokedex-bw/type/${MoveInfo.type.toLowerCase()}.gif`;

    let embed = new RichEmbed()
    .setTitle(`${MoveInfo.name} Info`)
    .setThumbnail(url)
    .setColor(Pokemon.TypeColors[MoveInfo.type])
    .setDescription(MoveInfo.shortDesc? MoveInfo.shortDesc: (MoveInfo.desc? MoveInfo.desc: "No Description Given"));
    let items = await getBasicInfo(MoveInfo);
    let keys = Object.keys(items);
    for(let i = 0; i<keys.length; i++){
      embed.addField(keys[i], items[keys[i]], true);
    }
    message.channel.send(embed);
  }
}

async function getBasicInfo(moveinfo){
  let info = {};
  let checks = [
    {
      item:"basePower",
      func:(item) => {
        return [`Power`, item];
      }
    },
    {
      item: "accuracy",
      func: (item) => {
        if(item.toString() === "true"){
          return ["Accuracy","Guarenteed Hit"];
        }else{
          return [`Accuracy`,`${item}%`];
        }
      }
    },
    {
      item: "category",
      func: (cat) => {
        return ["Category", cat];
      }
    },
    {
      item:"pp",
      func: (pp) => {
        let minpp = pp;
        let maxpp = pp+((pp/5)*3);
        return ["PP",`${minpp>=5?`${minpp}PP to ${maxpp}PP`: `${minpp}PP`}`];
      }
    },
    {
      item: "priority",
      func: (priority) => {
        return [`Priority`,priority];
      }
    },
    {
      item: "zMovePower",
      func: (power) => {
        return ["Z-Move Power",power];
      }
    }
  ]
  for(let i = 0; i<checks.length; i++){
    if(moveinfo.hasOwnProperty(checks[i].item)){
      info[checks[i].func(moveinfo[checks[i].item])[0]] = checks[i].func(moveinfo[checks[i].item])[1];
    }
  }
  return info;
}
