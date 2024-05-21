const fs = require('fs')
const mongo = require("../db");
const { UPLOAD_PATH } = require('../ServerConfig');

async function artDelete(req, res) {

    let { _id } = req.body;

    try {
        const mongoID = mongo.mongoID(_id)
        let status = await new Promise((resolve, reject) => {
            mongo.arts.findOne({
                _id: mongoID
            }, (err, info) => {
                let imgPath = UPLOAD_PATH + info.filename
                try {
                    //remove article image
                    fs.unlinkSync(imgPath)
                } catch (error) {
                    /*
                    resolve({
                        error: true
                    });
                    return false;*/
                }
                mongo.arts.remove({
                    _id: mongoID
                }, {
                    justOne: true
                }, (err, deleteInfo) => {
                    if (!err) {
                        resolve({
                            ok: true
                        });
                    }
                })
            })
        })
        res.send(status);
    } catch (error) {

    }
}



module.exports = artDelete