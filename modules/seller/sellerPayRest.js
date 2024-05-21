const mongo = require("../db");

const error = {
    error: true
}

module.exports = function sellerPayRest(req, res) {
    const sellerId = req.session.sellerId;
    const superSeller = req.superSeller;
    let { invoiceId, clientId, payRest } = req.body;
    payRest = parseFloat(payRest)
    if (isNaN(payRest) || payRest <= 0) {
        return res.send(error);
    }

    const invoiceMongoId = mongo.mongoID(invoiceId)
    let toMatch = {}
    toMatch._id = invoiceMongoId;
    //toMatch["client._id"] = clientId;
    if (!superSeller) {
        toMatch.sellerId = sellerId;
    }

    mongo.invoice.findOne(toMatch, (err, invoice) => {
        if (err || !invoice) {
            return res.send(error);
        }
        let { total, paid, profitPercent } = invoice
        let rest = total - paid;

        //check if payment is not bigger than the rest
        if (payRest <= rest) {
            const time = Date.now();
            //update invoice
            mongo.invoice.updateOne({
                _id: invoiceMongoId
            }, {
                $set: {
                    paid: paid + payRest,
                    payTime: time,
                    time: time, //update invoice time to latest payment time
                },
                $push: {
                    payDetails: {
                        amount: payRest,
                        profit: payRest * profitPercent,
                        time: time,
                    }
                }
            }, (err, updateInfo) => {
                if (updateInfo.nModified !== 0) {
                    //updated successfully
                    //update client debit
                    mongo.clients.updateOne({
                        _id: mongo.mongoID(clientId),
                    }, {
                        $inc: {
                            debit: -payRest
                        }
                    }, (err, clientUpdateInfo) => {
                        if (clientUpdateInfo.nModified !== 0) {
                            //client updated successfully
                            res.send({
                                ok: true,
                                updateInfo,
                            })
                        } else {
                            return res.send(error);
                        }
                    });
                } else {
                    return res.send(error);
                }
            });
        } else {
            return res.send(error);
        }
    })
}