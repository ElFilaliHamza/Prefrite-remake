const mongo = require("../db");

module.exports = function sellerInvoiceGetOne(req, res) {
    const sellerId = req.session.sellerId;
    if (!sellerId) {
        return res.send({ access: false });
    }

    const { _id } = req.body;
    const invoiceId = mongo.mongoID(_id);

    mongo.invoice.findOne({
        _id: invoiceId,
        sellerId: sellerId
    }, (err, invoice) => {
        if (err) {
            return res.send({
                error: true
            })
        } else if (!invoice) {
            return res.send({
                notFound: true
            })
        }

        mongo.clients.findOne({
            _id: mongo.mongoID(invoice.client._id)
        }, (err, clientInfo) => {
            if(clientInfo){
                invoice.client = clientInfo;
            }
            res.send(invoice);
        })
    })
}