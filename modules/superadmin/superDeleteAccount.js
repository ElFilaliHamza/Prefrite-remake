const mongo = require("../db");
const ServerUtils = require("../ServerUtils")

const superDeleteAccount = (req, res) => {
    let { type, _id } = req.body;
    try {
        if (type === 'seller') {
            //remove clients from seller
            mongo.clients.updateMany({
                sellerId: _id
            }, {
                $unset: {
                    sellerId: 1
                }
            }, (err, updateInfo) => {
                //delete all seller's invoices
                /* mongo.invoice.remove({
                    sellerId: _id
                }, (err, deleteInfo) => {
                    
                }) */
                //delete seller's commands
                mongo.cmd.remove({
                    sellerId: _id
                }, (err, deleteInfo) => {
                    try {
                        //delete seller
                        mongo.sellers.remove({
                            _id: mongo.mongoID(_id)
                        }, {
                            justOne: true
                        }, (err, deleteInfo) => {
                            //delete sessions
                            const args = {
                                _id,
                                type
                            }
                            ServerUtils.clearUserSessions(args).then(info => {
                                res.send({
                                    ok: true,
                                })
                            })
                        })
                    } catch (error) {

                    }
                })
            })
        } else if (type === 'magasin') {
            mongo.magasin.remove({
                _id: mongo.mongoID(_id)
            }, {
                justOne: true
            }, (err, deleteInfo) => {
                //delete sessions
                mongo.sessions.updateMany({
                    "session.magasin": _id
                }, {
                    $unset: {
                        "session.magasin": 1
                    }
                }, (err, deleteInfo) => {
                    res.send({
                        ok: true,
                    })
                })
            });
        } else if (type === 'admin') {
            mongo.admin.remove({
                _id: mongo.mongoID(_id)
            }, {
                justOne: true
            }, (err, deleteInfo) => {
                //delete sessions
                mongo.sessions.updateMany({
                    "session.admin": _id
                }, {
                    $unset: {
                        "session.admin": 1
                    }
                }, (err, deleteInfo) => {
                    res.send({
                        ok: true,
                    })
                })
            });
        }
    } catch (error) {

    }
}
module.exports = superDeleteAccount;