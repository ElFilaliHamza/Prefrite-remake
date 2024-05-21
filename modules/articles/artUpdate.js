const mongo = require('../db')
const fs = require('fs')
const upload = require('../upload');
const { UPLOAD_PATH, NO_ACCESS } = require('../ServerConfig');
const { fixFloat } = require('../ServerUtils');


module.exports = function artUpdate(req, res) {
    upload(req, res, async (err) => {
        if (err) {
            return false;
        }
        const time = Date.now();
        const file = req.file
        let superadmin = req.session.superadmin
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
        let { _id, name, prixVente, prixAchat, toAddToStock, qtAlerte } = req.body;

        try {
            const mongoID = mongo.mongoID(_id);

            let canUpdate = true;
            let updateTime;
            let newQtStocke;
            const toSet = {};
            const toInc = {};
            if (name) {
                toSet.name = name;
            }
            if (prixVente) {
                toSet.prixVente = fixFloat(prixVente);
            }
            if (prixAchat) {
                toSet.prixAchat = fixFloat(prixAchat);
            }

            if (qtAlerte) {
                updateTime = true;
                toSet.qtAlerte = fixFloat(qtAlerte);
            }

            if (toAddToStock) {
                updateTime = true;
                toInc['qtStocke'] = fixFloat(toAddToStock);
            }

            if (updateTime) {
                toSet.lastModified = time;
            }


            if (file || toInc['qtStocke']) {
                if (file) {
                    toSet.img = `/serve/img/${file.filename}`
                    toSet.filename = file.filename
                }
                await new Promise(resolve => {
                    mongo.arts.findOne({
                        _id: mongoID
                    }, (err, doc) => {
                        //delete the old
                        if (file) {
                            if (doc && doc.filename) {
                                const oldImagePath = UPLOAD_PATH + doc.filename;
                                try {
                                    fs.unlinkSync(oldImagePath);
                                } catch (error) {

                                }
                            }
                        } else if (toAddToStock) {
                            newQtStocke = doc.qtStocke + toInc['qtStocke'];
                            if (newQtStocke < 0) {
                                canUpdate = false;
                            }
                        }
                        resolve();
                    });
                });
            }

            if (canUpdate) {
                let toUpdate = {};
                if (Object.keys(toInc).length > 0) {
                    toUpdate.$inc = toInc;
                }
                if (Object.keys(toSet).length > 0) {
                    toUpdate.$set = toSet;
                }

                if (Object.keys(toUpdate).length > 0) {
                    mongo.arts.updateOne({
                        _id: mongoID
                    }, toUpdate, async (err, updateInfo) => {
                        if (toAddToStock) {
                            //insert quantity record
                            await new Promise((resolve, reject) => {
                                mongo.stockHistory.insertOne({
                                    qt: toAddToStock,
                                    time: time,
                                    artId: _id,
                                }, (err, insertInfo) => {
                                    resolve();
                                });
                            });
                        }
                        res.send({
                            ok: true,
                            newQt: newQtStocke
                        })
                    })
                } else {
                    res.send({
                        error: true,
                        errorMessage: "no changes!"
                    })
                }

            } else {
                res.send({
                    error: true,
                    errorMessage: "can't update!"
                })
            }
        } catch (error) {

        }
    });
}
