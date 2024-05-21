const mongo = require("../db");
const vendeurUtils = require("./vendeurUtils");

const ServerConfig = require("../ServerConfig");
const sellerProject = ServerConfig.project.seller;

module.exports = function vendeurStats(req, res) {
    let { _id } = req.body;
    let mongoId = mongo.mongoID(_id)
    try {
        mongo.sellers.findOne({
            _id: mongoId
        }, sellerProject, async (err, sellerInfo) => {
            if (err) {
                res.send({
                    serverError: true
                });
                return false;
            } else if (!sellerInfo) {
                res.send({
                    notFound: true
                })
                return false;
            }
            let stats = await vendeurUtils.getSoldTotal({ _id, handed: sellerInfo.handed }) || {};
            
            //fetch articles
            let totalLeft = await vendeurUtils.getArticles({
                _id,
                exists: true,
                calcTotal: true,
                getArticles: false
            });

            stats.leftToSell = totalLeft.totalPrice;
            stats.total = totalLeft.totalPrice + stats.sold || 0;
            res.send(stats)
        })
    } catch (serverError) {
        res.send({
            serverError: true
        });
    }
}