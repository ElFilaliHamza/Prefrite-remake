const mongo = require("../db");

const debitInvoices = (req, res) => {
    let { _id } = req.body;
    mongo.invoice.aggregate([
        {
            $match: {
                "client._id": _id
            }
        },
        {
            $addFields: {
                debit: {
                    $sum: {
                        $subtract: ["$total", "$paid"]
                    }
                }
            }
        },
        {
            $match: {
                debit: {
                    $gt: 0,
                },
            }
        }
    ], async (err, debitData) => {
        res.send({
            ok: true,
            invoices: debitData
        });
    })
}

module.exports = debitInvoices;