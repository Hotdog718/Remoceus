const mongo = require('./Mongo.js');
const GameInfo = require('./Models/FC.js');

module.exports.getGameInfo = async (userID) => {
    return await mongo().then(async (mongoose) => {
        try {
            const result = await GameInfo.findOne({userID});

            if(result){
                return result;
            }
        } finally {
            mongoose.connection.close();
        }
    })
}

module.exports.setFC = async(userID, fc) => {
    return await mongo().then(async (mongoose) => {
        try {
            const result = await GameInfo.findOne({userID});

            if(result){
                result.fc = fc;
                return await result.save();
            }else{
                return await new GameInfo({
                    userID: userID,
                    fc: fc,
                    ign: "No IGN set, use !setign <ign> to set your ign (ex. !setign John)"
                }).save();
            }
        } finally {
            mongoose.connection.close();
        }
    })
}

module.exports.setIGN = async (userID, ign) => {
    return await mongo().then(async (mongoose) => {
        try {
            const result = await GameInfo.findOne({userID});

            if(result){
                result.ign = ign;
                return await result.save();
            }else{
                return await new GameInfo({
                    userID: userID,
                    fc: "No FC set, use !setfc <fc> to set your fc (ex. !setfc 1234-5678-9012)",
                    ign: ign
                }).save();
            }
        } finally {
            mongoose.connection.close();
        }
    })
}