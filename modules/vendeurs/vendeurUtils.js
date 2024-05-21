const mongo = require("../db");
const ServerConfig = require("../ServerConfig");
const ServerUtils = require("../ServerUtils");
const limitArticle = ServerConfig.limit.articles;
const limitClients = ServerConfig.limit.clients;
const limitCats = ServerConfig.limit.categories;
const articleProject = ServerConfig.project.articles;

const oneDay = 1000 * 60 * 60 * 24;

function getCategories({ _id, skip = 0, exists, search }) {
    return new Promise((resolve, reject) => {
        let toMatch = {};
        let toSort = {};
        if (_id) {
            toMatch[`vendeurs.${_id}`] = {
                $exists: exists
            }
            toSort[`vendeurs.${_id}.time`] = -1
        } else {
            toSort['time'] = -1
        }

        let facet = {};
        facet.arts = [];
        facet.cats = [
            {
                $group: {
                    _id: {
                        catId: "$catId"
                    }
                }
            }
        ]
        mongo.arts.aggregate([
            {
                $match: toMatch
            }, {
                $sort: toSort
            }, {
                $facet: facet
            }
        ], async (err, info) => {
            if (err) {
                resolve(null);
                return false;
            }
            info = info[0];
            let { cats } = info;
            let catIds = cats.map(c => {
                let { _id: { catId: _id } } = c
                return mongo.mongoID(_id);
            });

            const catsPipeline = [];

            const catToMatch = {};
            catToMatch._id = {
                $in: catIds
            };

            if (search) {
                catToMatch['name'] = ServerUtils.secureAndConvertStringToRegex(search, ['i']);
            }

            catsPipeline.push({
                $match: catToMatch
            })

            catsPipeline.push({
                $facet: {
                    count: [{ $count: "count" }],
                    cats: [
                        {
                            $sort: {
                                time: -1
                            }
                        }, {
                            $skip: skip
                        }, {
                            $limit: limitCats
                        }
                    ]
                }
            })

            mongo.cats.aggregate(catsPipeline, (err, results) => {
                results = results[0];
                let endCats;
                let count = (results.count[0] && results.count[0].count) || 0;
                if (count <= (skip + limitCats)) { //set endCats to true if reached limit
                    endCats = true;
                }
                let cats = results.cats;

                let toResolve = {
                    cats,
                    endCats,
                    search
                }

                resolve(toResolve);
            });
        })
    })
}

function getArticles({ _id, skip = 0, limit = limitArticle, exists, notZero, calcTotal, getArticles = true, catId, search }) {
    return new Promise((resolve, reject) => {
        let toMatch = {};
        let toSort = {};
        if (_id) {
            /* toMatch[`vendeurs.${_id}`] = {
                $exists: exists
            }
            if (notZero) {
                toMatch[`vendeurs.${_id}.qt`] = {
                    $gt: 0
                }
            } */

            {
                //awlays not zero
                toMatch[`vendeurs.${_id}.qt`] = {
                    $gt: 0
                }
            }

            //toSort[`vendeurs.${_id}.time`] = -1
        } else {
            //toSort['time'] = -1
        }

        if (catId) {
            toMatch['catId'] = catId;
        }
        if (search) {
            toMatch['name'] = ServerUtils.secureAndConvertStringToRegex(search, ['i']);
        }

        let facet = {};
        if (getArticles) {
            facet.count = [{ $count: "count" }];

            toSort['lowerName'] = 1;
            facet.articles = [
                {
                    $addFields: {
                        //time: -1,
                        lowerName: { "$toLower": "$name" }
                    }
                }, {
                    $sort: toSort
                }, {
                    $skip: skip
                }, {
                    $limit: limit
                }, {
                    $project: {
                        ...articleProject,
                        prixAchat: undefined, //hide for admin
                        qt: `$vendeurs.${_id}.qt`
                    }
                }
            ];
        }
        if (calcTotal) {
            facet.total = [
                {
                    $group: {
                        _id: null,
                        totalPrice: { $sum: { $multiply: ["$prixVente", `$vendeurs.${_id}.qt`] } }
                    }
                }
            ]
        }
        mongo.arts.aggregate([
            {
                $match: toMatch
            }, {
                $facet: facet
            }
        ], (err, info) => {
            if (err) {
                resolve(null);
                return false;
            }
            info = info[0]

            let toResolve = {

            }

            let articles = info.articles;
            if (Array.isArray(articles)) {
                toResolve.articles = articles;
                let endArticles
                let count = (info.count && info.count[0] && info.count[0].count) || 0;
                if (count <= (skip + limit)) {
                    endArticles = true;
                }
                toResolve.endArticles = endArticles;
            }

            if (info.total && info.total[0]) {
                toResolve.totalPrice = info.total[0].totalPrice;
            } else {
                toResolve.totalPrice = 0;
            }

            if (search) {
                toResolve.search = search;
            }
            resolve(toResolve);
        })
    })
}

