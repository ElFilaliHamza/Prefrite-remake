const mongo = require("../db");

const superSellersUpdateCharges = (req, res) => {
    let { _id, newCharges } = req.body;
    newCharges = parseFloat(newCharges);
    if (isNaN(newCharges) || newCharges < 0) {
        return res.send({ error: true })
    }
    try {
        let mongoId = mongo.mongoID(_id);
        mongo.sellers.updateOne({
            _id: mongoId,
        }, {
            $set: {
                charges: newCharges
            }
        }, async (err, updateInfo) => {
            if (err) {
                return res.send({
                    error: true
                })
            }
            res.send({
                ok: true
            });
        });
    } catch (error) {
        res.send({
            error: true
        })
    }
}

module.exports = superSellersUpdateCharges;