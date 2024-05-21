const mongo = require("../db");
const ServerConfig = require("../ServerConfig");
const articleProject = ServerConfig.project.articles;
const sellerProject = ServerConfig.project.seller;
const { vendeurUpdateArticle } = require("../vendeurs/vendeurUpdateArticle");
const ServerUtils = require("../ServerUtils");

const limitCmd = ServerConfig.limit.cmd;

function count(req, res) {
    mongo.cmd.count({
        fullfiled: {
            $exists: false
        }
    }, (err, count) => {
        if (err) {
            res.send({
                error: true
            })
            return false;
        }
        res.send({
            count
        })
    })
}

function getCommands({ skip, fullfiled, getSellers, filter, specificSeller, getAll }) {
    return new Promise(globalResolve => {
        if (!skip) {
            skip = 0;
        }
        let facet = {}
        let toMatch = {}
        let toSort = {}

        if (getAll) {
            toSort.fullfiled = 1;
            toSort.time = -1;
        } else {
            if (fullfiled) {
                toSort.fullfilTime = -1;
                toMatch.fullfiled = {
                    $exists: true
                }
            } else {
                toSort.time = -1;
                toMatch.fullfiled = {
                    $exists: false
                }
            }
        }

        if (!filter) {
            filter = {}
        }

        if (filter.startTime) {
            let timeMatch = {}
            let startTime = ServerUtils.htmlDateToTime(filter.startTime);
            timeMatch['$gt'] = startTime

            let endTime = ServerUtils.htmlDateToTime((filter.endTime || filter.startTime), false);
            timeMatch['$lt'] = endTime
            toMatch['fullfilTime'] = timeMatch;
        }

        if (filter.sellerCmd) {
            toMatch['sellerId'] = filter.sellerCmd;
        } else if (specificSeller) {
            toMatch['sellerId'] = specificSeller;
        }


        facet['commands'] = [
            {
                $sort: toSort
            }, {
                $skip: skip
            }, {
                $limit: limitCmd
            }
        ];

        facet['count'] = [{ $count: "count" }];

        mongo.cmd.aggregate([
            {
                $match: toMatch
            },
            {
                $project: {
                    artCount: {
                        $size: "$articles"
                    },
                    sellerId: 1,
                    time: 1,
                    fullfiled: 1,
                    fullfilTime: 1
                }
            },
            {
                $facet: facet
            },
        ], async (err, info) => {
            if (err) {
                return globalResolve(false)
            }
            info = info[0];
            let endCmds;
            let count = (info.count && info.count[0] && info.count[0].count) || 0;
            if (count <= ((skip || 0) + limitCmd)) { //set endCmds to true if reached limit
                endCmds = true;
            }

            let { commands } = info;
            if (!specificSeller && Array.isArray(commands)) {
                for (let cmd of commands) {
                    try {
                        cmd.sellerInfo = await new Promise(resolve => {
                            mongo.sellers.findOne({
                                _id: mongo.mongoID(cmd.sellerId)
                            }, sellerProject, (err, sellerInfo) => {
                                if (err || !sellerInfo) {
                                    return resolve({});
                                }
                                resolve(sellerInfo);
                            })
                        })
                    } catch {
                        continue;
                    }
                }
            }

            let toResolve = {}
            toResolve.commands = commands;
            toResolve.endCmds = endCmds;

            if (!skip && getSellers) {
                const sellers = await new Promise(resolve => {
                    mongo.sellers.find({}, sellerProject, (err, data) => {
                        if (err) data = [];
                        resolve(data);
                    });
                });
                toResolve.sellers = sellers;
            }

            toResolve.startTime = filter.startTime;
            toResolve.endTime = filter.endTime;
            globalResolve(toResolve);
        });
    })
}

async function get(req, res) {
    const toSend = await getCommands({
        skip: req.body.skip,
        fullfiled: req.body.fullfiled,
        getSellers: req.body.getSellers,
        filter: req.body.filter,
    });
    res.send(toSend);
}

function getOne(req, res) {
    let { _id } = req.body;
    try {
        mongo.cmd.findOne({
            _id: mongo.mongoID(_id)
        }, async (err, cmd) => {
            if (err || !cmd) {
                return res.send({
                    error: true
                });
            }

            if (cmd.sellerId) {
                try {
                    cmd.sellerInfo = await new Promise(resolve => {
                        mongo.sellers.findOne({
                            _id: mongo.mongoID(cmd.sellerId)
                        }, sellerProject, (err, sellerInfo) => {
                            if (err || !sellerInfo) {
                                return resolve({});
                            }
                            resolve(sellerInfo);
                        })
                    })
                } catch {

                }
            }
            if (Array.isArray(cmd.articles)) {
                try {
                    const articles = [];
                    for (let article of cmd.articles) {
                        let articleInfo = await new Promise(resolve => {
                            mongo.arts.findOne({
                                _id: mongo.mongoID(article._id)
                            }, articleProject, (err, articleInfo) => {
                                if (err || !articleInfo) {
                                    return resolve(null);
                                }
                                articleInfo.qt = article.qt;
                                resolve(articleInfo);
                            })
                        })
                        if (articleInfo) {
                            articles.push(articleInfo);
                        }
                    }
                    cmd.articles = articles;
                    return res.send({
                        cmd
                    });
                } catch {

                }
            }
        });
    } catch { }
}