function getClients({ _id, skip = 0, limit = limitClients }) {
    return new Promise((resolve, reject) => {
        let toMatch = {};
        let toSort = {};
        if (_id) {
            toMatch['sellerId'] = _id;
        }
        toSort['time'] = -1

        mongo.clients.aggregate([
            {
                $match: toMatch
            }, {
                $sort: toSort
            }, {
                $facet: {
                    count: [{ $count: "count" }],
                    clients: [
                        {
                            $skip: skip
                        },
                        {
                            $limit: limit
                        }
                    ]
                }
            }
        ], (err, info) => {
            if (err) {
                resolve(null);
                return false;
            }
            info = info[0]
            let count = (info.count && info.count[0] && info.count[0].count) || 0;
            let endClients

            if (count <= (skip + limit)) {
                endClients = true;
            }
            let clients = info.clients;
            resolve({
                clients,
                endClients
            });
        })
    })
}

function generatePayCondSum(field, cond) {
    if (cond) {
        return {
            $sum: [
                "$$value", {
                    $cond: {
                        ...cond,
                        then: "$$this." + field,
                        else: 0
                    }
                }
            ]
        }
    }
    return {
        $sum: [
            "$$value", "$$this." + field,
        ]
    }
}

function getSoldTotal({ _id, handed, statsTime, statsEndTime, getDebit, getStockTotal }) {
    //statsTime: the start time
    //statsEndTime: the end time
    return new Promise((resolve, reject) => {
        let toMatch = {};
        if (typeof _id !== 'string') {
            _id = _id.toString && _id.toString();
        }
        if (_id) {
            toMatch['sellerId'] = _id;
        }

        let facet = {};
        let project = {}
        project['_id'] = null;
        project['sold'] = { $sum: "$total" };
        //project['paid'] = { $sum: "$paid" };
        //project['profit'] = { $sum: '$profit' };
        //project['profit'] = { $sum: { $multiply: ["$profitPercent", `$paid`] } };

        facet['stats'] = [];
        /*if (statsTime) {
            statsTime = new Date(statsTime).getTime(); //dont use htmlDateToTime 
            //because lastHandTime is not always from 00:00 oclock
            let timeMatch = {}
            timeMatch['$gte'] = statsTime;

            let endTime;
            if (statsEndTime) {
                endTime = statsEndTime;
            } else {
                endTime = ServerUtils.htmlDateToTime(statsTime, false);
            }
            timeMatch['$lte'] = endTime;

            facet['stats'].push(
                {
                    $match: {
                        time: timeMatch
                    }
                },
            );
        }*/

        const cond = statsTime ? (
            {
                if: {
                    //reduce if the payment is in the given interval
                    $and: [
                        { $gte: ["$$this.time", statsTime] },
                        { $lt: ["$$this.time", statsEndTime] }
                    ]
                }
            }
        ) : undefined;
        project['paid'] = {
            $reduce: {
                input: "$payDetails",
                initialValue: 0,
                in: generatePayCondSum("amount", cond),
            }
        };

        project['profit'] = {
            $reduce: {
                input: "$payDetails",
                initialValue: 0,
                in: generatePayCondSum("profit", cond),
            }
        };

        project['debit'] = {
            $sum: {
                $subtract: ["$total", "$paid"],
            }
        }

        facet['stats'].push(
            {
                $project: project,
            }
        );

        facet['stats'].push(
            {
                $group: {
                    _id: null,
                    sold: {
                        $sum: "$sold",
                    },
                    paid: {
                        $sum: "$paid",
                    },
                    profit: {
                        $sum: "$profit",
                    },
                },
            }
        );

        /* if (getDebit) {
            facet['debit'] = [
                {
                    $group: {
                        _id: null,
                        debit: {
                            $sum: {
                                $subtract: ["$total", "$paid"]
                            }
                        }
                    },
                }
            ]
        } */

        mongo.invoice.aggregate([
            {
                $match: toMatch
            }, {
                $facet: facet,
            }
        ], async (err, info) => {
            if (err) {
                console.log(err)
                resolve(null);
                return false;
            }
            info = info[0]
            let stats = info.stats[0];
            //if the seller handed som payment reduce it!
            if (!stats) {
                stats = {};
            } else {
                if (handed) {
                    stats.sold -= handed;
                    stats.paid -= handed;
                }
                stats.credit = stats.sold - stats.paid;
                stats.debit = stats.credit;
            }

            /* if (getDebit) {
                if (info.debit && info.debit[0] && info.debit[0].debit) {
                    stats.debit = info.debit[0].debit;
                }
            } */
            if (getStockTotal) {
                stats.totalStock = await new Promise(stockResolve => {
                    mongo.arts.aggregate([
                        {
                            $group: {
                                _id: null,
                                totalStock: {
                                    $sum: {
                                        $multiply: [`$vendeurs.${_id}.qt`, '$prixVente']
                                    }
                                }
                            }
                        }
                    ], (err, stockInfo) => {
                        stockInfo = stockInfo[0];
                        stockResolve(stockInfo && stockInfo.totalStock);
                    })
                })
            }
            resolve(stats);
        })
    })
}

function recalculateArticleQuantity(article) {
    if (!article.vendeurs) {
        return article.qtStocke;
    }
    let sum = Object.values(article.vendeurs).reduce((prev, curr) => {
        return prev + curr.qt;
    }, 0);
    return article.qtStocke - sum;
}

const vendeurUtils = {
    getCategories,
    getArticles,
    getClients,
    getSoldTotal,
    recalculateArticleQuantity
}

module.exports = vendeurUtils;
