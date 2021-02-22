const mongo = require('./Mongo.js');
const Roles = require('./Models/AssignableRoles.js');

const cache = {} // {serverID: roles}

module.exports.getRoles = async (serverID) => {
    if(cache[serverID]){
        return cache[serverID];
    }
    return await mongo().then(async (mongoose) => {
        try {
            const result = await Roles.findOne({serverID});

            if(result){
                cache[serverID] = {
                    serverID: serverID,
                    roles: result.roles
                }
                return result;
            }
        } finally {
            mongoose.connection.close();
        }
    })
}

module.exports.addRole = async(serverID, rolename, roleInfo) => {
    return await mongo().then(async (mongoose) => {
        try {
            const result = await Roles.findOne({serverID});

            if(result){
                result.roles[rolename] = roleInfo;
                result.markModified('roles');
                return await result.save().then(() => {
                    cache[serverID] = {
                        serverID: serverID,
                        roles: result.roles
                    }
                });
            }else{
                const newRoles = new Roles({
                    serverID: serverID,
                    roles: {}
                });
                newRoles.roles[rolename] = roleInfo;
                return await newRoles.save().then(() => {
                    cache[serverID] = {
                        serverID: serverID,
                        roles: result.roles
                    }
                });
            }
        } finally {
            mongoose.connection.close();
        }
    })
}

module.exports.removeRole = async (serverID, rolename) => {
    return await mongo().then(async (mongoose) => {
        try {
            const result = await Roles.findOne({serverID});

            if(result && (rolename in result.roles)){
                delete result.roles[rolename];
                result.markModified('roles');
                return await result.save().then(() => {
                    cache[serverID] = {
                        serverID: serverID,
                        roles: result.roles
                    }
                });
            }
        } finally {
            mongoose.connection.close();
        }
    })
}

module.exports.updateCache = async () => {
    return await mongo().then(async (mongoose) => {
        try{
            const results = Roles.find();
            if(results){
                for(const result of results){
                    cache[result.serverID] = {
                        serverID: result.serverID,
                        roles: result.roles
                    }
                }
            }
        }finally{
            mongoose.connection.close();
        }
    })
}