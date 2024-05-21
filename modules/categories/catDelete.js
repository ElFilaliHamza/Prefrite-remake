const fs = require('fs')
const mongo = require("../db");
const { UPLOAD_PATH } = require('../ServerConfig');

async function catDelete(req, res) {

    let { _id } = req.body;

    let status = await new Promise((resolve, reject) => {
        mongo.arts.find({
            catId: _id
        }, (err, articles) => {
            if (articles) {
                for (let article of articles) {
                    let imgPath = UPLOAD_PATH + article.filename;
                    try {
                        //remove article image
                        fs.unlinkSync(imgPath)
                    } catch (error) {

                    }
                }
                mongo.arts.remove({
                    catId: _id
                }, (err, deleteInfo) => {
                    if (!err) {
                        const mongoID = mongo.mongoID(_id)
                        mongo.cats.remove({
                            _id: mongoID
                        }, {
                            justOne: true
                        }, (err, catDeleteInfo) => {
                            if (!err) {
                                resolve({
                                    ok: true
                                });
                            }
                        })
                    }
                })
            }
        })
    })
    res.send(status);
}

module.exports = catDelete;
