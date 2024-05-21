const mongo = require("../db");
const vendeurUtils = require("../vendeurs/vendeurUtils");
const ServerUtils = require("../ServerUtils")

const superSellersGetOne = (req, res) => {
    let { _id, startTime, endTime } = req.body;
    try {
        let mongoId = mongo.mongoID(_id);
        mongo.sellers.findOne({
            _id: mongoId,
        }, async (err, seller) => {
            if (err || !seller) {
                return res.send({
                    error: true
                })
            }
            let statsTime, statsEndTime;
            if (startTime) {
                statsTime = ServerUtils.htmlDateToTime(startTime);
                statsEndTime = ServerUtils.htmlDateToTime((endTime || startTime), false);
            } else {
                statsTime = seller.lastHandTime || seller.time;
                statsEndTime = Date.now(); //set end to today
            }
            const sellerStats = await vendeurUtils.getSoldTotal({
                _id: seller._id.toString(),
                statsTime,
                statsEndTime,
            });
            seller.sellerStats = sellerStats;
            res.send({
                seller: seller
            });
        });
    } catch (error) {
        res.send({
            error: true
        })
    }
}

module.exports = superSellersGetOne;