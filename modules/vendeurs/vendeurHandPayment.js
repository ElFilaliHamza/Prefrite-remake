const mongo = require("../db");
const vendeurUtils = require("./vendeurUtils");
const ServerConfig = require("../ServerConfig");

const sellerProject = ServerConfig.project.seller;

module.exports = function vendeurHandPayment(req, res) {
    let { _id, payment } = req.body;
    payment = parseFloat(payment);
    if (!payment || isNaN(payment)) {
        return res.send({
            error: true,
        })
    }

    const mongoId = mongo.mongoID(_id)
    mongo.sellers.findOne({
        _id: mongoId
    }, sellerProject, (err, info) => {
        if (err || !info) {
            return res.send({
                error: true,
            })
        }
        let handed = info.handed;
        vendeurUtils.getSoldTotal({
            _id,
            handed,
            getDebit: true,
            getStockTotal: true,
        }).then(info => {
            if (info) {
                let paid = info.paid;
                //trying to hand more than sold and paid
                if (payment > paid) {
                    return res.send({
                        exceeded: true,
                    })
                }

                /* passed all the verifications then insert payment and 
                increment seller handed by payment */
                let time = Date.now();
                mongo.payments.insertOne({
                    sellerId: _id,
                    payment: payment,
                    time: time,
                    debit: info.credit,
                    totalStock: info.totalStock
                }, (err, insertInfo) => {
                    if (insertInfo) {
                        mongo.sellers.updateOne({
                            _id: mongoId
                        }, {
                            $inc: {
                                handed: payment
                            },
                            $set: {
                                lastHandTime: time, //time for last hand of payment to maintain daily analysis
                            }
                        }, (err, info) => {
                            if (err || info.nModified === 0) {
                                return res.send({
                                    error: true,
                                });
                            }
                            res.send({
                                ok: true,
                            });
                        });
                    }
                });
            }
        })
    })

}