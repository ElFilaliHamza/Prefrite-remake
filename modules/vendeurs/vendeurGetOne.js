const mongo = require("../db");
const vendeurUtils = require("./vendeurUtils");
const ServerConfig = require("../ServerConfig");

const sellerProject = ServerConfig.project.seller;

module.exports = function vendeurGetOne(req, res) {
    let { _id } = req.body;
    try {
        let mongoId = mongo.mongoID(_id)
        mongo.sellers.findOne({
            _id: mongoId
        }, {
            ...sellerProject,
            password: 1
        }, async (err, sellerInfo) => {
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
            //fetch articles
            let artsData = await vendeurUtils.getArticles({
                _id,
                exists: true,
                calcTotal: true
            });

            //fetch clients
            let clientsData = await vendeurUtils.getClients({
                _id
            });

            const stats = await vendeurUtils.getSoldTotal({ _id, handed: sellerInfo.handed }) || {};
            stats.leftToSell = artsData && artsData.totalPrice;
            res.send({
                vendeur: sellerInfo,
                ...artsData,
                ...clientsData,
                stats
            });
        })
    } catch (serverError) {
        res.send({
            serverError: true
        });
    }
}