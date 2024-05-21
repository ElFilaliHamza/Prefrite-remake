const mongo = require("../db");

function vendeurUpdateArticle({ sellerId, _id, qt, justCheck }) {
    return new Promise(resolve => {
        qt = parseFloat(qt)
        if (isNaN(qt)) {
            qt = 0;
        }
        let mongoId = mongo.mongoID(_id);
        mongo.arts.findOne({
            _id: mongoId
        }, (err, info) => {
            if (err || !info) {
                return resolve({
                    error: true
                })
            }
            let { qtStocke } = info;

            if (justCheck) {
                if (qtStocke < qt) {
                    return resolve({
                        exceeded: true,
                        qtStocke
                    });
                } else {
                    return resolve({
                        exceeded: false
                    })
                }
            }
            if (qtStocke < qt) { //art qt + oldsellerqt compare to newsellerqt
                return resolve({
                    exceeded: true
                })
            }
            let oldSellerQt;
            if (info.vendeurs && info.vendeurs[sellerId]) {
                oldSellerQt = info.vendeurs[sellerId].qt;
                //delete info.vendeurs[sellerId];
            } else {
                oldSellerQt = 0;
            }

            let newQtSeller = oldSellerQt + qt;
            let newQtStocke = qtStocke - qt;

            if (newQtSeller < 0 || newQtStocke < 0) {
                return resolve({
                    exceeded: true
                })
            }

            let toSet = {};
            let time = Date.now();
            toSet[`vendeurs.${sellerId}`] = {
                qt: newQtSeller,
                time
            }

            //toSet[`vendeurs.${sellerId}.qt`] = oldSellerQt + qt;
            toSet['qtStocke'] = newQtStocke;
            toSet['lastModified'] = time;

            mongo.arts.updateOne({
                _id: mongoId
            }, {
                $set: toSet
            }, (err, updateInfo) => {
                return resolve({
                    ok: true,
                    newQtSeller: newQtSeller,
                    newQtStocke
                })
            })
        });
    });
}

function vendeurUpdateArticleReq(req, res) {
    req.body.qt *= -1;
    vendeurUpdateArticle(req.body).then(info => {
        res.send(info);
    })
}


module.exports = {
    vendeurUpdateArticle,
    vendeurUpdateArticleReq
}