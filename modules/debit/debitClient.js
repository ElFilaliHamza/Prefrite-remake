const mongo = require("../db");

const debitClient = (req, res) => {
    let { _id } = req.body;
    mongo.invoice.aggregate([
        {
            $match: {
                sellerId: _id
            }
        },
        {
            $group: {
                _id: "$client._id",
                debit: {
                    $sum: {
                        $subtract: ["$total", "$paid"]
                    }
                }
            }
        }
    ], async (err, debitData) => {
        const clientIds = debitData.filter(d => d.debit > 0).map(deb => mongo.mongoID(deb._id))
        const clients = await new Promise(resolve => {
            mongo.clients.find({
                _id: {
                    $in: clientIds
                }
            }, (err, clients) => {
                resolve(clients || []);
            })
        })
        for (let client of clients) {
            let debitObject = debitData.find(obj => obj._id === client._id.toString());
            if (debitObject) {
                client.debit = debitObject.debit;
            }
        }
        res.send({
            ok: true,
            clients
        });
    })
}

module.exports = debitClient;