const Mongo = require('./Mongo.js');
const Badges = require('./Models/Badges.js');

let cache = {} // {'serverID-userID' : badgeData}

module.exports.getBadges = async (userID, serverID) => {
    const cachedValue = cache[`${serverID}-${userID}`];
    if(cachedValue){
        return cachedValue;
    }
    return await Mongo().then(async (mongoose) => {
        try {
            const result = await Badges.findOne({userID: userID, serverID: serverID});

            if(result){
                cache[`${serverID}-${userID}`] = {
                    userID: result.userID,
                    serverID: result.serverID,
                    bug: result.bug,
                    dark: result.dark,
                    dragon: result.dragon,
                    electric: result.electric,
                    fairy: result.fairy,
                    fighting: result.fighting,
                    fire: result.fire,
                    flying: result.flying,
                    ghost: result.ghost,
                    grass: result.grass,
                    ground: result.ground,
                    ice: result.ice,
                    normal: result.normal,
                    poison: result.poison,
                    psychic: result.psychic,
                    rock: result.rock,
                    steel: result.steel,
                    water: result.water,
                    count: result.count,
                    hometown: result.hometown,
                    points: result.points
                }
                return result;
            }
        } finally {
            mongoose.connection.close();
        }
    })
}

module.exports.getDocumentWithBadge = async (serverID, type) => {
    return await Mongo().then(async (mongoose) => {
        try {
            let query = {
                serverID: serverID
            }
            query[type] = true;
            const result = await Badges.find(query);

            if(result){
                return result;
            }
        } finally {
            mongoose.connection.close();
        }
    })
}

module.exports.getAllBadges = async (serverID) => {
    return await Mongo().then(async (mongoose) => {
        try {
            const result = await Badges.find({serverID: serverID});

            if(result){
                return result;
            }
        } finally {
            mongoose.connection.close();
        }
    })
}

module.exports.giveBadge = async (userID, serverID, type) => {
    return await Mongo().then(async (mongoose) => {
        try{
            const result = await Badges.findOne({userID: userID, serverID: serverID});

            if(result) {
                if(result[type]){
                    throw 'User has badge';
                }
                result[type] = true;
                result.count++;
                return await result.save().then(() => {
                    cache[`${serverID}-${userID}`] = {
                        userID: result.userID,
                        serverID: result.serverID,
                        bug: result.bug,
                        dark: result.dark,
                        dragon: result.dragon,
                        electric: result.electric,
                        fairy: result.fairy,
                        fighting: result.fighting,
                        fire: result.fire,
                        flying: result.flying,
                        ghost: result.ghost,
                        grass: result.grass,
                        ground: result.ground,
                        ice: result.ice,
                        normal: result.normal,
                        poison: result.poison,
                        psychic: result.psychic,
                        rock: result.rock,
                        steel: result.steel,
                        water: result.water,
                        count: result.count,
                        hometown: result.hometown,
                        points: result.points
                    };
                });
            }else{
                throw 'No Document';
            }
        }finally{
            mongoose.connection.close();
        }
    })
}

module.exports.takeBadge = async (userID, serverID, type) => {
    return await Mongo().then(async (mongoose) => {
        try{
            const result = await Badges.findOne({userID: userID, serverID: serverID});

            if(result) {
                if(!result[type]){
                    throw 'No badge';
                }
                result[type] = false;
                result.count--;
                return await result.save().then(() => {
                    cache[`${serverID}-${userID}`] = {
                        userID: result.userID,
                        serverID: result.serverID,
                        bug: result.bug,
                        dark: result.dark,
                        dragon: result.dragon,
                        electric: result.electric,
                        fairy: result.fairy,
                        fighting: result.fighting,
                        fire: result.fire,
                        flying: result.flying,
                        ghost: result.ghost,
                        grass: result.grass,
                        ground: result.ground,
                        ice: result.ice,
                        normal: result.normal,
                        poison: result.poison,
                        psychic: result.psychic,
                        rock: result.rock,
                        steel: result.steel,
                        water: result.water,
                        count: result.count,
                        hometown: result.hometown,
                        points: result.points
                    };
                });
            }else{
                throw 'No Document';
            }
        }finally{
            mongoose.connection.close();
        }
    })
}

module.exports.takeAllBadges = async (userID, serverID) => {
    return await Mongo().then(async (mongoose) => {
        try{
            return await Badges.findOneAndDelete({userID: userID, serverID: serverID}).then(() => {
                if(cache[`${serverID}-${userID}`]){
                    delete cache[`${serverID}-${userID}`];
                }
            });
        }finally{
            mongoose.connection.close();
        }
    })
};

module.exports.givePoints = async (userID, serverID, points) => {
    return await Mongo().then(async (mongoose) => {
        try {
            const result = await Badges.findOne({userID: userID, serverID: serverID});

            if(result){
                result.points += points;
                return await result.save().then(() => {
                    cache[`${serverID}-${userID}`] = {
                        userID: result.userID,
                        serverID: result.serverID,
                        bug: result.bug,
                        dark: result.dark,
                        dragon: result.dragon,
                        electric: result.electric,
                        fairy: result.fairy,
                        fighting: result.fighting,
                        fire: result.fire,
                        flying: result.flying,
                        ghost: result.ghost,
                        grass: result.grass,
                        ground: result.ground,
                        ice: result.ice,
                        normal: result.normal,
                        poison: result.poison,
                        psychic: result.psychic,
                        rock: result.rock,
                        steel: result.steel,
                        water: result.water,
                        count: result.count,
                        hometown: result.hometown,
                        points: result.points
                    };
                });
            }else{
                throw 'No Document';
            }
        } finally {
            mongoose.connection.close();
        }
    })
};

