const mongo = require("../db");

const superAccess = async (req, res) => {
    //give access
    let { type, _id } = req.body;
    let route;
    try {
        if (type === "seller") {
            let toMatch = {}
            if (_id) {
                let mongoId = mongo.mongoID(_id);
                toMatch._id = mongoId;
            } else {
                toMatch.superSeller = {
                    //get first super seller
                    $exists: true,
                }
            }
            await new Promise(resolve => {
                mongo.sellers.findOne(toMatch, (err, info) => {
                    if (info) {
                        req.session.sellerId = info._id.toString();
                        //super seller session
                        req.session.superSeller = info.superSeller;
                    }
                    resolve();
                })
            })
            route = "seller";
        } else if (type === "admin") {
            let mongoId = mongo.mongoID(_id);
            await new Promise(resolve => {
                mongo.admin.findOne({
                    _id: mongoId
                }, (err, info) => {
                    if (info) {
                        req.session.admin = _id;
                    }
                    resolve();
                })
            })
            route = "admin";
        } else if (type === "magasin") {
            let mongoId = mongo.mongoID(_id);
            await new Promise(resolve => {
                mongo.magasin.findOne({
                    _id: mongoId,
                }, (err, info) => {
                    if (info) {
                        req.session.magasin = _id;
                    }
                    resolve();
                })
            })
            route = "magasin";
        }
        res.send({
            ok: true,
            route,
        });
    } catch (error) {

    }
}

module.exports = superAccess;