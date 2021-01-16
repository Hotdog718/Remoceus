const mongo = require('./Mongo.js');
const GymRules = require('./Models/GymRules.js');

module.exports.getGymType = async (type, serverID) => {
    return await mongo().then(async (mongoose) => {
        try {
            const result = await GymRules.findOne({type, serverID});
            
            if(result){
                return result;
            }
        } finally {
            mongoose.connection.close();
        }
    })
}

module.exports.getGyms = async (serverID) => {
    return await mongo().then(async (mongoose) => {
        try{
            const result = await GymRules.find({serverID});
            
            if(result){
                return result;
            }
        } finally {
            mongoose.connection.close();
        }
    })
}

module.exports.setGymStatus = async (type, serverID, status) => {
    return await mongo().then(async (mongoose) => {
        try{
            const result = await GymRules.findOne({type: type, serverID: serverID});
            if(result){
                result.open = status;
                return await result.save();
            }else{
                throw 'No Document';
            }
        } finally {
            mongoose.connection.close();
        }
    })
}