const mongo = require("../db");
const ServerConfig = require("../ServerConfig");
const sellerProject = ServerConfig.project.seller;
const debitSellers = (req, res) => {
    mongo.invoice.aggregate([
        {
            $group: {
                _id: "$sellerId",
                debit: {
                    $sum: {
                        $subtract: ["$total", "$paid"]
                    }
                }
            }
        }
    ], async (err, debitData) => {
        const sellerIds = debitData.filter(d => d.debit > 0).map(d => mongo.mongoID(d._id));
        const sellers = await new Promise(resolve => {
            mongo.sellers.find({
                _id: {
                    $in: sellerIds
                }
            }, sellerProject, (err, sellers) => {
                resolve(sellers || []);
            })
        })
        for(let seller of sellers){
            let debitObject = debitData.find(obj => obj._id === seller._id.toString());
            if(debitObject){
                seller.debit = debitObject.debit;
            } else {
                seller.debit = 0;
            }
        }
        res.send({
            ok: true,
            sellers
        });
    })
}

module.exports = debitSellers;