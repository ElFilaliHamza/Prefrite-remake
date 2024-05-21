const mongo = require("../db");

const debitInvoice = (req, res) => {
    let { _id } = req.body;
    const mongoId = mongo.mongoID(_id);
    mongo.invoice.findOne({
        _id: mongoId,
    }, async (err, invoice) => {
        res.send({
            ok: true,
            invoice,
        });
    })
}

module.exports = debitInvoice;