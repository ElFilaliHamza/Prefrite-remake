const mongo = require("../db");
const { fixFloat } = require("../ServerUtils")

module.exports = function sellerBuy(req, res) {
    const sellerId = req.session.sellerId;
    if (!sellerId) {
        res.send({ access: false });
        return false;
    }
    const superSeller = req.superSeller;

    const { clientId, arts } = req.body;
    let payment = req.body.payment;
    payment = fixFloat(payment);
    if (!payment || isNaN(payment)) {
        payment = 0;
    }

    let clientMongoID = mongo.mongoID(clientId);
    let toMatch = {}
    toMatch._id = clientMongoID;
    if (!superSeller) {
        toMatch.sellerId = sellerId;
    }
    mongo.clients.findOne(toMatch, async (err, info) => {
        if (err || !info) {
            res.send({ clientAccess: false });
            return false;
        }

        const invoice = {
            client: {
                _id: clientId,
                ice: info.ice,
                name: info.name,
            },
            products: []
        };

        const artsInfo = [];

        //search for all the articles
        for (let art of arts) {
            let info = await new Promise(resolve => {
                let artId = mongo.mongoID(art._id);
                mongo.arts.findOne({ _id: artId }, (err, info) => {
                    if (err || !info) {
                        return resolve(false);
                    }

                    let { prixVente, prixAchat, name } = info;

                    //allow superadmin to change price
                    if (superSeller) {
                        prixVente = art.price;
                    }

                    let qt = art.qt;
                    let sellerQt = (info.vendeurs && info.vendeurs[sellerId] && info.vendeurs[sellerId].qt) || 0;

                    resolve({
                        artId,
                        prixVente,
                        name,
                        qt,
                        sellerQt,
                        profit: (prixVente - prixAchat) * qt,
                    })
                })
            });


            if (info) {
                artsInfo.push(info);
            }
        }

        //calculate total

        const total = artsInfo.reduce((prev, curr) => {
            return (prev || 0) + (curr.prixVente * curr.qt);
        }, 0);


        //see if client can make a debit transaction
        //if client has debt more than their "plafond" 
        const plafon = info.plafon || 0;
        const debit = info.debit || 0;
        const permited = plafon - debit;
        const asked = total - payment;

        if (payment > total) {
            res.send({
                paymentExceeded: true
            })
            return false;
        } else if (asked > permited) {
            res.send({
                debitExceeded: true
            })
            return false;
        }

        //update client debit
        await new Promise((resolve, reject) => {
            mongo.clients.updateOne({
                _id: clientMongoID,
                sellerId: sellerId
            }, {
                $set: {
                    debit: debit + asked
                }
            }, (err, info) => {
                resolve(true);
            })
        })


        const valids = []
        //check seller quantities
        for (let art of artsInfo) {
            let { sellerQt, qt } = art;
            if (sellerQt < qt) { //if seller quantity is lower than asked quantity
                return res.send({
                    error: true,
                    errorMessage: "one or many Quantities Exceeded!"
                });
            }
        }
        //update the seller quantities
        for (let art of artsInfo) {
            let valid = await new Promise(resolve => {
                let { sellerQt, artId, qt } = art;
                if (sellerQt >= qt) {
                    let newSellerQt = sellerQt - qt;
                    let toSet = {}
                    toSet[`vendeurs.${sellerId}.qt`] = newSellerQt;
                    mongo.arts.updateOne({ _id: artId }, {
                        $set: toSet
                    }, (err, info) => {
                        if (err || info.nModified === 0) { //if error ir no row is updated
                            return resolve(false);
                        }
                        invoice.products.push({
                            _id: artId.toString(),
                            name: art.name,
                            price: art.prixVente,
                            qt,
                            profit: art.profit
                        })
                        resolve(true)
                    })
                } else {
                    return resolve(false);
                }
            });
            if (valid) {
                valids.push(valid);
            }
        }

        const time = Date.now();
        invoice.sellerId = sellerId;
        invoice.total = total;
        invoice.paid = payment;
        invoice.time = time;
        invoice.payTime = invoice.time;


        //calc profit
        let profit = invoice.products.reduce((prev, curr) => {
            return prev + curr.profit;
        }, 0);

        invoice.profit = profit;
        const profitPercent = profit / total;
        invoice.profitPercent = profitPercent;

        invoice.payDetails = [
            {
                amount: payment,
                profit: payment * profitPercent,
                time: time,
            }
        ];

        //insert invoice to database
        mongo.invoice.insertOne(invoice, (err, insertInfo) => {
            if (err || !insertInfo) {
                res.send({
                    error: true
                })
                return false;
            }
            res.send({
                invoiceId: insertInfo._id
            });
        })
    });

}