function confirmCmd(req, res) {
    let { _id } = req.body;
    try {
        mongo.cmd.findOne({
            _id: mongo.mongoID(_id)
        }, async (err, cmd) => {
            if (err || !cmd || !cmd.sellerId) {
                return res.send({
                    error: true
                });
            }

            if (cmd.fullfiled) {
                return res.send({
                    error: true,
                    errorMessage: 'Commande est déja Validée'
                });
            }

            if (Array.isArray(cmd.articles)) {
                //first we check for all the articles quantites
                const checkStack = [];
                try {
                    for (let article of cmd.articles) {
                        let status = await vendeurUpdateArticle({
                            qt: article.qt,
                            _id: article._id,
                            justCheck: true,
                        });
                        checkStack.push(status);
                        /* if (status.exceeded) {
                            return res.send({
                                error: true,
                                exceeded: true
                            })
                        } */
                    }
                    if (checkStack.filter(status => status.exceeded).length > 0) {
                        const newArticles = cmd.articles.map((article, index) => {
                            if (checkStack[index].exceeded) {
                                article.qt = checkStack[index].qtStocke;
                            }
                            return article;
                        }).filter((article => {
                            return article.qt !== 0;
                        }));
                        //update command
                        await new Promise(resolve => {
                            mongo.cmd.updateOne({
                                _id: mongo.mongoID(_id)
                            }, {
                                $set: {
                                    articles: newArticles
                                }
                            }, (err, updateInfo) => {
                                resolve();
                            });
                        });
                    }

                } catch {

                }
                try {
                    for (let article of cmd.articles) {
                        let status = await vendeurUpdateArticle({
                            sellerId: cmd.sellerId,
                            qt: article.qt,
                            _id: article._id,
                        });
                    }

                } catch {

                }
            }

            //set the command as fullfiled
            mongo.cmd.updateOne({
                _id: mongo.mongoID(_id)
            }, {
                $set: {
                    fullfiled: true,
                    fullfilTime: Date.now(),
                }
            }, (err, info) => {
                if (err) {
                    return res.send({
                        error: true
                    });
                }
                res.send({
                    ok: true
                });
            });

        });
    } catch { }
}

function cancelCmd(req, res) {
    let { _id } = req.body;
    try {
        //remove the command
        mongo.cmd.remove({
            _id: mongo.mongoID(_id)
        }, {
            justOne: true
        }, (err, info) => {
            if (err) {
                return res.send({
                    error: true
                })
            }
            res.send({
                ok: true
            });
        })
    } catch { }
}

function removeCmdArt(req, res) {
    let { _id, artId } = req.body;
    try {
        let toPull = {};
        toPull["articles"] = {
            _id: artId,
        };
        const time = Date.now();
        mongo.cmd.updateOne({
            _id: mongo.mongoID(_id),
        }, {
            $pull: toPull,
            $set: {
                lastModified: time,
            },
        }, (err, updateInfo) => {
            if (err) {
                return res.send({
                    error: true
                })
            }
            res.send({
                ok: true,
            });
        });
        /* mongo.cmd.findAndModify({
            query: {
                _id: mongo.mongoID(_id),
            },
            update: {
                $pull: toPull,
            },
            new: true,
        }, (err, info) => {
            if (err) {
                return res.send({
                    error: true
                })
            }
            res.send({
                ok: true,
                cmd: info,
            });
        }); */
    } catch { }
}

function getStatus(req, res) {
    let { startTime, endTime } = req.body;
    const pipline = [];

    let timeFrom = ServerUtils.htmlDateToTime(startTime);

    let timeTo = ServerUtils.htmlDateToTime((endTime || startTime), false);
    pipline.push({
        $match: {
            fullfiled: true,
            fullfilTime: {
                $gte: timeFrom,
                $lt: timeTo
            }
        }
    });
    mongo.cmd.aggregate(pipline, async (err, data) => {
        const map = {};
        //add old articles
        for (let cmd of data) {
            let articles = cmd.articles;
            for (let art of articles) {
                map[art._id] = (map[art._id] || 0) + art.qt
            }
        }
        let newArticles = [];
        for (let [key, value] of Object.entries(map)) {
            let article = await new Promise(resolve => {
                mongo.arts.findOne({
                    _id: mongo.mongoID(key),
                }, articleProject, (err, art) => {
                    resolve(art || {});
                });
            });
            article.qt = value;
            newArticles.push(article);
        }
        res.send({
            ok: true,
            articles: newArticles,
            startTime,
            endTime,
        });
    });
}

const commandIndex = {
    count,
    get,
    getOne,
    confirmCmd,
    cancelCmd,
    removeCmdArt,
    getStatus,
    getCommands
}

module.exports = commandIndex