module.exports.takePoints = async (userID, serverID, points) => {
    return await Mongo().then(async (mongoose) => {
        try {
            const result = await Badges.findOne({userID: userID, serverID: serverID});

            if(result){
                result.points -= points;
                if(result.points < 0){
                    result.points = 0;
                }
                return await result.save().then(() => {
                    cache[`${serverID}-${userID}`] = {
                        userID: result.userID,
                        serverID: result.serverID,
                        bug: result.bug,
                        dark: result.dark,
                        dragon: result.dragon,
                        electric: result.electric,
                        fairy: result.fairy,
                        fighting: result.fighting,
                        fire: result.fire,
                        flying: result.flying,
                        ghost: result.ghost,
                        grass: result.grass,
                        ground: result.ground,
                        ice: result.ice,
                        normal: result.normal,
                        poison: result.poison,
                        psychic: result.psychic,
                        rock: result.rock,
                        steel: result.steel,
                        water: result.water,
                        count: result.count,
                        hometown: result.hometown,
                        points: result.points
                    };
                })
                .catch(e => {
                    throw 'Failed to save'
                });
            }else{
                throw 'No Document';
            }
        } finally {
            mongoose.connection.close();
        }
    })
};

module.exports.reset = async (serverID) => {
    return await Mongo().then(async (mongoose) => {
        try{
            return await Badges.deleteMany({serverID: serverID}).then(() => {
                cache = {}
            });
        }finally{
            mongoose.connection.close();
        }
    })
}

module.exports.register = async (userID, serverID, hometown) => {
    return await Mongo().then(async (mongoose) => {
        try{
            return await new Badges({
                userID: userID,
                serverID: serverID,
                bug: false,
                dark: false,
                dragon: false,
                electric: false,
                fairy: false,
                fighting: false,
                fire: false,
                flying: false,
                ghost: false,
                grass: false,
                ground: false,
                ice: false,
                normal: false,
                poison: false,
                psychic: false,
                rock: false,
                steel: false,
                water: false,
                count: 0,
                hometown: hometown,
                points: 100
            }).save().then(() => {
                cache[`${serverID}-${userID}`] = {
                    userID: userID,
                    serverID: serverID,
                    bug: false,
                    dark: false,
                    dragon: false,
                    electric: false,
                    fairy: false,
                    fighting: false,
                    fire: false,
                    flying: false,
                    ghost: false,
                    grass: false,
                    ground: false,
                    ice: false,
                    normal: false,
                    poison: false,
                    psychic: false,
                    rock: false,
                    steel: false,
                    water: false,
                    count: 0,
                    hometown: hometown,
                    points: 100
                };
            });
        }finally{
            mongoose.connection.close();
        }
    })
}

module.exports.changeHometown = async (userID, serverID, hometown) => {
    return await Mongo().then(async (mongoose) => {
        try{
            const result = await Badges.findOne({userID: userID, serverID: serverID});
            if(result){
                result.hometown = hometown;
                await result.save().then(() => {
                    cache[`${serverID}-${userID}`] = {
                        userID: result.userID,
                        serverID: result.serverID,
                        bug: result.bug,
                        dark: result.dark,
                        dragon: result.dragon,
                        electric: result.electric,
                        fairy: result.fairy,
                        fighting: result.fighting,
                        fire: result.fire,
                        flying: result.flying,
                        ghost: result.ghost,
                        grass: result.grass,
                        ground: result.ground,
                        ice: result.ice,
                        normal: result.normal,
                        poison: result.poison,
                        psychic: result.psychic,
                        rock: result.rock,
                        steel: result.steel,
                        water: result.water,
                        count: result.count,
                        hometown: result.hometown,
                        points: result.points
                    };
                });
            }
        }finally{
            mongoose.connection.close();
        }
    })
}

module.exports.updateCache = async () => {
    return await Mongo().then(async (mongoose) => {
        try {
            const result = await Badges.find();

            if(result){
                for(const badge of result){
                    cache[`${badge.serverID}-${badge.type}`] = {
                        userID: badge.userID,
                        serverID: badge.serverID,
                        bug: badge.bug,
                        dark: badge.dark,
                        dragon: badge.dragon,
                        electric: badge.electric,
                        fairy: badge.fairy,
                        fighting: badge.fighting,
                        fire: badge.fire,
                        flying: badge.flying,
                        ghost: badge.ghost,
                        grass: badge.grass,
                        ground: badge.ground,
                        ice: badge.ice,
                        normal: badge.normal,
                        poison: badge.poison,
                        psychic: badge.psychic,
                        rock: badge.rock,
                        steel: badge.steel,
                        water: badge.water,
                        count: badge.count,
                        hometown: badge.hometown,
                        points: badge.points
                    }
                }
            }
        } finally {
            mongoose.connection.close();
        }
    })
}