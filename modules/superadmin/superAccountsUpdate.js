const mongo = require("../db");
const ServerUtils = require("../ServerUtils");

const superAccountsUpdate = (req, res) => {
    let { type, _id, name, username, password } = req.body;
    const sessionId = req.session.id;

    let toSet = {};
    if (name) {
        toSet["name"] = name;
    }

    if (username) {
        toSet["username"] = username;
    }

    if (password) {
        toSet["password"] = password;
    }

    let col;
    let logoutOthers;
    if (type === 'seller') {
        col = mongo.sellers;
    } else if (type === 'magasin') {
        col = mongo.magasin;
    } else if (type === 'admin') {
        col = mongo.admin;
    } else if (type === 'superadmin') {
        col = mongo.superadmin;
        logoutOthers = true;
    }
    if (col) {
        toSet.lastModified = Date.now();
        try {
            const mongoId = mongo.mongoID(_id);
            col.updateOne({
                _id: mongoId,
            }, {
                $set: toSet
            }, async (error, updateInfo) => {
                if (error || updateInfo.nInserted === 0) {
                    return res.send({
                        error: true,
                        errorMessage: ServerUtils.extractUniqueValues(error)
                    });
                }
                //remove sessions if username or password is changed
                if ((username || password)) {
                    const args = {
                        _id,
                        type
                    }
                    if (logoutOthers) {
                        args.logoutOthers = true;
                        args.sessionId = sessionId;
                    }
                    await ServerUtils.clearUserSessions(args);
                }
                res.send({
                    ok: true
                })
            });
        } catch (err) {
            res.send({
                error: true
            })
        }
    }

}

module.exports = superAccountsUpdate;
