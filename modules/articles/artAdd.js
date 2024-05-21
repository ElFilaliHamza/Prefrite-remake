const fs = require('fs')
const mongo = require('../db')
const upload = require('../upload');
const { NO_ACCESS } = require('../ServerConfig');
const { fixFloat } = require('../ServerUtils')

module.exports = function artAdd(req, res) {
    upload(req, res, (err) => {
        let superadmin = req.session.superadmin
        let file = req.file
        if (!superadmin) {
            //delete file if not connected
            if (file) {
                try {
                    fs.unlinkSync(file.path);
                } catch (error) {

                }
            }
            res.send(NO_ACCESS)
            return false;
        }
        let { catId,
            name,
            prixVente,
            prixAchat,
            qtStocke,
            qtAlerte } = req.body;

        ;[prixVente, prixAchat, qtStocke, qtAlerte] =
            [fixFloat(prixVente), fixFloat(prixAchat), fixFloat(qtStocke), fixFloat(qtAlerte)];

        if (!catId || !name || isNaN(prixVente) || isNaN(prixAchat) || isNaN(qtStocke) || isNaN(qtAlerte)) {
            return false;
        }

        try {
            const catMongoId = mongo.mongoID(catId);

            mongo.cats.findOne({
                _id: catMongoId
            }, (err, cat) => {
                if (!err && cat) {
                    //if cat exists insert the article
                    const time = Date.now();
                    let filename = (file && file.filename) || "";
                    let img = filename && `/serve/img/${filename}`;
                    mongo.arts.insertOne({
                        catId,
                        name,
                        prixVente,
                        prixAchat,
                        qtStocke,
                        qtAlerte,
                        img,
                        filename,
                        time,
                        lastModified: time,
                    }, async (err, insertInfo) => {
                        if (qtStocke) {
                            //insert quantity record
                            await new Promise((resolve, reject) => {
                                mongo.stockHistory.insertOne({
                                    qt: qtStocke,
                                    time: time,
                                    artId: insertInfo._id.toString(),
                                }, (err, insertInfo) => {
                                    resolve();
                                });
                            });
                        }
                        res.send({
                            ok: true,
                            _id: insertInfo._id
                        })
                    })
                } else {
                    res.send({
                        ok: false
                    })
                }
            })
        } catch (error) {

        }
    });
}






