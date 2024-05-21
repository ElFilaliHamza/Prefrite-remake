const mongo = require("../db");
const debitCount = (req, res) => {
    mongo.invoice.aggregate([
        {
            $group: {
                _id: null,
                totalDebit: {
                    $sum: {
                        $subtract: ["$total", "$paid"]
                    }
                }
            }
        }
    ], (err, info) => {
        info = info[0];
        let totalDebit = (info && info.totalDebit) || 0;
        res.send({
            ok: true,
            totalDebit
        });
    })
}

module.exports = debitCount;