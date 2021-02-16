const mongo = require('./Mongo.js');
const GymRules = require('./Models/GymRules.js');

const cache = {} // {'serverID': {'type': gymData}}

const getServerCache = async (serverID) => {
    if(!cache[serverID]){
        cache[serverID] = {};
    }
    return cache[serverID];
}

module.exports.getGymType = async (type, serverID) => {
    const cachedValue = getServerCache(serverID)[type];
    if(cachedValue){
        return cachedValue;
    }
    return await mongo().then(async (mongoose) => {
        try {
            const result = await GymRules.findOne({type, serverID});
            
            if(result){
                getServerCache(serverID);
                cache[serverID][type] = {
                    type: type,
                    serverID: serverID,
                    rules: result.rules,
                    banner: result.banner,
                    title: result.title,
                    location: result.location,
                    separateRules: result.separateRules,
                    wins: result.wins,
                    losses: result.losses,
                    points: result.points,
                    cost: result.cost,
                    open: result.open,
                    majorLeague: result.majorLeague
                }
                return result;
            }
        } finally {
            mongoose.connection.close();
        }
    })
}

module.exports.getGyms = async (serverID) => {
    if(cache[serverID]){
        let gymArray = [];
        for(const key of Object.keys(cache[serverID])){
            gymArray.push(cache[serverID][key]);
        }
        return gymArray;
    }

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
                return await result.save().then(() => {
                    getServerCache(serverID);
                    const cachedValue = getServerCache(serverID)[type];
                    if(!cachedValue){
                        cache[serverID][type] = {
                            type: type,
                            serverID: serverID,
                            rules: result.rules,
                            banner: result.banner,
                            title: result.title,
                            location: result.location,
                            separateRules: result.separateRules,
                            wins: result.wins,
                            losses: result.losses,
                            points: result.points,
                            cost: result.cost,
                            open: status,
                            majorLeague: result.majorLeague
                        }
                    }else{
                        cache[serverID][type].open = status;
                    }
                    return;
                });
            }else{
                throw 'No Document';
            }
        } finally {
            mongoose.connection.close();
        }
    })
}

module.exports.updateGymStats = async (wins, losses, points, type, serverID) => {
    return await mongo().then(async (mongoose) => {
        try{
            const result = await GymRules.findOne({type: type, serverID: serverID});

            if(result){
                result.wins = wins;
                result.losses = losses;
                result.points = points;
                
                return await result.save().then(() => {
                    getServerCache(serverID);
                    cache[serverID][type] = {
                        type: result.type,
                        serverID: result.serverID,
                        rules: result.rules,
                        banner: result.banner,
                        title: result.title,
                        location: result.location,
                        separateRules: result.separateRules,
                        wins: result.wins,
                        losses: result.losses,
                        points: result.points,
                        cost: result.cost,
                        open: result.open,
                        majorLeague: result.majorLeague
                    }
                })
            }
        } finally {
            mongoose.connection.close();
        }
    })
}

module.exports.updateCache = async () => {
    return await mongo().then(async (mongoose) => {
        try{
            const result = await GymRules.find();

            if(result){
                for(const gym of result){
                    getServerCache(gym.serverID);
                    cache[gym.serverID][gym.type] = {
                        type: gym.type,
                        serverID: gym.serverID,
                        rules: gym.rules,
                        banner: gym.banner,
                        title: gym.title,
                        location: gym.location,
                        separateRules: gym.separateRules,
                        wins: gym.wins,
                        losses: gym.losses,
                        points: gym.points,
                        cost: gym.cost,
                        open: gym.open,
                        majorLeague: gym.majorLeague
                    }
                }
            }
        } finally {
            mongoose.connection.close();
        }
    })
}