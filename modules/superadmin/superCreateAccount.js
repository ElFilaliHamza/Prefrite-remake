const mongo = require("../db");
const ServerUtils = require('../ServerUtils');

const superCreateAccount = (req, res) => {
    let { type, name, username, password, charges } = req.body;

    let time = Date.now();
    let toInsert = {};
    let col;
    if (type === 'seller' || type === 'superseller') {
        col = mongo.sellers;
        toInsert = {
            ...toInsert,
            name,
            username,
            password,
            lastHandTime: time
        }
        if(type === 'seller'){
            charges = parseFloat(charges);
            if (isNaN(charges) || charges < 0) {
                return res.send({ error: true, errorMessage: 'Les charges doit etre valides!' });
            }
            toInsert.charges = charges;
        } else {
            //superseller flag
            toInsert.superSeller = true;
        }
    } else if (type === 'magasin') {
        col = mongo.magasin;
        toInsert = {
            ...toInsert,
            name,
            username,
            password,
        }
    } else if (type === 'admin') {
        col = mongo.admin;
        toInsert = {
            ...toInsert,
            name,
            username,
            password,
        }
    }
    if (col) {
        toInsert.time = time;
        col.insertOne(toInsert, (err, insertInfo) => {
            if (err || insertInfo.nInserted === 0) {
                res.send({
                    error: true,
                    errorMessage: ServerUtils.extractUniqueValues(err),
                });
            } else {
                res.send({ ok: true });
            }
        })
    }
}

module.exports = superCreateAccount;