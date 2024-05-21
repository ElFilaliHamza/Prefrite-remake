const mongo = require("../db");

module.exports = function sellerDeleteInvoice(req, res) {
    const sellerId = req.session.sellerId;
    if (!sellerId) {
        return res.send({ access: false });
    }
    const isControlled = !!req.session.superadmin;
    if (!isControlled) {
        return res.send({ access: false });
    }

    const { _id } = req.body;
    const invoiceId = mongo.mongoID(_id);

    mongo.invoice.findOne({
        _id: invoiceId,
        sellerId: sellerId
    }, async (err, invoice) => {
        if (err) {
            return res.send({
                error: true
            })
        } else if (!invoice) {
            return res.send({
                notFound: true
            })
        }
        if (Array.isArray(invoice.products)) {
            for (let pr of invoice.products) {
                let _id = pr._id;
                let qt = pr.qt;
                if (typeof qt !== 'number' || isNaN(qt)) {
                    continue;
                }
                let toInc = {}
                toInc[`vendeurs.${sellerId}.qt`] = qt;
                await new Promise(resolve => {
                    mongo.arts.update({
                        _id: mongo.mongoID(_id),
                    }, {
                        $inc: toInc
                    }, (err, updateInfo) => {
                        resolve();
                    });
                });
            }
            //remove invoice
            mongo.invoice.remove({
                _id: invoiceId,
                sellerId: sellerId
            }, {
                justOne: true
            }, (err, deleteInfo) => {
                res.send({
                    ok: true,
                });
            });
        } else {
            res.send({
                error: true,
            });
        }
    })
}