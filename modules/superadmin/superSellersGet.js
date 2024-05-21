const mongo = require("../db");
const vendeurUtils = require("../vendeurs/vendeurUtils");
const ServerUtils = require("../ServerUtils")

const superSellersGet = (req, res) => {
    //stats
    let { startTime, endTime } = req.body;
    const pipline = [
        {
            $sort: {
                time: -1
            }
        }
    ];
    mongo.sellers.aggregate(pipline, async (err, sellers) => {
        if (err) {
            return res.send({
                error: true
            })
        }
        for (let seller of sellers) {
            let statsTime, statsEndTime;
            if(startTime){
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
                getDebit: true
            });
            seller.sellerStats = sellerStats;
        }
        res.send({
            sellers: sellers
        });
    });
}

module.exports = superSellersGet;