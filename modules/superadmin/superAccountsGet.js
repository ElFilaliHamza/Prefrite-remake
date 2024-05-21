const mongo = require("../db");

const superAccountsGet = async (req, res) => {
    const accTypes = [
        {
            col: mongo.sellers,
            type: 'seller',
            extraMatch: {
                superSeller: {
                    $exists: false
                }
            }
        }, {
            col: mongo.admin,
            type: 'admin'
        }, {
            col: mongo.magasin,
            type: 'magasin'
        }, {
            col: mongo.superadmin,
            type: 'superadmin',
        }, {
            col: mongo.sellers,
            type: 'seller',
            extraMatch: {
                superSeller: {
                    $exists: true
                }
            }
        }
    ];

    const pipline = [
        {
            $sort: {
                time: -1
            }
        }
    ];
    const accounts = [];
    for (let t of accTypes) {
        await new Promise(resolve => {
            let subPipline;
            if (t.extraMatch) {
                subPipline = [
                    {
                        $match: t.extraMatch
                    },
                    ...pipline
                ]
            } else {
                subPipline = pipline
            }
            t.col.aggregate(subPipline, async (err, accs) => {
                if (err) {
                    return resolve();
                }
                for (let acc of accs) {
                    acc.type = t.type;
                    accounts.push(acc);
                }
                resolve()
            });
        })
    }
    res.send({
        accounts
    })

}

module.exports = superAccountsGet;