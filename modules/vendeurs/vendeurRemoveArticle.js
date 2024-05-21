const mongo = require("../db");

module.exports = function vendeurRemoveArticle(req, res) {
    let { sellerId, _id } = req.body;
    let mongoId = mongo.mongoID(_id);

    mongo.arts.findOne({
        _id: mongoId
    }, (err, info) => {

        let oldSellerQt;
        if(info.vendeurs && info.vendeurs[sellerId]){
            oldSellerQt = info.vendeurs[sellerId].qt;
        } else {
            oldSellerQt = 0;
        }

        let toSet = {};
        //return the seller qt to article qt
        toSet['qtStocke'] = info.qtStocke + oldSellerQt;
        toSet['lastModified'] = Date.now();

        let toUnset = {};
        toUnset[`vendeurs.${sellerId}`] = true;

        mongo.arts.updateOne({
            _id: mongoId
        }, {
            $set: toSet,
            $unset: toUnset
        }, (err, updateInfo) => {
            res.send({
                ok: true,
            })
        })
    })
}
