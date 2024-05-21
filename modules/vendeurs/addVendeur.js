const mongo = require("../db");
const ServerUtils = require("../ServerUtils");

module.exports = function addVendeur(req, res) {
    let { name, phone, username, password } = req.body;

    if(!name || !phone || !username || !password){
        return res.send({
            error: true,
            errorMessage: `Tous les champs sont requis`,
        });
    }

    mongo.sellers.insertOne({
        name,
        phone,
        username,
        password: password,
        time: Date.now()
    }, (error, insertInfo) => {
        if(error || insertInfo.nInserted === 0){
            return res.send({
                error: true,
                errorMessage: ServerUtils.extractUniqueValues(error)
            });
        }
        res.send({
            _id: insertInfo._id,
            name: insertInfo.name,
            username: insertInfo.username,
            phone: insertInfo.phone,
            ok: true
        })
    });
}

