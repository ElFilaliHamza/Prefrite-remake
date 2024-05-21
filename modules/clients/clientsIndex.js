const mongo = require("../db");
const ServerConfig = require("../ServerConfig");
const ServerUtils = require("../ServerUtils");
const getClients = require("./getClients");

function add(req, res) {
    let { name, ice, plafon, sellerId } = req.body;
    plafon = parseFloat(plafon);
    if (isNaN(plafon) || plafon < 0) {
        return res.send({ error: true })
    }
    mongo.clients.insertOne({
        name,
        ice,
        plafon,
        sellerId,
        time: Date.now()
    }, (error, insertInfo) => {
        if (error || insertInfo.nInserted === 0) {
            res.send({
                error: true,
                errorMessage: ServerUtils.extractUniqueValues(error),
            });
            return false;
        }
        res.send({
            ok: true,
            insertInfo
        })
    })
}

function update(req, res) {
    let { _id, name, ice, plafon, sellerId } = req.body;
    if (!_id && !name && !ice && !plafon && !sellerId) {
        return res.send({ error: true });
    }
    plafon = parseFloat(plafon);
    if (isNaN(plafon) || plafon < 0) {
        return res.send({ error: true });
    }

    let toSet = {}
    toSet["name"] = name;
    toSet["ice"] = ice;
    toSet["plafon"] = plafon;
    toSet["sellerId"] = sellerId;

    toSet.lastModified = Date.now();
    try {
        mongo.clients.updateOne({
            _id: mongo.mongoID(_id)
        }, {
            $set: toSet
        }, (error, updateInfo) => {
            if (error || updateInfo.nModified === 0) {
                return res.send({
                    error: true,
                    errorMessage: ServerUtils.extractUniqueValues(error),
                });
            }
            res.send({
                ok: true,
            })
        })
    } catch (error) {

    }
}

function deleteClient(req, res) {
    let { _id } = req.body;
    if (!_id) {
        return res.send({ error: true });
    }

    try {
        mongo.clients.remove({
            _id: mongo.mongoID(_id)
        }, {
            justOne: true
        }, async (error, deleteInfo) => {
            if (error || deleteInfo.deletedCount === 0) {
                return res.send({
                    error: true,
                });
            }
            res.send({
                ok: true
            })
            //remove invoices
            /* mongo.invoice.remove({
                "client._id": _id
            }, (error, info) => {
                res.send({
                    ok: true
                })
            }) */

        })
    } catch (error) {

    }
}


function getOne(req, res) {
    let { _id } = req.body;
    try {
        const mongoId = mongo.mongoID(_id);
        mongo.clients.findOne({
            _id: mongoId
        }, (err, info) => {
            if (err || !info) {
                return res.send({
                    error: true
                });
            }
            if (info.sellerId) {
                mongo.sellers.findOne({
                    _id: mongo.mongoID(info.sellerId)
                }, (err, sellerInfo) => {
                    if (err) {
                        return false;
                    }
                    info.sellerInfo = sellerInfo || {};
                    res.send(info);
                })
            } else {
                info.sellerInfo = {};
                res.send(info);
            }
        })
    } catch (error) {
        res.send({
            error: true
        });
    }
}

function getInactive(req, res) {
    let { startTime, endTime } = req.body;
    let toMatch = {}
    startTime = ServerUtils.htmlDateToTime(startTime);
    endTime = ServerUtils.htmlDateToTime((endTime || startTime), false);

    toMatch['time'] = {
        $gt: startTime,
        $lt: endTime
    }
    mongo.clients.find({}, (err, clients) => {
        if (err || !clients) {
            return res.send({
                error: true
            })
        }
        mongo.invoice.aggregate([
            {
                $match: toMatch
            },
            {
                $group: {
                    _id: "$client._id",
                }
            }
        ], (err, invoiceData) => {
            clients = clients.filter(client => {
                let clientId = client._id.toString();
                for (let data of invoiceData) {
                    if (data._id === clientId) {
                        return false;
                    }
                }
                return true;
            })
            res.send({
                ok: true,
                clients
            });
        });
    })
}

function payDebitByClient(req, res) {
    const { _id } = req.body;
    let payment = parseFloat(req.body.payment) || 0;
    const mongoId = mongo.mongoID(_id);
    mongo.clients.findOne({
        _id: mongoId,
    }, (err, clientInfo) => {
        if (err || !clientInfo) {
            return res.send({
                error: true,
            });
        }
        let debit = clientInfo.debit;
        if(payment > debit){
            return res.send({
                exceeded: true,
            });
        }

        const time = Date.now();
        //retrieve client invoices
        mongo.invoice.aggregate([
            {
                $match: {
                    [`client._id`]: _id,
                }
            }, {
                $project: {
                    total: "$total",
                    paid: "$paid",
                    profitPercent: "$profitPercent",
                    rest: {
                        $subtract: ["$total", "$paid"]
                    }
                }
            }, {
                $match: {
                    rest: {
                        $gt: 0,
                    }
                }
            }, {
                $sort: {
                    //sort from old to new
                    time: 1,
                }
            }
        ], async (err, data) => {
            if(err || !data){
                return res.send({
                    ok: true,
                });
            }
            let stillToPay = payment;
            let paid = 0;
            for(const invoice of data){
                if(stillToPay <= 0){
                    //payment is used
                    break;
                }
                const rest = invoice.rest || 0;
                const toPay = stillToPay > rest ? rest : stillToPay;
                if(stillToPay < toPay){
                    //not enough in rare cases
                    break;
                }
                //update invoice
                await new Promise(invoiceResolve => {
                    mongo.invoice.updateOne({
                        _id: invoice._id,
                    }, {
                        $set: {
                            paid: invoice.paid + toPay,
                            payTime: time,
                            time: time, //update invoice time to latest payment time
                        },
                        $push: {
                            payDetails: {
                                amount: toPay,
                                profit: toPay * invoice.profitPercent,
                                time: time,
                            }
                        }
                    }, (err, updateInfo) => {
                        invoiceResolve();
                    });
                })
                paid += toPay;
                stillToPay -= toPay;
            }
            mongo.clients.updateOne({
                _id: mongoId,
            }, {
                $inc: {
                    debit: -paid,
                }
            }, (error, clientUpdateInfo) => {
                if (clientUpdateInfo.nModified !== 0) {
                    //client updated successfully
                    res.send({
                        ok: true,
                    })
                } else {
                    return res.send(error);
                }
            });
        })
    });
}

module.exports = {
    add: add,
    update: update,
    deleteClient: deleteClient,
    get: getClients,
    getOne: getOne,
    getInactive: getInactive,
    payDebit: payDebitByClient,
}
