const mongo = require("../db");
const ServerConfig = require("../ServerConfig");
const ServerUtils = require("../ServerUtils");
const vendeurUtils = require("../vendeurs/vendeurUtils");
const sellerProject = ServerConfig.project.seller;

function paymentsHistory(req, res) {
    let { startTime, endTime } = req.body;
    const toMatch = {};
    toMatch['time'] = {};
    if (startTime) {
        toMatch.time['$gt'] = ServerUtils.htmlDateToTime(startTime);
        if (endTime) {
            toMatch.time['$lt'] = ServerUtils.htmlDateToTime(endTime, false);
        } else {
            toMatch.time['$lt'] = ServerUtils.htmlDateToTime(startTime, false);
        }
    } else {
        let currDate = new Date();
        toMatch.time['$gt'] = ServerUtils.htmlDateToTime(currDate);
        toMatch.time['$lt'] = ServerUtils.htmlDateToTime(currDate, false);
    }
    mongo.payments.aggregate([
        {
            $match: toMatch,
        }
    ], async (err, data) => {
        if (err) {
            return false;
        }
        const sellers = [];
        for (let sd of data) {
            const seller = await new Promise(resolve => {
                mongo.sellers.findOne({
                    _id: mongo.mongoID(sd.sellerId),
                }, sellerProject, (err, sellerInfo) => {
                    if (err || sellerInfo === null || typeof sellerInfo === 'undefined') {
                        resolve({});
                    } else {
                        sellerInfo.payment = sd.payment;
                        sellerInfo.debit = sd.debit;
                        sellerInfo.totalStock = sd.totalStock;
                        resolve(sellerInfo);
                    }
                });
            });
            sellers.push(seller);
        }
        res.send({
            ok: true,
            sellers: sellers,
            startTime: startTime,
        })
    })
}

module.exports = paymentsHistory;
