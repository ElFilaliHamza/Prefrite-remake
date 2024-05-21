const mongo = require("../db");
const ServerConfig = require("../ServerConfig");
const vendeurUtils = require("../vendeurs/vendeurUtils");
const sellerProject = ServerConfig.project.seller;
const articleProject = ServerConfig.project.articles;

module.exports = async function getAllInfo(req, res) {
    const sellerId = req.session.sellerId;
    if (!sellerId) {
        res.send({ access: false });
        return false;
    }

    let sellerInfo = await new Promise(resolve => {
        mongo.sellers.findOne({
            _id: mongo.mongoID(sellerId),
        }, sellerProject, (err, info) => {
            if (err) {
                info = null;
            }
            resolve(info);
        });
    });
    if (!sellerInfo) {
        res.send({ access: false });
        return false;
    }
    const superSeller = sellerInfo.superSeller;
    //sort by location
    ; (async () => {
        const { coords } = req.body;
        let clients = await new Promise(resolve => {
            let toMatch = {};
            const pipline = [];
            if (!superSeller) {
                toMatch.sellerId = sellerId;
                pipline.push({
                    $match: toMatch
                });
            }
            if (coords) {
                coords.reverse();
                pipline.push({
                    $geoNear: {
                        near: {
                            type: 'Point',
                            coordinates: coords,
                        },
                        distanceField: 'dist.calculated',
                        spherical: true
                    }
                })
            } else {
                pipline.push({
                    $sort: { time: -1 }
                })
            }
            mongo.clients.aggregate(pipline, (err, info) => {

            });
        });
    });
    let clients = await new Promise(resolve => {
        let toMatch = {};
        if (!superSeller) {
            toMatch.sellerId = sellerId;
        }
        mongo.clients.find(toMatch).sort({ time: -1 }, (err, info) => {
            if (err) {
                info = []
            }
            resolve(info);
        });
    });
    let artsNcats = await new Promise(resolve => {
        let toMatch = {};
        toMatch[`vendeurs.${sellerId}.qt`] = {
            $gte: 0
        }
        mongo.arts.aggregate([
            {
                $match: toMatch
            }, {
                $facet: {
                    arts: [
                        {
                            $project: {
                                ...articleProject,
                                sellerQt: `$vendeurs.${sellerId}.qt`
                            }
                        }
                    ],
                    cats: [
                        {
                            $group: {
                                _id: {
                                    catId: "$catId"
                                },
                                totalCatPrice: {
                                    $sum: {
                                        $multiply: ["$prixVente", `$vendeurs.${sellerId}.qt`]
                                    }
                                }
                            }
                        }
                    ],
                }
            }
        ], async (err, info) => {
            info = info[0];


            if (err) {
                info = {}
            }

            const catsInfo = info.cats
            if (!catsInfo) {
                catsInfo = [];
            }
            const catIds = catsInfo.map(x => {
                return mongo.mongoID(x._id.catId);
            });

            const cats = await new Promise(resolve => {
                mongo.cats.find({
                    _id: {
                        $in: catIds
                    }
                }, (err, results) => {
                    if (err) results = [];
                    resolve(results);
                })
            });
            info.cats = cats;

            const totalPrice = catsInfo.reduce((prev, curr) => {
                return prev + curr.totalCatPrice;
            }, 0);

            const stats = await vendeurUtils.getSoldTotal({ _id: sellerId, handed: sellerInfo.handed }) || {};
            stats.leftToSell = totalPrice;
            info.stats = stats;
            resolve(info);
        });
    })

    const isControlled = !!(req.session.superadmin);
    const toSend = {
        ok: true,
        clients,
        artsNcats,
        sellerInfo,
        isControlled
    }
    res.send(toSend);
}