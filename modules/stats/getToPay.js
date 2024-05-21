const mongo = require("../db");
const ServerConfig = require("../ServerConfig");
const vendeurUtils = require("../vendeurs/vendeurUtils");
const sellerProject = ServerConfig.project.seller;

function getToPay(req, res) {
    mongo.sellers.aggregate([
        {
            $project: {
                ...sellerProject
            }
        }
    ], async (err, data) => {
        for (let sellerInfo of data) {
            const _id = sellerInfo._id.toString();
            const stats = await vendeurUtils.getSoldTotal({
                _id, 
                handed: sellerInfo.handed, 
                getDebit: true,
                getStockTotal: true,
            }) || {};
            sellerInfo.stats = stats;
        }
        res.send({
            ok: true,
            sellers: data,
        });
    })
}

module.exports = getToPay;