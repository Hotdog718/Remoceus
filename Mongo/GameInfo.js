const mongo = require('./Mongo.js');
const GameInfo = require('./Models/FC.js');

const cache = {} // {'userID' : {fc: String, ign: String}}

module.exports.getGameInfo = async (userID) => {
    const cachedValue = cache[userID];
    if(cachedValue){
        return cachedValue;
    }
    return await mongo().then(async (mongoose) => {
        try {
            const result = await GameInfo.findOne({userID});

            if(result){
                cache[userID] = {
                    userID: userID,
                    fc: result.fc,
                    ign: result.ign
                };
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
                return await result.save().then(() => {
                    const cachedValue = cache[userID];
                    if(!cachedValue){
                        cache[userID] = {
                            userID: userID,
                            fc: fc,
                            ign: result.ign
                        }
                    }else{
                        cache[userID].fc = fc;
                    }
                    return;
                });
            }else{
                return await new GameInfo({
                    userID: userID,
                    fc: fc,
                    ign: "No IGN set, use !setign <ign> to set your ign (ex. !setign John)"
                }).save().then(() => {
                    const cachedValue = cache[userID];
                    if(!cachedValue){
                        cache[userID] = {
                            userID: userID,
                            fc: fc,
                            ign: "No IGN set, use !setign <ign> to set your ign (ex. !setign John)"
                        };
                    }else{
                        cache[userID].fc = fc;
                    }
                    return;
                });
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
                return await result.save().then(() => {
                    const cachedValue = cache[userID];
                    if(!cachedValue){
                        cache[userID] = {
                            userID: userID,
                            fc: result.fc,
                            ign: ign
                        }
                    }else{
                        cache[userID].ign = ign;
                    }
                    return;
                });
            }else{
                return await new GameInfo({
                    userID: userID,
                    fc: "No FC set, use !setfc <fc> to set your fc (ex. !setfc 1234-5678-9012)",
                    ign: ign
                }).save().then(() => {
                    const cachedValue = cache[userID];
                    if(!cachedValue){
                        cache[userID] = {
                            userID: userID,
                            fc: "No FC set, use !setfc <fc> to set your fc (ex. !setfc 1234-5678-9012)",
                            ign: ign
                        }
                    }else{
                        cache[userID].ign = ign;
                    }
                    return;
                });
            }
        } finally {
            mongoose.connection.close();
        }
    })
}